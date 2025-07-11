# M-Pesa Production Configuration Guide

## Required API Keys for Production

### 1. M-Pesa Production Keys
You need to obtain these from Safaricom Developer Portal (https://developer.safaricom.co.ke/):

```bash
# Add these to your Replit Secrets tab:
MPESA_CONSUMER_KEY=your_production_consumer_key
MPESA_CONSUMER_SECRET=your_production_consumer_secret
MPESA_BUSINESS_SHORTCODE=your_paybill_number
MPESA_PASSKEY=your_lipa_na_mpesa_passkey
MPESA_ENVIRONMENT=production
BASE_URL=https://your-replit-app.replit.app
```

### 2. How to Get M-Pesa Production Keys

#### Step 1: Create Safaricom Developer Account
1. Visit https://developer.safaricom.co.ke/
2. Click "Sign Up" and complete registration
3. Verify your email and phone number

#### Step 2: Create Production App
1. Login to developer portal
2. Click "Create App"
3. Select "Lipa Na M-Pesa Online"
4. Fill in your business details
5. Submit for approval (takes 1-3 business days)

#### Step 3: Get Your Paybill Number
1. Apply for M-Pesa Paybill through your bank or Safaricom
2. This becomes your `MPESA_BUSINESS_SHORTCODE`
3. You'll receive the passkey via email

### 3. Webhook URLs Configuration

Set these URLs in your Safaricom app:
```
Callback URL: https://your-replit-app.replit.app/api/webhooks/mpesa
Confirmation URL: https://your-replit-app.replit.app/api/webhooks/mpesa/confirmation
```

## Testing M-Pesa Integration

### Sandbox Testing (Free)
```bash
# Sandbox credentials (for testing only)
MPESA_CONSUMER_KEY=your_sandbox_consumer_key
MPESA_CONSUMER_SECRET=your_sandbox_consumer_secret
MPESA_BUSINESS_SHORTCODE=174379
MPESA_PASSKEY=bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919
MPESA_ENVIRONMENT=sandbox
```

### Test Phone Numbers (Sandbox)
- 254708374149 - Success
- 254708374150 - Insufficient funds
- 254708374151 - Invalid account
- 254708374152 - Generic failure

## Pricing Configuration

### Current Pricing Tiers
```javascript
// Amount in KES (Kenyan Shillings)
const PRICING = {
  hustler_plus: 950,  // ~$9.50 USD
  founder: 1900,      // ~$19 USD
  corporate: 4750     // ~$47.50 USD
};
```

### Multi-Currency Support
The system detects user country and adjusts pricing:
- Kenya: KES (1 USD = 100 KES)
- Nigeria: NGN (1 USD = 800 NGN)
- South Africa: ZAR (1 USD = 15 ZAR)
- Ghana: GHS (1 USD = 12 GHS)

## API Endpoints

### Authentication
```bash
POST /api/auth/register
{
  "name": "John Mwangi",
  "phone": "+254712345678",
  "email": "john@example.com",
  "password": "secure123"
}

POST /api/auth/login
{
  "phone": "+254712345678",
  "password": "secure123"
}
```

### M-Pesa Payment
```bash
POST /api/payment/mpesa
{
  "amount": 1900,
  "phone": "+254712345678",
  "accountReference": "PROTOLAB001"
}
```

### Check Payment Status
```bash
POST /api/payment/mpesa/status
{
  "checkoutRequestId": "ws_CO_191220191020363925"
}
```

## Security Considerations

### 1. Environment Variables
Never expose production keys in code. Use Replit Secrets:
- All M-Pesa credentials
- JWT secret key
- Database URL
- Callback URLs

### 2. Webhook Validation
M-Pesa callbacks are validated using:
- IP whitelist (Safaricom IPs only)
- Request signature verification
- Timeout handling (30 seconds max)

### 3. Rate Limiting
Implemented per-user limits:
- Free: 5 requests/day
- Hustler+: 50 requests/day
- Founder: 500 requests/day

## Production Deployment Checklist

### Before Going Live:
- [ ] Production M-Pesa app approved by Safaricom
- [ ] SSL certificate configured (automatic with Replit)
- [ ] Database migrations completed
- [ ] Webhook URLs configured in Safaricom portal
- [ ] Environment variables set in production
- [ ] Payment testing completed with small amounts
- [ ] Analytics tracking configured
- [ ] Error monitoring set up

### Post-Deployment:
- [ ] Monitor webhook delivery success rates
- [ ] Track conversion rates by country
- [ ] Set up automated reconciliation
- [ ] Configure backup payment methods
- [ ] Monitor user authentication flows

## Error Handling

### Common M-Pesa Errors:
1. **Invalid phone number**: Must be 254XXXXXXXXX format
2. **Insufficient funds**: User prompted to add money
3. **Network timeout**: Automatic retry after 30 seconds
4. **Invalid amount**: Must be between 1-70,000 KES
5. **Duplicate transaction**: Prevented by unique reference IDs

### Fallback Options:
- Flutterwave for card payments
- Bank transfer for corporate clients
- Mobile money for other African countries

## Analytics Dashboard

Track key metrics:
- Registration conversions by country
- Payment success rates by carrier
- User engagement by plan type
- Revenue by payment method
- Feature adoption rates

Access at: `/admin` (requires authentication)

## Support Contacts

### Safaricom Developer Support:
- Email: apisupport@safaricom.co.ke
- Phone: +254 722 002 020
- Portal: https://developer.safaricom.co.ke/support

### Technical Issues:
- Monitor logs in Replit console
- Check webhook delivery in Safaricom portal
- Verify callback URLs are accessible
- Test with sandbox before production