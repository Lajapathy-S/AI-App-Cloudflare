# Install Node.js to Get npx

## Problem
`npx` is not recognized because Node.js is not installed on your computer.

## Solution: Install Node.js

### Step 1: Download Node.js

1. **Go to:** https://nodejs.org/
2. **Download the LTS version** (Long Term Support)
   - Recommended: **v20.x** or **v18.x**
   - Click the big green "LTS" download button
   - Choose Windows Installer (.msi) for 64-bit

### Step 2: Install Node.js

1. **Run the downloaded installer** (e.g., `node-v20.x.x-x64.msi`)
2. **Follow the installation wizard:**
   - Click "Next" through the prompts
   - ✅ Check "Automatically install necessary tools"
   - Click "Install"
   - Wait for installation to complete
3. **Click "Finish"** when done

### Step 3: Restart Terminal/PowerShell

**IMPORTANT:** After installing Node.js:
1. **Close your current PowerShell/Command Prompt window**
2. **Open a NEW PowerShell/Command Prompt window**
3. This is required for Node.js to be recognized

### Step 4: Verify Installation

In your NEW terminal window, run:

```bash
node --version
```

You should see: `v20.x.x` (or similar)

```bash
npm --version
```

You should see: `10.x.x` (or similar)

```bash
npx --version
```

You should see: `10.x.x` (or similar)

If all three commands show version numbers, you're good to go!

## Step 5: Now Get Your URL

After installing Node.js, navigate to your project and deploy:

```bash
# Navigate to project
cd C:\Users\smrll\AI-App-Cloudflare

# Deploy Pages (get your URL!)
npx wrangler pages deploy public --project-name=ai-app-cloudflare
```

## Quick Checklist

- [ ] Download Node.js from nodejs.org
- [ ] Install Node.js (run the installer)
- [ ] **Restart terminal** (close and open new window)
- [ ] Verify with `node --version`, `npm --version`, `npx --version`
- [ ] Navigate to project: `cd C:\Users\smrll\AI-App-Cloudflare`
- [ ] Deploy Pages: `npx wrangler pages deploy public --project-name=ai-app-cloudflare`

## Troubleshooting

### "Still says npx not recognized"
- **Solution:** Close and reopen your terminal window
- **Solution:** Restart your computer if needed
- **Check:** Node.js is installed in Program Files or Program Files (x86)

### "Can't find Node.js installer"
- **Direct link:** https://nodejs.org/en/download/
- **Choose:** Windows Installer (.msi) - 64-bit

### "Installation failed"
- **Check:** You have administrator rights
- **Try:** Right-click installer → "Run as administrator"
- **Check:** You have enough disk space

## After Installing Node.js

Once Node.js is installed, you can:

1. **Deploy your Pages:**
   ```bash
   cd C:\Users\smrll\AI-App-Cloudflare
   npx wrangler pages deploy public --project-name=ai-app-cloudflare
   ```

2. **Get your application URL** from the output

3. **Share the Pages URL** as your working application!

## Summary

1. **Install Node.js** from https://nodejs.org/ (LTS version)
2. **Restart terminal** (important!)
3. **Verify** with `node --version`, `npm --version`, `npx --version`
4. **Deploy Pages** to get your URL

That's it!
