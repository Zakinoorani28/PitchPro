#!/bin/bash

# ProtoLab GitHub Deployment Script
# This script helps you deploy your ProtoLab app to GitHub and then to a hosting platform

echo "🚀 ProtoLab GitHub Deployment Script"
echo "====================================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📝 Initializing git repository..."
    git init
fi

# Add all files
echo "📁 Adding all files to git..."
git add .

# Commit changes
echo "💾 Committing changes..."
git commit -m "ProtoLab AI: Deploy with $475+ hackathon perks integrated

Features included:
- Tavus AI Video Generation ($150 FREE credits)
- Pica Pro Design Tools (2 months FREE)
- Lingo Multi-language Support ($50 FREE credits)
- Sentry Professional Monitoring (6 months FREE)
- RevenueCat Subscription Management (FREE until $2.5K/month)
- Dappier AI Content Enhancement ($25 FREE credits)
- Full-stack TypeScript application
- PostgreSQL database integration
- African payment systems (M-Pesa, Flutterwave)
- AI-powered pitch generation with OpenAI"

echo "🔗 Next steps:"
echo "1. Create a new repository on GitHub"
echo "2. Run: git remote add origin https://github.com/YOUR_USERNAME/protolab-ai-pitch-generator.git"
echo "3. Run: git push -u origin main"
echo "4. Deploy to Vercel, Railway, or Render"
echo ""
echo "📖 See GITHUB-DEPLOYMENT-GUIDE.md for detailed instructions"
echo "🎯 Your app is production-ready with all premium features!"