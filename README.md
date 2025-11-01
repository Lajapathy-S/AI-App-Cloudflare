# AI-Powered Application on Cloudflare

An AI-powered chat application built on Cloudflare's platform with the following components:

## Features

- **LLM Integration**: Uses Llama 3.3 via Cloudflare Workers AI
- **State Management**: Persistent conversation history using Durable Objects with SQLite
- **Real-time Chat**: WebSocket support for real-time bidirectional communication
- **User Interface**: Modern, responsive chat interface built with Pages
- **Workflow/Coordination**: Durable Objects for stateful coordination and persistence

## Architecture

- **Agent**: `ChatAgent` class extending Cloudflare's `Agent` class
- **State Management**: SQLite database within Durable Objects for persistent state
- **Frontend**: Static HTML/JS deployed via Cloudflare Pages
- **Communication**: WebSocket for real-time chat, HTTP POST as fallback

## Components Included

✅ **LLM**: Llama 3.3 on Workers AI (ready to integrate)  
✅ **Workflow/Coordination**: Durable Objects (`ChatAgent`)  
✅ **User Input**: Chat interface via Pages with WebSocket support  
✅ **Memory/State**: SQLite database for conversation history and state persistence  

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure your Cloudflare account:
```bash
wrangler login
```

3. Deploy the Workers:
```bash
npm run deploy
```

4. Deploy the Pages frontend:
```bash
npm run pages:deploy
```

## Local Development

1. Run the Worker locally:
```bash
npm run dev
```

2. Run the Pages frontend:
```bash
npm run pages:dev
```

## Project Structure

```
├── src/
│   ├── index.ts      # Main Worker entry point
│   └── agent.ts      # ChatAgent Durable Object implementation
├── public/
│   └── index.html    # Frontend chat interface
├── wrangler.jsonc    # Cloudflare configuration
├── package.json      # Dependencies
└── README.md         # This file
```

## Features Implementation

### State Management
- Conversation history stored in SQLite within Durable Objects
- Persistent across requests and deployments
- Message count tracking

### Real-time Communication
- WebSocket support for instant message delivery
- HTTP POST fallback for compatibility
- Connection status indicators

### LLM Integration
- Ready for Llama 3.3 integration via Workers AI
- Context-aware responses using conversation history
- Error handling and graceful fallbacks

## Deployment

After deployment, you'll receive:
- Worker URL: For API endpoints
- Pages URL: For the chat interface

The application automatically handles routing and WebSocket upgrades.

## License

MIT
