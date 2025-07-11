# ProtoLab Developer Manual

## System Architecture Overview

### Technology Stack
- **Frontend**: React + TypeScript + Vite
- **Backend**: Express.js + Node.js
- **Database**: PostgreSQL + Drizzle ORM
- **AI Engine**: OpenAI GPT-4o
- **Video Generation**: Tavus API
- **Mobile**: Expo (React Native)
- **Payments**: Stripe + RevenueCat
- **Authentication**: Passport.js + Sessions

### Project Structure
```
protolab/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Route-based pages
│   │   ├── lib/           # Utilities and configs
│   │   └── hooks/         # Custom React hooks
├── server/                # Express backend
│   ├── routes.ts          # API endpoints
│   ├── auth.ts           # Authentication logic
│   ├── db.ts             # Database connection
│   └── storage.ts        # Data access layer
├── shared/               # Shared types and schemas
│   └── schema.ts         # Database schema definitions
└── docs/                # Documentation
```

## Core Features Implementation

### 1. AI Pitch Generation System

#### Endpoint: `/api/intelligence/generate-enhanced-pitch`
```typescript
// Enhanced pitch generation with document upload
app.post('/api/intelligence/generate-enhanced-pitch', 
  upload.array('supportingDocuments', 5), 
  async (req, res) => {
    const { businessIdea, industry, target, fundingAmount, stage, teamSize, 
            websiteUrl, additionalContext } = req.body;
    const files = req.files as Express.Multer.File[];

    // Document analysis pipeline
    let documentContent = '';
    if (files && files.length > 0) {
      // Extract text from uploaded documents
      const textPromises = files.map(async (file) => {
        if (file.mimetype === 'application/pdf') {
          return extractPDFText(file);
        } else if (file.mimetype.includes('text')) {
          return file.buffer.toString('utf-8');
        }
        return `[File: ${file.originalname}]`;
      });
      const texts = await Promise.all(textPromises);
      documentContent = texts.join('\n\n');
    }

    // OpenAI integration
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Expert pitch deck consultant specializing in African markets."
        },
        {
          role: "user",
          content: buildEnhancedPrompt(req.body, documentContent)
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 4000
    });

    const pitchContent = JSON.parse(response.choices[0].message.content);
    
    // Generate professional HTML
    const htmlContent = generateEnhancedPitchHTML(pitchContent, businessIdea);
    
    // Store for export
    const pitchId = generatePitchId();
    storePitchData(pitchId, { content: pitchContent, html: htmlContent });

    res.json({
      success: true,
      id: pitchId,
      pitch: pitchContent,
      html: htmlContent,
      preview: htmlContent.substring(0, 800) + '...'
    });
  }
);
```

#### Cost Optimization
```typescript
// Credit usage tracking
const GENERATION_COST = 0.085; // $0.085 per generation
const trackUsage = async (userId: string, operation: string) => {
  await db.insert(usageTracking).values({
    userId,
    operation,
    cost: GENERATION_COST,
    timestamp: new Date()
  });
};
```

### 2. Multi-Format Export System

#### Endpoint: `/api/intelligence/export-pitch`
```typescript
app.post('/api/intelligence/export-pitch', async (req, res) => {
  const { pitchId, format } = req.body;
  const pitch = retrievePitchData(pitchId);

  switch (format) {
    case 'pdf':
      const pdfBuffer = await generatePDF(pitch.html);
      res.setHeader('Content-Type', 'application/pdf');
      res.send(pdfBuffer);
      break;

    case 'pptx':
      const pptxBuffer = await generatePowerPoint(pitch.content);
      res.setHeader('Content-Type', 
        'application/vnd.openxmlformats-officedocument.presentationml.presentation');
      res.send(pptxBuffer);
      break;

    case 'video':
      if (process.env.TAVUS_API_KEY) {
        const videoUrl = await generateTavusVideo(pitch.content);
        res.json({ success: true, videoUrl });
      } else {
        res.status(501).json({ error: 'Video generation requires Tavus API key' });
      }
      break;
  }
});
```

### 3. Document Intelligence Pipeline

