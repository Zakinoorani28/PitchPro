# ProtoLab AI Pitch Prototyper

A production-ready B2B SaaS platform that generates professional pitch decks using AI technology, specifically optimized for African entrepreneurs and global startups.

## 🌍 Repository
**[GitHub Repository →](https://github.com/Zakinoorani28/PitchPro)**

## 🚀 Features

### AI-Powered Content Generation
- Professional pitch deck creation with OpenAI GPT-4o
- Business plan generation with market analysis
- Document intelligence and pattern recognition
- 3D video presentation generation

### African Market Optimization
- M-Pesa mobile money integration (Kenya)
- Flutterwave pan-African payment gateway
- Regional pricing in local currencies
- African phone number validation
- Country-specific business templates

### Collaboration & Analytics
- Real-time collaborative workspaces
- Multi-user document editing
- Performance analytics dashboard
- Revenue tracking and conversion metrics
- Error monitoring and performance optimization

## 🛠 Tech Stack

**Frontend:**
- React 18 with TypeScript
- Tailwind CSS + shadcn/ui components
- Vite for fast development
- TanStack Query for state management

**Backend:**
- Node.js with Express
- TypeScript for type safety
- JWT authentication with bcrypt
- PostgreSQL with Drizzle ORM

**AI & Payments:**
- OpenAI GPT-4o + DeepSeek AI fallback
- Stripe for global payments
- M-Pesa API integration
- Flutterwave for Africa
- RevenueCat subscription management

## 🏗 Architecture

```
client/               # React frontend
├── src/
│   ├── components/   # UI components
│   ├── pages/        # Application pages
│   └── lib/          # Utilities and hooks

server/               # Express backend
├── auth.ts          # Authentication & African phone validation
├── analytics.ts     # Performance monitoring
├── ai-document-analysis.ts  # Document intelligence
└── routes.ts        # API endpoints

shared/
└── schema.ts        # Database schema with Drizzle
```

## 🚀 Quick Start

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Zakinoorani28/PitchPro.git
   cd protomdu
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   # Required API keys
   OPENAI_API_KEY=your_openai_key
   DEEPSEEK_API_KEY=your_deepseek_key
   STRIPE_SECRET_KEY=your_stripe_key
   DATABASE_URL=your_postgres_url
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

5. **Access the application:**
   - Frontend: http://localhost:5000
   - API: http://localhost:5000/api

## 🔧 Database Setup

The application uses PostgreSQL with Drizzle ORM:

```bash
# Push schema changes
npm run db:push

# Generate migrations
npm run db:generate
```

## 🌍 African Market Features

### Payment Integration
- **M-Pesa:** Direct mobile money integration for Kenya
- **Flutterwave:** Pan-African payment gateway
- **Regional Pricing:** Automatic currency conversion

### Phone Validation
```typescript
// Validates African phone number formats
validateAfricanPhone("+254712345678") // Kenya
validateAfricanPhone("+234812345678") // Nigeria
```

### Regional Optimization
- Country-specific business templates
- Local market data integration
- Carrier billing support for mobile users

## 📊 Analytics & Monitoring

- Real-time performance metrics
- User behavior tracking
- Revenue analytics by payment method
- Error tracking and alerting
- Mobile usage optimization

## 🔐 Security Features

- JWT-based authentication
- Phone number verification
- Rate limiting and API protection
- Secure payment processing
- GDPR compliance ready

## 📱 Mobile Optimization

- Responsive design for all screen sizes
- Touch-optimized interface
- Offline capability planning
- Progressive Web App features

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in this repository
- Email: mdundebe@gmail.com
- Live Demo: https://protostudio.replit.app/

## 🙏 Acknowledgments

- OpenAI for GPT-4o API
- Replit for development platform
- African tech community for market insights

---

**Built with ❤️ for African entrepreneurs and global startups**# protolab-ai-pitch-generator
