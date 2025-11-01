# Deployment Instructions

Follow these steps to deploy your AI-powered Cloudflare application:

## Prerequisites

1. **Cloudflare Account**: Sign up at [cloudflare.com](https://cloudflare.com) if you don't have one
2. **Node.js**: Ensure Node.js 18+ is installed
3. **Wrangler CLI**: Will be installed via npm

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Login to Cloudflare

```bash
npx wrangler login
```

This will open a browser window for authentication.

## Step 3: Deploy the Worker

```bash
npm run deploy
```

Or using wrangler directly:

```bash
npx wrangler deploy
```

This will deploy your Worker with the ChatAgent Durable Object.

## Step 4: Deploy the Pages Frontend

```bash
npm run pages:deploy
```

Or using wrangler directly:

```bash
npx wrangler pages deploy public
```

## Step 5: Configure AI Binding

After deployment, you need to enable Workers AI in your Cloudflare dashboard:

1. Go to your Cloudflare dashboard
2. Navigate to Workers & Pages
3. Select your worker (`ai-app-cloudflare`)
4. Go to Settings > Variables and Secrets
5. Add an AI binding named `AI` (this is configured in `wrangler.jsonc`)

The AI binding will automatically use Workers AI with Llama 3.3.

## Step 6: Get Your URLs

After deployment, you'll receive:

- **Worker URL**: `https://ai-app-cloudflare.YOUR_SUBDOMAIN.workers.dev`
- **Pages URL**: `https://ai-app-cloudflare.pages.dev` (or custom domain if configured)

## Testing Locally

Before deploying, you can test locally:

```bash
# Run Worker locally
npm run dev

# Run Pages locally (in another terminal)
npm run pages:dev
```

## Troubleshooting

### AI Binding Not Working

If you encounter errors with the AI binding:

1. Ensure Workers AI is enabled in your Cloudflare account
2. Check that the binding name matches (`AI` in `wrangler.jsonc`)
3. Verify you have Workers AI access (may require a paid plan)

### Durable Objects Not Initializing

1. Ensure migrations are properly configured in `wrangler.jsonc`
2. Check that the class name matches (`ChatAgent`)
3. Verify the binding name matches in both `wrangler.jsonc` and `src/index.ts`

### WebSocket Connection Issues

1. Ensure WebSocket support is enabled (default in Cloudflare Workers)
2. Check CORS settings if accessing from a different domain
3. Verify the WebSocket upgrade path (`/chat`)

## Production Checklist

- [ ] Dependencies installed
- [ ] Cloudflare account logged in
- [ ] Worker deployed successfully
- [ ] Pages frontend deployed successfully
- [ ] AI binding configured
- [ ] Worker URL accessible
- [ ] Pages URL accessible
- [ ] WebSocket connections working
- [ ] State persistence verified
- [ ] LLM responses working

## Notes

- The application uses a single Durable Object instance (`default`) for all chat sessions
- For production, consider implementing user-specific Durable Objects for better isolation
- State persists across deployments and restarts
- Workers AI usage may be subject to rate limits based on your plan
