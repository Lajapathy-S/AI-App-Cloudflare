# Setup Workers.dev Subdomain - Quick Guide

## Error: You need a workers.dev subdomain

This is a **one-time setup** required for Cloudflare Workers.

## Step-by-Step Instructions

### Step 1: Go to Cloudflare Dashboard

1. **Open your browser**
2. **Go to:** https://dash.cloudflare.com/
3. **Log in** with your Cloudflare account

### Step 2: Open Workers Menu

1. In the left sidebar, **click on "Workers & Pages"** (or "Workers" in older dashboards)
2. **This is important:** Just opening this page for the first time will create your workers.dev subdomain automatically!

### Step 3: Verify Subdomain Created

After opening the Workers page, you should see:
- A message saying "workers.dev subdomain created" OR
- Your workers.dev subdomain (e.g., `yourname.workers.dev`) in the settings

**That's it!** The subdomain is now created.

### Step 4: Go Back to Terminal

Now you can deploy:

```bash
cd C:\Users\smrll\AI-App-Cloudflare
npx wrangler deploy
```

## Quick Checklist

- [ ] Logged into Cloudflare Dashboard (https://dash.cloudflare.com/)
- [ ] Opened "Workers & Pages" menu
- [ ] Saw confirmation or workers.dev subdomain created
- [ ] Ready to deploy with `npx wrangler deploy`

## Alternative: If You Can't Find It

1. **Go to:** https://dash.cloudflare.com/
2. **Click:** "Workers & Pages" in left sidebar
3. **Click:** "Overview" or any Workers page
4. **Look for:** "workers.dev" or "Create Subdomain" button
5. **If needed:** Click "Create workers.dev subdomain" or similar button

## After Setup

Once you've opened the Workers page, go back to your terminal and run:

```bash
npx wrangler deploy
```

This should work now!

## Troubleshooting

### "I don't see Workers & Pages menu"

- Make sure you're logged into the correct Cloudflare account
- Check that you have access to Workers (some accounts may need activation)
- Try refreshing the page

### "Subdomain not created"

- Make sure you clicked on the Workers/Pages menu item
- Try navigating to: https://dash.cloudflare.com/workers
- Look for any prompts or buttons to create subdomain

### "Still getting error after creating subdomain"

- Wait a minute for Cloudflare to process
- Try logging out and back in
- Run: `npx wrangler logout` then `npx wrangler login`

## Next Steps

After setting up the subdomain:

1. ✅ Create workers.dev subdomain (done in dashboard)
2. ✅ Deploy Worker: `npx wrangler deploy`
3. ✅ Deploy Pages: `npx wrangler pages deploy public --project-name=ai-app-cloudflare`
4. ✅ Get your URL!

The workers.dev subdomain is a one-time setup. Once created, you won't need to do this again!
