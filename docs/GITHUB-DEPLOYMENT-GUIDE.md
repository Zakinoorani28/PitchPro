# GitHub Deployment Guide for ProtoLab

## 📋 Pre-Deployment Checklist

Your ProtoLab app includes:
- ✅ $475+ in hackathon perks (Tavus, Pica, Lingo, Sentry, RevenueCat, Dappier)
- ✅ Full-stack TypeScript application
- ✅ PostgreSQL database integration
- ✅ African payment systems (M-Pesa, Flutterwave)
- ✅ AI-powered features with OpenAI integration

## 🚀 GitHub Repository Setup

### Step 1: Create GitHub Repository
1. Go to [GitHub.com](https://github.com)
2. Click "New repository"
3. Name it: `protolab-ai-pitch-generator`
4. Description: `AI-powered pitch deck generator for African entrepreneurs with $475+ in premium integrations`
5. Make it **Public** (to showcase your hackathon project)
6. Don't initialize with README (your zip already has one)

### Step 2: Upload Your Code
1. Extract your downloaded zip file
2. Open terminal/command prompt in the extracted folder
3. Run these commands:

```bash
# Initialize git repository
git init

# Add all files
git add .

# Commit with message
git commit -m "Initial commit: ProtoLab AI with $475+ hackathon perks integrated"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/protolab-ai-pitch-generator.git

# Push to GitHub
git push -u origin main
```

## 🌐 Deployment Options

### Option A: Vercel (Recommended - Free)

1. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Build Settings:**
   - Framework Preset: `Other`
   - Build Command: `npm run build`
   - Output Directory: `dist/public`
   - Install Command: `npm install`

3. **Environment Variables:**
   ```
   DATABASE_URL=your_neon_database_url
   OPENAI_API_KEY=your_openai_key
   NODE_ENV=production
   ```

4. **Deploy:**
   - Click "Deploy"
   - Your app will be live at `https://your-project.vercel.app`

### Option B: Railway (Great for Full-Stack)

1. **Connect to Railway:**
   - Go to [railway.app](https://railway.app)
   - Click "New Project"
   - Select "Deploy from GitHub repo"

2. **Configure:**
   - Select your repository
   - Railway auto-detects Node.js
   - Add PostgreSQL service if needed

3. **Environment Variables:**
   ```
   DATABASE_URL=your_database_url
   OPENAI_API_KEY=your_openai_key
   NODE_ENV=production
   PORT=3000
   ```

### Option C: Render (Good Free Tier)

1. **Connect to Render:**
   - Go to [render.com](https://render.com)
   - Click "New Web Service"
   - Connect your GitHub repository

2. **Configure:**
   - Build Command: `npm run build`
   - Start Command: `npm run start`
   - Environment: `Node`

## 🔧 Environment Variables Setup

### Required Variables:
```env
# Database
DATABASE_URL=postgresql://username:password@host:port/database

# AI Services
OPENAI_API_KEY=your_openai_key

# Hackathon Integrations (Optional for development)
TAVUS_API_KEY=your_tavus_key
PICA_API_KEY=your_pica_key  
LINGO_API_KEY=your_lingo_key
SENTRY_DSN=your_sentry_dsn
REVENUECAT_API_KEY=your_revenuecat_key
DAPPIER_API_KEY=your_dappier_key

# Payment Systems
STRIPE_SECRET_KEY=your_stripe_key
MPESA_CONSUMER_KEY=your_mpesa_key
MPESA_CONSUMER_SECRET=your_mpesa_secret
FLUTTERWAVE_SECRET_KEY=your_flutterwave_key

# Application
NODE_ENV=production
PORT=3000
```

## 📄 Update Package.json for Deployment

Make sure your `package.json` has these scripts:
```json
{
  "scripts": {
    "dev": "NODE_ENV=development tsx server/index.ts",
    "build": "vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist",
    "start": "NODE_ENV=production node dist/index.js",
    "check": "tsc",
    "db:push": "drizzle-kit push"
  }
}
```

## 🗄️ Database Setup

### For Neon Database (Recommended):
1. Go to [neon.tech](https://neon.tech)
2. Create new project
3. Copy connection string
4. Add to environment variables as `DATABASE_URL`

### For Railway PostgreSQL:
1. Add PostgreSQL service in Railway
2. Copy connection string from Railway dashboard
3. Add to environment variables

## 🎯 Post-Deployment Testing

### 1. Test Core Features:
```bash
# Test API endpoints
curl https://your-app.vercel.app/api/hackathon/status

# Test 3D video generation
curl -X POST https://your-app.vercel.app/api/generate-3d-video \
  -H "Content-Type: application/json" \
  -d '{"prompt": "AI startup pitch", "style": "professional"}'
```

### 2. Test Hackathon Integrations:
- Visit `/hackathon` route
- Test Tavus video generation
- Verify Sentry error tracking
- Check RevenueCat subscription management

### 3. Test Payment Systems:
- Test M-Pesa integration
- Verify Flutterwave payments
- Check Stripe card processing

## 📊 Monitoring & Analytics

### Sentry Integration:
- Error tracking is automatically active
- Performance monitoring included
- 6 months free Team plan

### RevenueCat Integration:
- Subscription management ready
- Free until $2.5K monthly revenue
- Cross-platform support

## 🎨 Custom Domain (Optional)

### For Vercel:
1. Go to project settings
2. Add custom domain
3. Update DNS records

### For Railway:
1. Go to project settings
2. Add custom domain
3. Configure DNS

## 🔐 Security Considerations

1. **Never commit API keys** to GitHub
2. **Use environment variables** for all secrets
3. **Enable HTTPS** (automatic on most platforms)
4. **Set up proper CORS** for production
5. **Monitor with Sentry** for errors

## 🚀 Go Live Checklist

- [ ] Code pushed to GitHub
- [ ] Deployment platform connected
- [ ] Environment variables configured
- [ ] Database connected and migrated
- [ ] All API endpoints tested
- [ ] Hackathon integrations verified
- [ ] Payment systems tested
- [ ] Custom domain configured (optional)
- [ ] Monitoring active

## 📞 Support Resources

### Platform Support:
- **Vercel**: [vercel.com/docs](https://vercel.com/docs)
- **Railway**: [docs.railway.app](https://docs.railway.app)
- **Render**: [render.com/docs](https://render.com/docs)

### Hackathon Integration Support:
- **Tavus**: [tavus.io/docs](https://tavus.io/docs)
- **Pica**: [pica.style/docs](https://pica.style/docs)
- **Lingo**: [lingo.dev/docs](https://lingo.dev/docs)
- **Sentry**: [docs.sentry.io](https://docs.sentry.io)
- **RevenueCat**: [docs.revenuecat.com](https://docs.revenuecat.com)

## 🎉 Success Metrics

Your deployed app will feature:
- Professional AI pitch generation
- $475+ in premium integrations
- African market optimization
- Enterprise-grade monitoring
- Production-ready payment systems

**Your ProtoLab platform is ready to serve African entrepreneurs globally!**