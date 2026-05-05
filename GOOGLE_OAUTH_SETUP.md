# Google OAuth Setup Instructions

## 1. Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API"
   - Click "Enable"

4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - For development: `http://localhost:3000/api/auth/google`
     - For production: `https://yourdomain.com/api/auth/google`
   - Click "Create"
   - Copy the Client ID and Client Secret

## 2. Configure Environment Variables

Add the following to your `.env` file:

```bash
# Google OAuth
NUXT_OAUTH_GOOGLE_CLIENT_ID=your_google_client_id_here
NUXT_OAUTH_GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

## 3. How It Works

### Account Merging
- If a user registers with email/password and later logs in with Google using the **same email**, they will be logged into the **same account**
- If a user logs in with Google and no account exists with that email, a new account is created
- OAuth users don't have a password - they can only log in via Google

### Login Flow
1. User clicks "Continue with Google" button
2. User is redirected to Google OAuth consent screen
3. After approval, Google redirects back to `/api/auth/google`
4. Backend checks if user exists by email
5. If exists: logs in to existing account
6. If not: creates new account
7. User is redirected to `/dashboard`

### Security
- OAuth users have empty password hash in database
- Session is created with user ID, email, and name
- Session expires after 7 days (configurable in `nuxt.config.ts`)

## 4. Testing

### Development
1. Start the dev server: `npm run dev`
2. Go to `http://localhost:3000/auth/login`
3. Click "Continue with Google"
4. Complete OAuth flow

### Production
1. Update authorized redirect URIs in Google Cloud Console
2. Set production environment variables
3. Deploy application
4. Test OAuth flow on production domain

## 5. Troubleshooting

### Error: "redirect_uri_mismatch"
- Make sure the redirect URI in Google Cloud Console matches exactly: `http://localhost:3000/api/auth/google` (dev) or `https://yourdomain.com/api/auth/google` (prod)

### Error: "oauth_failed"
- Check browser console and server logs for detailed error
- Verify environment variables are set correctly
- Ensure Google+ API is enabled

### User can't log in after OAuth
- Check that user session is being created correctly
- Verify database has user record with correct email