#### File Processing
```typescript
const processUploadedDocument = async (file: Express.Multer.File) => {
  let extractedText = '';
  
  switch (file.mimetype) {
    case 'application/pdf':
      extractedText = await extractPDFText(file);
      break;
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      extractedText = await extractDocxText(file);
      break;
    case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
      extractedText = await extractPptxText(file);
      break;
    default:
      extractedText = file.buffer.toString('utf-8');
  }

  // AI analysis of extracted content
  const analysis = await analyzeDocumentWithAI(extractedText, file);
  return { text: extractedText, analysis };
};
```

### 4. Authentication & Authorization

#### User Registration with African Phone Validation
```typescript
export const registerUser = async (req: Request, res: Response) => {
  const { username, email, phone, password, country } = req.body;

  // Validate African phone numbers
  if (!validateAfricanPhone(phone)) {
    return res.status(400).json({ error: 'Invalid African phone number format' });
  }

  const carrier = detectCarrier(phone);
  const detectedCountry = detectCountryFromPhone(phone);

  const hashedPassword = await bcrypt.hash(password, 12);
  
  const user = await storage.createUser({
    username,
    email,
    phone,
    password: hashedPassword,
    country: country || detectedCountry,
    carrier,
    plan: 'starter',
    credits: 5, // Starter tier credits
    createdAt: new Date()
  });

  req.login(user, (err) => {
    if (err) return res.status(500).json({ error: 'Login failed after registration' });
    res.json({ success: true, user: sanitizeUser(user) });
  });
};
```

### 5. Payment Integration

#### RevenueCat Integration
```typescript
const processSubscription = async (userId: string, plan: string) => {
  const planCredits = {
    'starter': 5,
    'hustler': 100,
    'founder': 200,
    'corporate': 500
  };

  await storage.updateUserPlan(userId, {
    plan,
    credits: planCredits[plan],
    subscriptionStarted: new Date()
  });

  // Track revenue
  await trackRevenue(userId, plan, getPlanPrice(plan));
};
```

### 6. Tavus Video Generation

#### Video API Integration
```typescript
const generateTavusVideo = async (pitchContent: any): Promise<string> => {
  const script = pitchContent.slides.map((slide: any) => 
    `${slide.title}. ${slide.content?.join('. ') || ''}`
  ).join(' ');

  const response = await fetch('https://tavusapi.com/v2/videos', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.TAVUS_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      script,
      persona_id: 'business_presenter',
      background: 'professional_office',
      voice: 'natural_professional'
    })
  });

  const result = await response.json();
  return result.video_url;
};
```

## Database Schema

### Core Tables
```typescript
// User management
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 50 }).notNull().unique(),
  email: varchar('email', { length: 255 }).unique(),
  phone: varchar('phone', { length: 20 }).notNull(),
  password: varchar('password', { length: 255 }).notNull(),
  country: varchar('country', { length: 2 }),
  carrier: varchar('carrier', { length: 50 }),
  plan: planEnum('plan').notNull().default('starter'),
  credits: integer('credits').notNull().default(5),
  createdAt: timestamp('created_at').defaultNow()
});

// Pitch storage
export const pitches = pgTable('pitches', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  title: varchar('title', { length: 255 }).notNull(),
  content: json('content').notNull(),
  htmlContent: text('html_content'),
  industry: varchar('industry', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow()
});

// Usage tracking
export const usageTracking = pgTable('usage_tracking', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  operation: varchar('operation', { length: 50 }).notNull(),
  cost: decimal('cost', { precision: 10, scale: 4 }),
  timestamp: timestamp('timestamp').defaultNow()
});
```

## API Endpoints Reference

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile

### Pitch Generation
- `POST /api/intelligence/generate-enhanced-pitch` - Generate AI pitch
- `POST /api/intelligence/export-pitch` - Export in various formats
- `GET /api/pitches` - List user pitches
- `DELETE /api/pitches/:id` - Delete pitch

### User Management
- `GET /api/user/credits` - Get user credit balance
- `POST /api/user/upgrade` - Upgrade subscription
- `GET /api/user/usage` - Get usage statistics

