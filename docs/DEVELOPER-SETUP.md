# Developer Setup Guide

## Quick Links
- **Live Demo**: https://protostudio.replit.app/
- **Repository**: https://github.com/mdundebe/protomdu
- **Documentation**: See README.md for complete feature overview

## For Code Reviewers

### What This Project Does
ProtoLab generates AI-powered pitch decks specifically for African entrepreneurs, featuring M-Pesa integration, regional pricing, and collaborative document editing.

### Key Areas to Review
1. **Authentication System** (`server/auth.ts`)
   - African phone number validation
   - JWT implementation
   - Security best practices

2. **Payment Integration** (`server/` payment files)
   - M-Pesa API integration
   - Flutterwave implementation
   - Stripe fallback

3. **AI Integration** (`server/ai-document-analysis.ts`)
   - OpenAI GPT-4o implementation
   - DeepSeek fallback system
   - Document intelligence features

4. **Database Schema** (`shared/schema.ts`)
   - Drizzle ORM implementation
   - Data relationships
   - Performance considerations

### Setup for Local Development
```bash
git clone https://github.com/mdundebe/protomdu.git
cd protomdu
npm install
npm run dev
```

### Environment Variables Needed
- OPENAI_API_KEY
- DEEPSEEK_API_KEY  
- STRIPE_SECRET_KEY
- DATABASE_URL

### Testing the Live Application
Visit https://protostudio.replit.app/ to test:
- Pitch deck generation
- Document upload functionality
- Payment integration (test mode)
- Collaborative features
- Analytics dashboard

### Architecture Highlights
- React 18 + TypeScript frontend
- Node.js + Express backend
- PostgreSQL with Drizzle ORM
- African market optimizations
- Real-time collaboration system

### Questions for Review
1. Security implementation assessment
2. Performance optimization suggestions
3. Code structure improvements
4. African market feature validation
5. Scalability recommendations