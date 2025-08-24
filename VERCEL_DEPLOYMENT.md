# Vercel Deployment Guide for Eclipse Sales Platform

## Overview
This guide covers deploying the Eclipse Sales Platform frontend to Vercel. Note that this deployment only covers the Next.js frontend - the FastAPI backend will need to be deployed separately.

## Prerequisites

### 1. Vercel Account
- Sign up at [vercel.com](https://vercel.com)
- Install Vercel CLI: `npm i -g vercel`

### 2. Required Environment Variables
You'll need to configure these environment variables in Vercel:

#### Core Services
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
OPENAI_API_KEY=your_openai_api_key
```

#### Google Calendar Integration
```
GOOGLE_CLIENT_ID=529914574011-jme8an7b2pc4e4eruk3mo5g2h7g2a087.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXT_PUBLIC_GOOGLE_CLIENT_ID=529914574011-jme8an7b2pc4e4eruk3mo5g2h7g2a087.apps.googleusercontent.com
```

#### Application URLs
```
NEXT_PUBLIC_APP_URL=https://your-vercel-domain.vercel.app
NEXT_PUBLIC_API_BASE_URL=https://your-backend-api-url.com
```

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard

1. **Connect Repository**
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Select the `web` folder as the root directory

2. **Configure Build Settings**
   - Framework Preset: Next.js
   - Root Directory: `web`
   - Build Command: `npm run build`
   - Output Directory: `.next`

3. **Add Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add all the required variables listed above

4. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete

### Option 2: Deploy via CLI

1. **Navigate to web directory**
   ```bash
   cd web
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Set Environment Variables**
   ```bash
   vercel env add NEXT_PUBLIC_SUPABASE_URL
   vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
   vercel env add SUPABASE_SERVICE_ROLE_KEY
   vercel env add OPENAI_API_KEY
   vercel env add GOOGLE_CLIENT_ID
   vercel env add GOOGLE_CLIENT_SECRET
   vercel env add NEXT_PUBLIC_GOOGLE_CLIENT_ID
   vercel env add NEXT_PUBLIC_APP_URL
   vercel env add NEXT_PUBLIC_API_BASE_URL
   ```

5. **Redeploy with Environment Variables**
   ```bash
   vercel --prod
   ```

## Backend Deployment

Since Vercel primarily hosts frontend applications, you'll need to deploy your FastAPI backend separately. Consider these options:

### Recommended Backend Hosting Options

1. **Railway** (Recommended)
   - Easy Python/FastAPI deployment
   - Automatic HTTPS
   - Database hosting available

2. **Render**
   - Free tier available
   - Automatic deployments from Git
   - Built-in database options

3. **Heroku**
   - Popular platform
   - Easy scaling
   - Add-ons ecosystem

4. **DigitalOcean App Platform**
   - Competitive pricing
   - Managed databases
   - Auto-scaling

### Backend Deployment Steps (Railway Example)

1. Create account at [railway.app](https://railway.app)
2. Connect your GitHub repository
3. Select the root directory (not `web`)
4. Set environment variables:
   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_service_role_key
   OPENAI_API_KEY=your_openai_api_key
   REDIS_URL=your_redis_url
   DATABASE_URL=your_database_url
   ```
5. Deploy and get your backend URL
6. Update `NEXT_PUBLIC_API_BASE_URL` in Vercel to point to your backend

## Post-Deployment Configuration

### 1. Update OAuth Redirect URIs
Update your Google OAuth configuration:
- Add `https://your-vercel-domain.vercel.app/auth/callback/google` to authorized redirect URIs

### 2. Update Supabase Settings
- Add your Vercel domain to Supabase Auth settings
- Update site URL in Supabase dashboard

### 3. CORS Configuration
Ensure your backend allows requests from your Vercel domain:
```python
# In your FastAPI app
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://your-vercel-domain.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check that all dependencies are in `package.json`
   - Ensure TypeScript errors are resolved
   - Verify environment variables are set

2. **API Connection Issues**
   - Verify `NEXT_PUBLIC_API_BASE_URL` points to your deployed backend
   - Check CORS configuration on backend
   - Ensure backend is deployed and accessible

3. **Authentication Issues**
   - Verify Supabase URLs and keys
   - Check OAuth redirect URIs
   - Ensure environment variables are properly set

### Debugging

1. **Check Vercel Function Logs**
   ```bash
   vercel logs
   ```

2. **Local Testing**
   ```bash
   vercel dev
   ```

3. **Environment Variable Check**
   ```bash
   vercel env ls
   ```

## Performance Optimization

### 1. Enable Analytics
- Go to Project Settings → Analytics
- Enable Vercel Analytics for performance insights

### 2. Configure Caching
- Static assets are automatically cached
- API routes cache based on headers

### 3. Image Optimization
- Next.js Image component is automatically optimized on Vercel
- Configure domains in `next.config.js` if using external images

## Security Considerations

1. **Environment Variables**
   - Never commit secrets to Git
   - Use Vercel's environment variable system
   - Separate development and production variables

2. **API Security**
   - Implement proper authentication
   - Use HTTPS only in production
   - Configure CORS properly

3. **Content Security Policy**
   - Configure CSP headers in `vercel.json`
   - Restrict external resource loading

## Monitoring

1. **Vercel Analytics**
   - Monitor page performance
   - Track Core Web Vitals

2. **Error Tracking**
   - Consider integrating Sentry or similar
   - Monitor API errors

3. **Uptime Monitoring**
   - Set up external monitoring
   - Configure alerts

## Cost Optimization

1. **Vercel Limits**
   - Free tier: 100GB bandwidth/month
   - Pro tier: $20/month for more resources

2. **Function Execution**
   - Optimize API routes for faster execution
   - Consider edge functions for better performance

## Next Steps

1. Deploy backend to your chosen platform
2. Update environment variables with production URLs
3. Test all functionality in production
4. Set up monitoring and analytics
5. Configure custom domain (optional)

For additional help, refer to:
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [Supabase Auth with Vercel](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)