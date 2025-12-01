# DDoS Protection Guide for HopeNotes

This document outlines the DDoS protection measures implemented and additional steps you should take.

## ✅ Implemented Protections

### 1. Client-Side Rate Limiting
- **Upload Form**: Limited to 3 submissions per minute per client
- **Feedback Form**: Limited to 2 submissions per minute per client
- **Data Fetching**: Limited to 10 requests per minute per client

### 2. Input Sanitization
- All user inputs are sanitized to prevent XSS attacks
- URL validation and sanitization
- Text length limits to prevent DoS attacks
- HTML tag removal and script injection prevention

### 3. Duplicate Detection
- Prevents duplicate link submissions
- Reduces unnecessary database writes

## 🔒 Additional Steps Required

### 1. Firebase Security Rules (CRITICAL)

Update your Firestore security rules in Firebase Console:

1. Go to Firebase Console → Firestore Database → Rules
2. Replace with these enhanced rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper function to check rate limiting
    function isRateLimited(collectionName) {
      let requestTime = request.time;
      let lastWrite = resource.data.lastWrite;
      let writeCount = resource.data.writeCount;
      let timeWindow = requestTime - lastWrite;
      
      // Reset counter if more than 1 minute has passed
      if (timeWindow.seconds > 60) {
        return false;
      }
      
      // Limit writes per minute
      return writeCount >= 5;
    }
    
    // Drive Links Collection
    match /driveLinks/{document} {
      allow read: if true;
      allow create: if 
        request.resource.data.keys().hasAll(['grade', 'medium', 'url', 'description', 'createdAt']) &&
        request.resource.data.url is string &&
        request.resource.data.url.matches('^https?://(drive\\.google\\.com|docs\\.google\\.com)/') &&
        request.resource.data.url.size() <= 2048 &&
        request.resource.data.description.size() <= 5000 &&
        !isRateLimited('driveLinks');
      allow update, delete: if false;
    }
    
    // WhatsApp Groups Collection
    match /whatsappGroups/{document} {
      allow read: if true;
      allow create: if 
        request.resource.data.keys().hasAll(['url', 'createdAt']) &&
        request.resource.data.url is string &&
        request.resource.data.url.matches('^https?://(chat\\.whatsapp\\.com|wa\\.me)/') &&
        request.resource.data.url.size() <= 2048 &&
        (!('description' in request.resource.data) || request.resource.data.description.size() <= 5000) &&
        !isRateLimited('whatsappGroups');
      allow update, delete: if false;
    }
    
    // University Groups Collection
    match /universityGroups/{document} {
      allow read: if true;
      allow create: if 
        request.resource.data.keys().hasAll(['url', 'createdAt']) &&
        request.resource.data.url is string &&
        request.resource.data.url.matches('^https?://(chat\\.whatsapp\\.com|wa\\.me)/') &&
        request.resource.data.url.size() <= 2048 &&
        (!('description' in request.resource.data) || request.resource.data.description.size() <= 5000) &&
        !isRateLimited('universityGroups');
      allow update, delete: if false;
    }
    
    // Feedbacks Collection
    match /feedbacks/{document} {
      allow read: if true;
      allow create: if 
        request.resource.data.keys().hasAll(['name', 'feedback', 'createdAt']) &&
        request.resource.data.name is string &&
        request.resource.data.name.size() <= 100 &&
        request.resource.data.feedback is string &&
        request.resource.data.feedback.size() >= 10 &&
        request.resource.data.feedback.size() <= 2000 &&
        !isRateLimited('feedbacks');
      allow update, delete: if false;
    }
  }
}
```

### 2. Enable Firebase App Check (Recommended)

1. Go to Firebase Console → App Check
2. Enable App Check for your web app
3. Register your domain
4. This adds an additional layer of protection against abuse

### 3. Use Cloudflare (Recommended for Production)

For additional DDoS protection:

1. Sign up for Cloudflare (free tier available)
2. Add your domain to Cloudflare
3. Update your DNS nameservers
4. Enable Cloudflare's DDoS protection features:
   - Rate limiting
   - Bot protection
   - DDoS mitigation
   - WAF (Web Application Firewall) - available in paid plans

### 4. Firebase Hosting Configuration

If using Firebase Hosting, add these headers in `firebase.json`:

```json
{
  "hosting": {
    "headers": [
      {
        "source": "**",
        "headers": [
          {
            "key": "X-Content-Type-Options",
            "value": "nosniff"
          },
          {
            "key": "X-Frame-Options",
            "value": "DENY"
          },
          {
            "key": "X-XSS-Protection",
            "value": "1; mode=block"
          },
          {
            "key": "Strict-Transport-Security",
            "value": "max-age=31536000; includeSubDomains"
          }
        ]
      }
    ]
  }
}
```

### 5. Monitor and Alert

Set up monitoring:
1. Firebase Console → Monitoring
2. Set up alerts for:
   - Unusual traffic spikes
   - High error rates
   - Unusual write patterns

### 6. Additional Best Practices

- **CORS Configuration**: Ensure CORS is properly configured
- **API Key Restrictions**: Restrict Firebase API keys to specific domains
- **Regular Updates**: Keep dependencies updated
- **Logging**: Monitor logs for suspicious activity
- **Backup**: Regular backups of Firestore data

## 🚨 What to Do If Under Attack

1. **Immediate Actions**:
   - Check Firebase Console for unusual activity
   - Review Firestore usage and quotas
   - Check Cloudflare dashboard (if using)

2. **Temporary Measures**:
   - Temporarily tighten rate limits
   - Enable maintenance mode if needed
   - Block specific IPs if identified

3. **Long-term Solutions**:
   - Implement Cloudflare
   - Set up proper monitoring
   - Consider upgrading Firebase plan if needed

## 📊 Current Protection Status

- ✅ Client-side rate limiting
- ✅ Input sanitization
- ✅ URL validation
- ✅ Duplicate detection
- ⚠️ Firestore security rules (needs update)
- ⚠️ Firebase App Check (needs setup)
- ⚠️ Cloudflare (optional but recommended)

## 📝 Notes

- Rate limits are per client session (stored in sessionStorage)
- For production, consider implementing server-side rate limiting
- Monitor your Firebase usage quotas regularly
- Consider implementing CAPTCHA for additional protection

