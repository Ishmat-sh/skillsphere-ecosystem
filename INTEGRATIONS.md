# Advanced Integrations Setup Guide

This document provides comprehensive instructions for setting up and configuring the advanced integrations in SkillSphere.

## Table of Contents
1. [Huggingface AI Integration](#huggingface-ai-integration)
2. [Google OAuth Authentication](#google-oauth-authentication)
3. [Stripe Payment Integration](#stripe-payment-integration)
4. [Nodemailer Email Service](#nodemailer-email-service)
5. [Cloudinary File Upload](#cloudinary-file-upload)

---

## Huggingface AI Integration

### Overview
Huggingface AI is used for generating gig descriptions, proposal texts, sentiment analysis, and text summarization.

### Setup Instructions

1. **Get Huggingface API Key**
   - Go to [https://huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)
   - Sign in or create an account
   - Click "New token" to generate a new API key
   - Copy the generated token

2. **Configure Environment Variables**
   ```bash
   # In backend/.env
   HUGGINGFACE_API_KEY=your_huggingface_api_key_here
   ```

3. **Usage Examples**

   **Generate Gig Description**
   ```javascript
   const huggingfaceService = require('./services/huggingfaceService');
   
   const description = await huggingfaceService.generateGigDescription(
     'Web Development',
     ['JavaScript', 'React', 'Node.js']
   );
   ```

   **Generate Proposal Text**
   ```javascript
   const proposal = await huggingfaceService.generateProposalText(
     'E-commerce Website',
     'Need a modern e-commerce platform...',
     ['React', 'Node.js', 'MongoDB']
   );
   ```

   **Analyze Sentiment**
   ```javascript
   const sentiment = await huggingfaceService.analyzeSentiment(
     'This is an excellent service!'
   );
   ```

   **Summarize Text**
   ```javascript
   const summary = await huggingfaceService.summarizeText(
     'Long text to summarize...'
   );
   ```

### API Endpoints
The AI service is used internally by controllers. Add custom endpoints as needed in your controllers.

---

## Google OAuth Authentication

### Overview
Google OAuth allows users to sign in using their Google accounts, providing a seamless authentication experience.

### Setup Instructions

1. **Create Google OAuth 2.0 Credentials**
   - Go to [https://console.cloud.google.com/](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Navigate to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Configure the OAuth consent screen if prompted
   - Select "Web application" as application type
   - Add authorized redirect URI: `http://localhost:5000/api/auth/google/callback`
   - Copy the Client ID and Client Secret

2. **Configure Environment Variables**
   ```bash
   # In backend/.env
   GOOGLE_CLIENT_ID=your_google_client_id_here
   GOOGLE_CLIENT_SECRET=your_google_client_secret_here
   GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
   FRONTEND_URL=http://localhost:5173
   ```

3. **Update User Model**
   Ensure your User model has the following fields:
   ```javascript
   googleId: String,
   avatar: String,
   isVerified: { type: Boolean, default: false }
   ```

### Usage

**Frontend Integration**
```javascript
// Redirect to Google OAuth
window.location.href = 'http://localhost:5000/api/auth/google';

// Handle callback in your frontend
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');
if (token) {
  localStorage.setItem('token', token);
  // Redirect to dashboard
}
```

### API Endpoints
- `GET /api/auth/google` - Initiates Google OAuth flow
- `GET /api/auth/google/callback` - Handles OAuth callback

---

## Stripe Payment Integration

### Overview
Stripe handles all payment processing including escrow funding, payouts to freelancers, and refunds.

### Setup Instructions

1. **Create Stripe Account**
   - Go to [https://stripe.com](https://stripe.com)
   - Sign up for a Stripe account
   - Complete the verification process

2. **Get API Keys**
   - Navigate to "Developers" > "API keys"
   - Copy the "Secret key" (starts with `sk_`)
   - Copy the "Publishable key" (starts with `pk_`)

3. **Configure Environment Variables**
   ```bash
   # In backend/.env
   STRIPE_SECRET_KEY=sk_test_your_secret_key_here
   STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
   STRIPE_WEBHOOK_SECRET=your_webhook_secret_here
   ```

4. **Update User Model**
   Add Stripe account field to User model:
   ```javascript
   stripeAccountId: String
   ```

### Usage Examples

**Create Payment Intent**
```javascript
const response = await fetch('/api/payments/create-payment-intent', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    amount: 100,
    escrowId: 'escrow_id_here'
  })
});

const { clientSecret } = await response.json();
```

**Frontend Payment Processing**
```javascript
const stripe = Stripe('your_publishable_key');
const elements = stripe.elements();
const cardElement = elements.create('card');
cardElement.mount('#card-element');

const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
  payment_method: {
    card: cardElement,
  }
});
```

**Create Freelancer Connected Account**
```javascript
const response = await fetch('/api/payments/create-connected-account', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    email: 'freelancer@example.com'
  })
});
```

### API Endpoints
- `POST /api/payments/create-payment-intent` - Create payment intent
- `POST /api/payments/confirm-payment` - Confirm payment
- `POST /api/payments/create-connected-account` - Create Stripe account
- `POST /api/payments/create-account-link` - Create onboarding link
- `POST /api/payments/transfer-to-freelancer` - Transfer funds
- `POST /api/payments/refund` - Process refund
- `GET /api/payments/balance/:accountId` - Get account balance

---

## Nodemailer Email Service

### Overview
Nodemailer handles all email communications including welcome emails, notifications, and password resets.

### Setup Instructions

1. **Choose Email Provider**
   - Gmail (recommended for development)
   - SendGrid
   - Mailgun
   - AWS SES

2. **For Gmail Setup**
   - Enable 2-factor authentication on your Google account
   - Go to [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
   - Generate a new app password
   - Copy the generated password

3. **Configure Environment Variables**
   ```bash
   # In backend/.env
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_SECURE=false
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password_here
   EMAIL_FROM=noreply@skillsphere.com
   ```

### Usage Examples

**Send Welcome Email**
```javascript
const emailService = require('./services/emailService');
await emailService.sendWelcomeEmail('user@example.com', 'John Doe');
```

**Send Proposal Notification**
```javascript
await emailService.sendProposalReceivedEmail(
  'client@example.com',
  'Client Name',
  'Freelancer Name',
  'Gig Title'
);
```

**Send Payment Notification**
```javascript
await emailService.sendPaymentReleasedEmail(
  'freelancer@example.com',
  'Freelancer Name',
  500
);
```

### Available Email Functions
- `sendWelcomeEmail(userEmail, userName)` - Welcome new users
- `sendProposalReceivedEmail(clientEmail, clientName, freelancerName, gigTitle)` - Notify about new proposals
- `sendEscrowFundedEmail(freelancerEmail, freelancerName, gigTitle, amount)` - Notify when escrow is funded
- `sendPaymentReleasedEmail(freelancerEmail, freelancerName, amount)` - Notify about payment release
- `sendReviewNotificationEmail(userEmail, userName, reviewerName, rating, reviewText)` - Notify about new reviews
- `sendPasswordResetEmail(userEmail, userName, resetToken)` - Send password reset link

---

## Cloudinary File Upload

### Overview
Cloudinary handles all file uploads including profile pictures, gig images, and project files.

### Setup Instructions

1. **Create Cloudinary Account**
   - Go to [https://cloudinary.com](https://cloudinary.com)
   - Sign up for a free account
   - Navigate to the dashboard

2. **Get API Credentials**
   - Copy "Cloud name"
   - Copy "API Key"
   - Copy "API Secret"

3. **Configure Environment Variables**
   ```bash
   # In backend/.env
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

### Usage Examples

**Upload Single File**
```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);

const response = await fetch('/api/upload/single', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});

const { url, publicId } = await response.json();
```

**Upload Multiple Files**
```javascript
const formData = new FormData();
files.forEach(file => formData.append('files', file));

const response = await fetch('/api/upload/multiple', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});

const { files } = await response.json();
```

**Delete File**
```javascript
const response = await fetch(`/api/upload/file/${publicId}`, {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

### API Endpoints
- `POST /api/upload/single` - Upload single file
- `POST /api/upload/multiple` - Upload multiple files (max 5)
- `DELETE /api/upload/file/:publicId` - Delete file
- `POST /api/upload/delete-multiple` - Delete multiple files
- `GET /api/upload/file/:publicId/info` - Get file information

### Supported File Types
- Images: jpg, jpeg, png, gif, webp
- Documents: pdf
- Maximum file size: 10MB

---

## Testing Integrations

### Test Mode
All integrations support test mode for development:
- **Stripe**: Use test keys and test card numbers
- **Google OAuth**: Use development credentials
- **Email**: Use a test email service or mailtrap
- **Cloudinary**: Free tier supports testing

### Common Issues

**CORS Errors**
- Ensure your frontend URL is in the CORS configuration
- Check that environment variables are set correctly

**API Key Errors**
- Verify all API keys are correct in `.env`
- Ensure keys have necessary permissions

**Connection Errors**
- Check network connectivity
- Verify firewall settings
- Ensure services are running

---

## Security Best Practices

1. **Never commit `.env` files** - Use `.env.example` as template
2. **Rotate API keys regularly** - Update keys periodically
3. **Use environment-specific keys** - Separate dev/staging/production keys
4. **Implement rate limiting** - Protect API endpoints from abuse
5. **Validate all inputs** - Sanitize user inputs before processing
6. **Use HTTPS in production** - Always use secure connections
7. **Monitor usage** - Track API usage and costs

---

## Support

For integration-specific issues:
- **Huggingface**: [https://huggingface.co/docs](https://huggingface.co/docs)
- **Google OAuth**: [https://developers.google.com/identity](https://developers.google.com/identity)
- **Stripe**: [https://stripe.com/docs](https://stripe.com/docs)
- **Nodemailer**: [https://nodemailer.com](https://nodemailer.com)
- **Cloudinary**: [https://cloudinary.com/documentation](https://cloudinary.com/documentation)
