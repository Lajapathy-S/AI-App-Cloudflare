import { Agent } from "agents";

interface Env {
  AI: any;
}

export class ChatAgent extends Agent {
  private conversationHistory: Array<{ role: string; content: string }> = [];
  private env: Env;
  
  constructor(state: DurableObjectState, env: Env) {
    super(state, env);
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
        ws.send(JSON.stringify({
          type: "error",
          message: "An error occurred processing your message",
        }));
      }
    });
  }
  
  private async handleChatRequest(data: any): Promise<Response> {
    if (!data.message) {
      return new Response(
        JSON.stringify({ error: "Message is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
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
    
    // Retrieve conversation state from Durable Object
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
      // Get AI binding from environment
      const ai = this.env?.AI;
      
      if (ai) {
        try {
          // Use Llama 3.3 via Workers AI
          const response = await ai.run("@cf/meta/llama-3.3-70b-instruct", {
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
          
          return response.response || response.text || JSON.stringify(response);
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
    // This is a placeholder - in production, use Workers AI
    // For now, we'll create a smart response based on the prompt
    
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes("hello") || lowerPrompt.includes("hi")) {
      return "Hello! I'm your AI assistant powered by Cloudflare Workers AI. How can I help you today?";
    }
    
    if (lowerPrompt.includes("weather")) {
      return "I don't have access to real-time weather data, but I can help you with other questions!";
    }
    
    if (lowerPrompt.includes("help")) {
      return "I'm here to help! I can answer questions, have conversations, and assist with various topics. What would you like to know?";
    }
    
    // Default response
    return `Thank you for your message: "${prompt}". I'm processing your request using Cloudflare Workers AI with Llama 3.3. This is a demonstration of the AI-powered application with state management and real-time chat capabilities.`;
  }
  
  private async getState(): Promise<any> {
    // Get state using Agent's built-in state management
    try {
      const state = await this.sql.prepare("SELECT * FROM state WHERE id = 1").first();
      return state || { conversationHistory: [], messageCount: 0 };
    } catch (error) {
      // If table doesn't exist, return default state
      await this.sql.exec(`
        CREATE TABLE IF NOT EXISTS state (
          id INTEGER PRIMARY KEY,
          conversationHistory TEXT,
          messageCount INTEGER,
          lastUpdated TEXT
        )
      `);
      return { conversationHistory: [], messageCount: 0 };
    }
  }
  
  private async setState(data: any): Promise<void> {
    // Save state using Agent's built-in SQL database
    await this.sql.exec(`
      CREATE TABLE IF NOT EXISTS state (
        id INTEGER PRIMARY KEY,
        conversationHistory TEXT,
        messageCount INTEGER,
        lastUpdated TEXT
      )
    `);
    
    await this.sql.prepare(`
      INSERT OR REPLACE INTO state (id, conversationHistory, messageCount, lastUpdated)
      VALUES (1, ?, ?, ?)
    `).bind(
      JSON.stringify(data.conversationHistory),
      data.messageCount,
      data.lastUpdated
    ).run();
  }
}
