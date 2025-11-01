import { ChatAgent } from "./agent";

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    
    // Handle WebSocket upgrade for real-time chat
    if (url.pathname === "/chat" && request.headers.get("Upgrade") === "websocket") {
      const id = env.ChatAgent.idFromName("default");
      const stub = env.ChatAgent.get(id);
      return stub.fetch(request);
    }
    
    // Handle HTTP requests
    if (url.pathname === "/api/chat" && request.method === "POST") {
      const id = env.ChatAgent.idFromName("default");
      const stub = env.ChatAgent.get(id);
      return stub.fetch(request);
    }
    
    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }
    
    return new Response("Not Found", { status: 404 });
  },
};

interface Env {
  ChatAgent: DurableObjectNamespace;
  AI: any;
}

// Export ChatAgent for use in Durable Objects
export { ChatAgent } from "./agent";
