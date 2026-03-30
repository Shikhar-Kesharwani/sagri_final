# 📧 Email Configuration Guide for SAGRI Platform

## Overview
Currently, the SAGRI platform auto-confirms user emails during signup (`email_confirm: true`). To enable proper email verification and password reset functionality, you need to configure Supabase email settings.

## Steps to Configure Email

### 1. Access Supabase Dashboard
1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project: `wofpjmzhspgsestrhney`
3. Navigate to **Authentication** → **Email Templates**

### 2. Choose Email Provider

#### **Option A: Use Supabase's Built-in SMTP (Easiest)**
Supabase provides a default SMTP service for development/testing:
- ✅ No configuration needed
- ⚠️ Limited to 3 emails per hour on free tier
- ⚠️ Emails may go to spam

#### **Option B: Custom SMTP (Recommended for Production)**
Use a professional email service:

**Popular Options:**
- **SendGrid** - 100 emails/day free tier
- **AWS SES** - $0.10 per 1,000 emails
- **Mailgun** - 5,000 emails/month free
- **Resend** - 3,000 emails/month free

### 3. Configure Custom SMTP (SendGrid Example)

#### Step 1: Get SendGrid API Key
1. Sign up at [SendGrid.com](https://sendgrid.com/)
2. Go to **Settings** → **API Keys**
3. Create new API key with "Mail Send" permission
4. Copy the API key

#### Step 2: Configure in Supabase
1. In Supabase Dashboard → **Project Settings** → **Auth**
2. Scroll to **SMTP Settings**
3. Enable **Custom SMTP**
4. Fill in:
   ```
   Host: smtp.sendgrid.net
   Port: 587
   Username: apikey
   Password: <YOUR_SENDGRID_API_KEY>
   Sender email: noreply@yourdomain.com
   Sender name: SAGRI - Krishi Shayak
   ```
5. Click **Save**

### 4. Update Backend Code

After configuring email, update the signup endpoint in `/supabase/functions/server/index.tsx`:

**Change line 111 from:**
```typescript
email_confirm: true, // Auto-confirm since email server not configured
```

**To:**
```typescript
email_confirm: false, // Users must verify email
```

### 5. Customize Email Templates

1. Go to **Authentication** → **Email Templates**
2. Customize these templates:
   - **Confirm Signup** - Email verification
   - **Magic Link** - Passwordless login
   - **Change Email Address** - Email change confirmation
   - **Reset Password** - Password reset instructions

Example customization for "Confirm Signup":
```html
<h2>Welcome to SAGRI - Krishi Shayak! 🌾</h2>
<p>Thank you for joining our farming community.</p>
<p>Click the button below to verify your email address:</p>
<a href="{{ .ConfirmationURL }}">Verify Email</a>
```

### 6. Test Email Flow

1. **Signup Test:**
   - Create a new account
   - Check email inbox (and spam folder)
   - Click verification link
   - Login should work

2. **Password Reset Test:**
   - Try "Forgot Password" flow
   - Check for reset email
   - Click reset link
   - Set new password

## Current Configuration Status

### ✅ What's Working Now:
- Auto-confirmed signups (users can login immediately)
- All authentication flows functional
- Password reset generates links (shown in dev mode)

### ⚠️ What Needs Email Config:
- Email verification messages
- Password reset emails
- Email change notifications
- Magic link authentication

## Environment Variables

The app already uses these environment variables (no changes needed):
```bash
SUPABASE_URL=https://wofpjmzhspgsestrhney.supabase.co
SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
```

## Security Considerations

1. **Production Checklist:**
   - [ ] Configure custom SMTP provider
   - [ ] Set `email_confirm: false` in signup
   - [ ] Customize email templates with branding
   - [ ] Test all email flows thoroughly
   - [ ] Monitor email delivery rates
   - [ ] Set up SPF/DKIM records for domain

2. **Email Best Practices:**
   - Use a dedicated sending domain
   - Enable double opt-in for newsletters
   - Include unsubscribe links
   - Monitor bounce rates
   - Keep templates mobile-responsive

## Troubleshooting

### Emails Not Arriving
1. Check spam/junk folder
2. Verify SMTP credentials in Supabase
3. Check SendGrid/provider dashboard for bounce logs
4. Confirm sender email is verified

### "Email already exists" Error
- User already registered - use signin instead
- Or use password reset if forgotten

### Rate Limits
- Supabase free: 3 emails/hour
- Upgrade plan or use custom SMTP for higher limits

## Support Resources

- **Supabase Email Docs:** https://supabase.com/docs/guides/auth/auth-smtp
- **SendGrid Setup:** https://docs.sendgrid.com/for-developers/sending-email/getting-started-smtp
- **AWS SES Setup:** https://docs.aws.amazon.com/ses/latest/dg/smtp-credentials.html

## Quick Reference

| Feature | Current Status | Action Needed |
|---------|----------------|---------------|
| Signup | ✅ Auto-confirmed | Optional: Enable email verification |
| Login | ✅ Working | None |
| Password Reset | ⚠️ Link generation only | Configure SMTP to send emails |
| Email Change | ⚠️ Not sending | Configure SMTP |
| Magic Links | ⚠️ Not sending | Configure SMTP |

---

**Last Updated:** March 29, 2026  
**Platform:** SAGRI - Krishi Shayak v2.0  
**Environment:** Production (Figma Make)
