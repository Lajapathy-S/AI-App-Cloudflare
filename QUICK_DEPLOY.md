# Quick Deployment Guide

## ⚠️ Important: The application needs to be deployed first!

The code is in GitHub, but you need to deploy it to Cloudflare to get a working URL.

## Step 1: Install Node.js (Required)

**Download and install Node.js:**
1. Go to: https://nodejs.org/
2. Download the LTS version (v20.x or v18.x)
3. Run the installer
4. **Restart your terminal/PowerShell** after installation

**Verify installation:**
```bash
node --version
npm --version
```

Both should show version numbers.

## Step 2: Navigate to Project

```bash
cd C:\Users\smrll\AI-App-Cloudflare
```

## Step 3: Install Dependencies

```bash
npm install
```

This will install:
- `wrangler` (Cloudflare CLI)
- `agents` (Cloudflare Agents SDK)
- TypeScript and other dependencies

## Step 4: Login to Cloudflare

```bash
npx wrangler login
```

This will:
1. Open your browser
2. Ask you to log in to Cloudflare
3. Authorize Wrangler CLI

## Step 5: Deploy the Worker

```bash
npx wrangler deploy
```

Or:
```bash
npm run deploy
```

**After deployment, you'll see:**
```
➜  Deployed to https://ai-app-cloudflare.YOUR_SUBDOMAIN.workers.dev
```

**Note this Worker URL** - you'll need it for the frontend.

## Step 6: Deploy the Pages Frontend

```bash
npx wrangler pages deploy public --project-name=ai-app-cloudflare
```

Or:
```bash
npm run pages:deploy
```

**After deployment, you'll see:**
```
➜  Deployed to https://ai-app-cloudflare.pages.dev
```

## ✅ Your Application URL

**Use this URL:** `https://ai-app-cloudflare.pages.dev`

This is your working application URL!

## Alternative: Deploy via Cloudflare Dashboard

If you prefer using the dashboard:

1. **For Workers:**
   - Go to: https://dash.cloudflare.com/
   - Navigate to: Workers & Pages > Create Application
   - Choose: Workers
   - Connect your GitHub repository
   - Select: `AI-App-Cloudflare`
   - Build command: `npm install && npm run build` (if needed)
   - Deploy

2. **For Pages:**
   - Go to: Workers & Pages > Create Application
   - Choose: Pages
   - Connect your GitHub repository
   - Root directory: `/public`
   - Build command: (leave empty - it's static)
   - Deploy

## Troubleshooting

### "npm is not recognized"
- Install Node.js from nodejs.org
- **Restart your terminal** after installation
- Try again

### "wrangler login failed"
- Make sure you have a Cloudflare account
- Check your internet connection
- Try: `npx wrangler login --browser`

### "Deployment failed"
- Check you're logged in: `npx wrangler whoami`
- Verify Cloudflare account has Workers access
- Check the error message in the terminal

### "AI binding not found"
- Go to Cloudflare Dashboard
- Workers & Pages > Your Worker > Settings
- Add binding: Name: `AI`, Type: `Workers AI`

## After Deployment Checklist

- [ ] Node.js installed
- [ ] Dependencies installed (`npm install`)
- [ ] Logged in to Cloudflare (`wrangler login`)
- [ ] Worker deployed successfully
- [ ] Pages deployed successfully
- [ ] Have the Pages URL (your app URL)
- [ ] Tested the URL in browser

**Once deployed, share the Pages URL!**

