# ProtoLab AI Pitch Prototyper

## Overview

ProtoLab is a production-ready B2B SaaS platform that generates professional pitch decks using AI technology, specifically optimized for African entrepreneurs and global startups. The platform combines advanced AI content generation with collaborative features, payment processing, and comprehensive analytics to deliver a complete business presentation solution.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express server framework
- **Language**: TypeScript for consistent type safety across the stack
- **API Design**: RESTful API with modular route organization
- **Authentication**: JWT-based authentication with bcrypt password hashing
- **File Handling**: Multer for multipart form data and file uploads

### Database Layer
- **Database**: PostgreSQL for robust relational data storage
- **ORM**: Drizzle ORM for type-safe database operations
- **Connection**: Neon serverless PostgreSQL with connection pooling
- **Migrations**: Drizzle Kit for schema management

## Key Components

### AI Content Generation Engine
- **Primary Provider**: OpenAI GPT-4o for high-quality content generation
- **Fallback Provider**: DeepSeek AI for redundancy and cost optimization
- **Document Analysis**: Intelligent document parsing and pattern recognition
- **Content Types**: Pitch decks, business plans, resumes, and 3D video presentations

### Payment Processing System
- **Global Payments**: Stripe integration for international card processing
- **African Mobile Money**: M-Pesa integration for Kenyan market
- **Pan-African**: Flutterwave for broader African market coverage
- **Subscription Management**: RevenueCat for unified subscription handling

### Collaboration Features
- **Real-time Workspaces**: Multi-user document editing and review
- **Role-based Access**: Owner, editor, reviewer, and viewer permissions
- **Document Versioning**: Change tracking and approval workflows
- **Comment System**: Inline comments and feedback management

### Analytics and Monitoring
- **User Analytics**: Comprehensive user behavior tracking
- **Performance Monitoring**: Real-time system health metrics
- **Error Tracking**: Custom error capture and logging system
- **Business Intelligence**: Revenue tracking and conversion metrics

## Data Flow

### User Registration Flow
1. User submits registration form with phone validation
2. System validates African phone number patterns
3. Password is hashed using bcrypt
4. User record is created in PostgreSQL database
5. JWT token is generated for session management

### Pitch Generation Flow
1. User inputs business parameters through React form
2. Request is validated and sent to Express API
3. OpenAI API processes business context
4. AI generates structured pitch content
5. Content is formatted and returned to frontend
6. User can export to PDF, PowerPoint, or HTML formats

### Payment Processing Flow
1. User selects subscription tier
2. Payment method is determined by region (Stripe/M-Pesa)
3. Payment is processed through appropriate provider
4. User account is upgraded with new permissions
5. Usage limits are updated in database

## External Dependencies

### AI Services
- **OpenAI GPT-4o**: Primary content generation ($0.085 per pitch)
- **DeepSeek AI**: Alternative provider for redundancy
- **Document Intelligence**: File parsing and analysis capabilities

### Payment Providers
- **Stripe**: Global card processing and subscription management
- **M-Pesa**: Kenya mobile money integration
- **Flutterwave**: Pan-African payment gateway
- **RevenueCat**: Cross-platform subscription management

### Infrastructure Services
- **Neon Database**: Serverless PostgreSQL hosting
- **Replit**: Development environment and deployment platform
- **CDN**: Static asset delivery optimization

## Deployment Strategy

### Environment Configuration
- **Development**: Local development with hot reload via Vite
- **Production**: Replit deployment with auto-scaling infrastructure
- **Database**: Neon serverless PostgreSQL with automatic backups
- **Static Assets**: Served through Replit's built-in CDN

### Build Process
1. TypeScript compilation and type checking
2. Vite builds React frontend to `dist/public`
3. esbuild bundles Express server to `dist/index.js`
4. Static assets are optimized and compressed
5. Application starts with production environment variables

### Scaling Strategy
- **Auto-scaling**: Replit handles traffic spikes automatically
- **Database**: Connection pooling prevents resource exhaustion
- **Caching**: In-memory caching for frequently accessed data
- **Rate Limiting**: API throttling to prevent abuse

## Recent Changes

- **Hackathon Perks Integration**: Added professional-grade features worth $475+ in value
- **Enhanced 3D Video Generation**: Upgraded with Tavus AI, advanced lighting, and interactive elements
- **Multi-language Support**: Integrated Lingo for 85+ language localization
- **Premium Design Tools**: Added Pica Pro templates and brand consistency features
- **Professional Monitoring**: Sentry error tracking and performance monitoring active
- **Monetization Ready**: RevenueCat subscription management integrated

## Hackathon Integrations Active

- **Tavus AI Video**: $150 credits for conversational video generation
- **Pica Pro Design**: 2 months free premium templates and design tools
- **Lingo Localization**: $50 credits for multi-language content
- **Sentry Monitoring**: 6 months free professional error tracking
- **RevenueCat**: Free subscription management until $2.5K/month
- **Dappier AI**: $25 credits for enhanced content and search

## Changelog

- January 7, 2025: Integrated $475+ worth of hackathon perks and premium features
- June 25, 2025: Fixed frontend crashes, prepared GitHub repository
- June 24, 2025: Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.