# Eclipse AI-Native Enterprise Software - Setup Checklist

## 🚀 New User Setup Guide

Welcome to Eclipse! This checklist ensures you have everything configured for your first experience with our AI-native enterprise platform.

### ✅ Prerequisites Checklist

#### 1. **Environment Variables Setup**
Before starting, you need to configure the following API keys and services:

**Required Environment Variables:**
- [ ] `SECRET_KEY` - Application secret key
- [ ] `JWT_SECRET_KEY` - JWT token encryption key
- [ ] `SUPABASE_URL` - Your Supabase project URL
- [ ] `SUPABASE_ANON_KEY` - Supabase anonymous key
- [ ] `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
- [ ] `OPENAI_API_KEY` - OpenAI API key for AI features
- [ ] `DATABASE_URL` - Database connection string

**Optional Environment Variables:**
- [ ] `REDIS_URL` - Redis connection for caching (optional)
- [ ] `NEXT_PUBLIC_API_BASE_URL` - Frontend API base URL
- [ ] `NEXT_PUBLIC_SUPABASE_URL` - Frontend Supabase URL
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Frontend Supabase key

#### 2. **Required Service Accounts**

**Supabase Setup:**
- [ ] Create a Supabase account at https://supabase.com
- [ ] Create a new project
- [ ] Enable pgvector extension for AI features
- [ ] Copy your project URL and API keys
- [ ] Configure Row Level Security (RLS) policies

**OpenAI Setup:**
- [ ] Create an OpenAI account at https://platform.openai.com
- [ ] Generate an API key
- [ ] Ensure you have sufficient credits/billing setup
- [ ] Test API access

#### 3. **Integration Accounts (Optional but Recommended)**

**Email Integration:**
- [ ] Gmail/Google Workspace account for email sync
- [ ] Enable Gmail API access
- [ ] Configure OAuth2 credentials

**CRM Integration:**
- [ ] Salesforce account (if using Salesforce integration)
- [ ] Configure API access and permissions
- [ ] Generate integration tokens

**Calendar Integration:**
- [ ] Google Calendar access
- [ ] Enable Calendar API
- [ ] Configure meeting scheduling permissions

**Communication Tools:**
- [ ] Slack workspace (optional)
- [ ] Zoom account for video calls (optional)
- [ ] LinkedIn Sales Navigator (optional)

### 🔧 Installation Steps

#### Backend Setup
1. [ ] Clone the repository
2. [ ] Copy `.env.example` to `.env`
3. [ ] Fill in all required environment variables
4. [ ] Install Python dependencies: `pip install -r requirements.txt`
5. [ ] Run database initialization: `python -c "from app.core.database import init_db; import asyncio; asyncio.run(init_db())"`
6. [ ] Start the backend server: `python run.py`

#### Frontend Setup
1. [ ] Navigate to the web directory: `cd web`
2. [ ] Install Node.js dependencies: `npm install`
3. [ ] Configure frontend environment variables
4. [ ] Start the development server: `npm run dev`

### 🎯 First-Time User Experience

#### Account Setup
- [ ] Create your admin account
- [ ] Complete the onboarding wizard
- [ ] Configure AI personality settings
- [ ] Set up notification preferences

#### Integration Configuration
- [ ] Connect your email account
- [ ] Sync your CRM data (if applicable)
- [ ] Link your calendar
- [ ] Configure AI agent permissions

#### Initial Data Setup
- [ ] Import existing leads/contacts
- [ ] Set up sales territories
- [ ] Configure deal stages
- [ ] Define AI workflow triggers

### 🔍 Verification Steps

#### System Health Check
- [ ] Backend API is responding (check http://localhost:8000/health)
- [ ] Frontend is accessible (check http://localhost:3000)
- [ ] Database connection is working
- [ ] AI features are responding

#### Feature Testing
- [ ] Create a test lead
- [ ] Send a test email
- [ ] Schedule a test meeting
- [ ] Run AI analysis on sample data
- [ ] Test workflow automation

### 🚨 Common Issues & Solutions

#### API Key Issues
- **OpenAI API Error**: Verify your API key and billing status
- **Supabase Connection Error**: Check URL format and key permissions
- **Database Error**: Ensure pgvector extension is enabled

#### Integration Issues
- **Email Sync Failed**: Verify OAuth2 setup and permissions
- **Calendar Access Denied**: Check Google Calendar API permissions
- **CRM Sync Error**: Validate API credentials and rate limits

#### Performance Issues
- **Slow AI Responses**: Check OpenAI API status and rate limits
- **Database Timeouts**: Verify connection string and network access
- **Frontend Loading Issues**: Clear browser cache and check console errors

### 📞 Support Resources

- **Documentation**: Check the README.md for detailed setup instructions
- **Environment Template**: Use `.env.example` as your configuration guide
- **API Documentation**: Available at http://localhost:8000/docs when backend is running
- **Troubleshooting**: Check logs in both backend and frontend terminals

### 🎉 You're Ready!

Once all items are checked off, you're ready to experience Eclipse's AI-native enterprise capabilities:

- ✨ AI-powered lead qualification
- 🤖 Autonomous sales workflows
- 📊 Intelligent pipeline analytics
- 💬 AI sales copilot
- 🔄 Automated follow-up sequences

Welcome to the future of AI-native enterprise software! 🚀