# Vercel Deployment Steps for ProtoLab

## 🚀 Step-by-Step Vercel Deployment

### Step 1: Go to Vercel
1. Open [vercel.com](https://vercel.com) in a new tab
2. Click "Start Deploying" or "New Project"
3. Sign in with your GitHub account

### Step 2: Import Your Repository
1. Look for "Import Git Repository" section
2. Find your `protolab-AI` repository
3. Click "Import" next to it

### Step 3: Configure Project Settings
**Framework Preset:** Other
**Root Directory:** ./
**Build Command:** `npm run build`
**Output Directory:** `dist/public`
**Install Command:** `npm install`

### Step 4: Add Environment Variables
Click "Add" for each of these:

```
DATABASE_URL
```
Value: Your Neon database URL from Replit

```
OPENAI_API_KEY
```
Value: Your OpenAI API key

```
NODE_ENV
```
Value: production

### Step 5: Deploy
1. Click "Deploy"
2. Wait for build to complete (2-3 minutes)
3. Your app will be live at: `https://protolab-ai.vercel.app`

## 🔧 If Build Fails - Backup Configuration

If the build fails, try these settings:

**Framework Preset:** Node.js
**Build Command:** `npm run build || npm run dev`
**Output Directory:** Leave empty
**Install Command:** `npm install --force`

## 🎯 Post-Deployment Testing

Once deployed, test these URLs:
- `https://your-app.vercel.app/` - Main app
- `https://your-app.vercel.app/hackathon` - Premium features showcase
- `https://your-app.vercel.app/api/hackathon/status` - API health check

## ✅ Success Indicators
- App loads without errors
- All premium hackathon features visible
- Sentry monitoring active
- Database connected
- API endpoints responding

Your ProtoLab app with $475+ in premium integrations will be live!