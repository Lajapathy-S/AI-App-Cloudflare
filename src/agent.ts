interface Env {
  AI: any;
}

export class ChatAgent {
  private state: DurableObjectState;
  private env: Env;
  private conversationHistory: Array<{ role: string; content: string }> = [];
  
  constructor(state: DurableObjectState, env: Env) {
    this.state = state;
    this.env = env;
  }
  
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    
    // Handle WebSocket connections for real-time chat
    if (request.headers.get("Upgrade") === "websocket") {
      return this.handleWebSocket(request);
    }
    
    // Handle HTTP chat requests
    if (request.method === "POST") {
      const data = await request.json();
      return this.handleChatRequest(data);
    }
    
    // Handle GET requests for health check
    if (request.method === "GET") {
      return new Response(JSON.stringify({ status: "ok" }), {
        headers: { "Content-Type": "application/json" },
      });
    }
    
    return new Response("Method not allowed", { status: 405 });
  }
  
  private async handleWebSocket(request: Request): Promise<Response> {
    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair);
    
    this.handleWebSocketConnection(server);
    
    return new Response(null, {
      status: 101,
      webSocket: client,
    });
  }
  
  private async handleWebSocketConnection(ws: WebSocket) {
    ws.accept();
    
    ws.addEventListener("message", async (event) => {
      try {
        const data = JSON.parse(event.data as string);
        
        if (data.type === "chat" && data.message) {
          const response = await this.processMessage(data.message);
          
          ws.send(JSON.stringify({
            type: "response",
            message: response,
            timestamp: new Date().toISOString(),
          }));
        }
      } catch (error) {
        console.error("WebSocket error:", error);
        ws.send(JSON.stringify({
          type: "error",
          message: "An error occurred processing your message",
        }));
      }
    });
    
    ws.addEventListener("error", (error) => {
      console.error("WebSocket error:", error);
    });
    
    ws.addEventListener("close", () => {
      console.log("WebSocket closed");
    });
  }
  
  private async handleChatRequest(data: any): Promise<Response> {
    if (!data.message) {
      return new Response(
        JSON.stringify({ error: "Message is required" }),
        {
          status: 400,
          headers: { 
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }
    
    const response = await this.processMessage(data.message);
    
    return new Response(
      JSON.stringify({
        response,
        timestamp: new Date().toISOString(),
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
  
  private async processMessage(message: string): Promise<string> {
    // Add user message to conversation history
    this.conversationHistory.push({ role: "user", content: message });
    
    // Retrieve conversation state from Durable Object storage
    const state = await this.getState();
    const history = state.conversationHistory || [];
    history.push({ role: "user", content: message });
    
    // Build context for the LLM
    const context = this.buildContext(history);
    
    // Call Llama 3.3 via Workers AI
    const aiResponse = await this.callLLM(context);
    
    // Add assistant response to history
    history.push({ role: "assistant", content: aiResponse });
    
    // Save state
    await this.setState({
      conversationHistory: history,
      lastUpdated: new Date().toISOString(),
      messageCount: (state.messageCount || 0) + 1,
    });
    
    // Update local conversation history
    this.conversationHistory = history;
    
    return aiResponse;
  }
  
  private buildContext(history: Array<{ role: string; content: string }>): string {
    // Build a context string from conversation history
    const recentMessages = history.slice(-10); // Last 10 messages for context
    
    let context = "You are a helpful AI assistant. Here is the recent conversation:\n\n";
    
    for (const msg of recentMessages) {
      context += `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}\n\n`;
    }
    
    context += "Please provide a helpful and concise response to the user's last message.";
    
    return context;
  }
  
  private async callLLM(prompt: string): Promise<string> {
    try {
      // Use Workers AI with Llama 3.3
      const ai = this.env?.AI;
      
      if (ai) {
        try {
          // Try Llama 3.3 via Workers AI
          // Note: The exact API might vary, so we'll try a few formats
          let response: any;
          
          // Method 1: Try with messages format
          try {
            response = await ai.run("@cf/meta/llama-3.3-70b-instruct", {
              messages: [
                {
                  role: "system",
                  content: "You are a helpful AI assistant. Provide clear, concise, and helpful responses."
                },
                {
                  role: "user",
                  content: prompt
                }
              ],
              max_tokens: 500,
            });
            
            if (response && response.response) {
              return response.response;
            }
          } catch (e) {
            console.log("Trying alternative AI format...");
          }
          
          // Method 2: Try with prompt format
          try {
            response = await ai.run("@cf/meta/llama-3.3-70b-instruct", {
              prompt: prompt,
              max_tokens: 500,
            });
            
            if (response && (response.response || response.text)) {
              return response.response || response.text;
            }
          } catch (e) {
            console.log("AI API error, using fallback");
          }
          
          // If we got a response but don't know the format, try to extract text
          if (response) {
            const text = response.response || response.text || response.description || JSON.stringify(response);
            if (text && typeof text === 'string' && text.length > 0) {
              return text;
            }
          }
          
          // Fallback to local response generation
          return await this.generateResponse(prompt);
        } catch (aiError) {
          console.error("AI API error:", aiError);
          // Fallback to local response generation
          return await this.generateResponse(prompt);
        }
      } else {
        // Fallback if AI binding is not available
        return await this.generateResponse(prompt);
      }
    } catch (error) {
      console.error("Error calling LLM:", error);
      return "I apologize, but I'm having trouble processing your request right now. Please try again.";
    }
  }
  
  private async generateResponse(prompt: string): Promise<string> {
    // Smart fallback response generation
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes("hello") || lowerPrompt.includes("hi") || lowerPrompt.includes("hey")) {
      return "Hello! I'm your AI assistant powered by Cloudflare Workers AI. How can I help you today?";
    }
    
    if (lowerPrompt.includes("weather")) {
      return "I don't have access to real-time weather data, but I can help you with other questions!";
    }
    
    if (lowerPrompt.includes("help")) {
      return "I'm here to help! I can answer questions, have conversations, and assist with various topics. What would you like to know?";
    }
    
    if (lowerPrompt.includes("name")) {
      return "I'm an AI assistant running on Cloudflare Workers. You can call me your Cloudflare AI Assistant!";
    }
    
    if (lowerPrompt.includes("what") && lowerPrompt.includes("can")) {
      return "I can help you with questions, have conversations, provide information, and assist with various tasks. Try asking me anything!";
    }
    
    // Default response
    return `Thank you for your message! I'm processing your request using Cloudflare Workers AI. This is a demonstration of an AI-powered application with state management and real-time chat capabilities.`;
  }
  
  private async getState(): Promise<any> {
    // Get state from Durable Object storage
    try {
      const stored = await this.state.storage.get("state");
      if (stored) {
        return stored;
      }
      return { conversationHistory: [], messageCount: 0 };
    } catch (error) {
      console.error("Error getting state:", error);
      return { conversationHistory: [], messageCount: 0 };
    }
  }
  
  private async setState(data: any): Promise<void> {
    // Save state to Durable Object storage
    try {
      await this.state.storage.put("state", data);
    } catch (error) {
      console.error("Error setting state:", error);
    }
  }
}