### Admin
- `GET /api/admin/dashboard` - Admin dashboard data
- `GET /api/admin/users` - User management
- `POST /api/admin/settings` - Update system settings

## Environment Variables

### Required Configuration
```env
# Database
DATABASE_URL=postgresql://username:password@host:port/database

# OpenAI
OPENAI_API_KEY=sk-...

# Tavus Video Generation
TAVUS_API_KEY=tvs_...

# Stripe Payments
STRIPE_SECRET_KEY=sk_...
VITE_STRIPE_PUBLIC_KEY=pk_...

# RevenueCat
REVENUECAT_API_KEY=...

# Session Management
SESSION_SECRET=your-secret-key

# Application
NODE_ENV=production
PORT=5000
```

## Performance Optimization

### Caching Strategy
```typescript
// In-memory cache for frequent queries
const cache = new Map<string, any>();

const getCachedData = (key: string, generator: () => Promise<any>, ttl = 300000) => {
  if (cache.has(key)) {
    const { data, timestamp } = cache.get(key);
    if (Date.now() - timestamp < ttl) {
      return data;
    }
  }
  
  const data = generator();
  cache.set(key, { data, timestamp: Date.now() });
  return data;
};
```

### Rate Limiting
```typescript
import rateLimit from 'express-rate-limit';

const generationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: 'Too many generation requests, please try again later.'
});

app.use('/api/intelligence', generationLimiter);
```

## Testing Strategy

### Unit Tests
```typescript
describe('Pitch Generation', () => {
  test('should generate valid pitch content', async () => {
    const mockRequest = {
      businessIdea: 'AI-powered agriculture platform',
      industry: 'agtech',
      target: 'smallholder farmers'
    };
    
    const result = await generatePitchContent(mockRequest);
    
    expect(result.slides).toHaveLength(10);
    expect(result.slides[0].title).toBeDefined();
  });
});
```

### Integration Tests
```typescript
describe('API Endpoints', () => {
  test('POST /api/intelligence/generate-enhanced-pitch', async () => {
    const response = await request(app)
      .post('/api/intelligence/generate-enhanced-pitch')
      .send({
        businessIdea: 'Test business',
        industry: 'fintech'
      })
      .expect(200);
      
    expect(response.body.success).toBe(true);
    expect(response.body.pitch).toBeDefined();
  });
});
```

## Deployment Guide

### Production Deployment with Replit
1. Configure environment variables in Replit Secrets
2. Set up database connection
3. Configure domain and SSL
4. Deploy using Replit Deployments

### Mobile App Deployment with Expo
```bash
# Install Expo CLI
npm install -g expo-cli

# Build for production
expo build:android
expo build:ios

# Submit to stores
expo upload:android
expo upload:ios
```

## Monitoring & Analytics

### Error Tracking
```typescript
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV
});

// Error handling middleware
app.use(Sentry.Handlers.errorHandler());
```

### Performance Monitoring
```typescript
const trackPerformance = (operation: string, duration: number) => {
  console.log(`${operation} completed in ${duration}ms`);
  
  // Send to analytics service
  if (duration > 5000) {
    console.warn(`Slow operation detected: ${operation} took ${duration}ms`);
  }
};
```

## Security Best Practices

### Input Validation
```typescript
import { z } from 'zod';

const pitchGenerationSchema = z.object({
  businessIdea: z.string().min(10).max(1000),
  industry: z.enum(['agtech', 'fintech', 'healthtech', 'edtech']),
  target: z.string().min(5).max(500)
});

// Validate request body
const validatePitchRequest = (req: Request, res: Response, next: NextFunction) => {
  try {
    pitchGenerationSchema.parse(req.body);
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid request data' });
  }
};
```

### Authentication Middleware
```typescript
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
};

export const requirePlan = (planLevel: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userPlan = req.user?.plan;
    if (!hasPlanAccess(userPlan, planLevel)) {
      return res.status(403).json({ error: 'Upgrade required' });
    }
    next();
  };
};
```

This developer manual provides comprehensive guidance for maintaining and extending the ProtoLab platform with focus on scalability, performance, and African market optimization.