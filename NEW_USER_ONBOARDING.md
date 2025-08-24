# 🚀 Eclipse AI-Native Sales Platform - New User Onboarding Guide

## Welcome to Eclipse!

This comprehensive guide ensures you have everything configured for your first experience with our AI-native enterprise sales platform.

---

## 📋 Pre-Launch Checklist

### 🔑 Required API Keys & Services

#### **OpenAI Setup (CRITICAL)**
- [ ] **Create OpenAI Account**: Sign up at https://platform.openai.com
- [ ] **Generate API Key**: Create a new API key in your OpenAI dashboard
- [ ] **Verify Billing Setup**: Ensure you have a valid payment method
- [ ] **Check Usage Limits**: Verify your account has sufficient credits/quota
- [ ] **Test API Access**: Confirm your key works with a simple API call

> ⚠️ **Important**: Eclipse uses GPT-4 for AI agents. Ensure your OpenAI account has GPT-4 access and sufficient credits.

#### **Supabase Setup (CRITICAL)**
- [ ] **Create Supabase Account**: Sign up at https://supabase.com
- [ ] **Create New Project**: Set up a new project for Eclipse
- [ ] **Enable pgvector Extension**: Required for AI-native vector search
- [ ] **Configure Row Level Security**: Set up RLS policies for data protection
- [ ] **Copy Credentials**: Save your project URL, anon key, and service role key

#### **Environment Variables Configuration**
```bash
# Required - Application Security
SECRET_KEY=your-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-here

# Required - Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Required - OpenAI Configuration
OPENAI_API_KEY=your-openai-api-key

# Required - Database
DATABASE_URL=your-database-connection-string

# Optional - Performance
REDIS_URL=your-redis-url

# Frontend Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

---

## 💰 Cost & Usage Considerations

### **OpenAI API Costs**
- **GPT-4 Usage**: ~$0.03 per 1K input tokens, ~$0.06 per 1K output tokens
- **Expected Monthly Usage**: $50-200 for typical sales team (depends on AI agent activity)
- **Rate Limits**: 10,000 TPM (tokens per minute) for new accounts
- **Monitoring**: Set up usage alerts in OpenAI dashboard

### **Supabase Costs**
- **Free Tier**: Up to 500MB database, 2GB bandwidth
- **Pro Plan**: $25/month for production use
- **Database Storage**: Additional costs for large datasets

### **Recommended Budget**
- **Startup/Small Team**: $75-150/month
- **Growing Team (5-20 users)**: $200-500/month
- **Enterprise**: $500+ depending on usage

---

## 🛠️ Installation Steps

### **1. Backend Setup**
```bash
# Clone repository
git clone <repository-url>
cd eclipse_sales

# Install Python dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your API keys and credentials

# Initialize database
python -m app.main
```

### **2. Frontend Setup**
```bash
# Navigate to web directory
cd web

# Install dependencies
npm install

# Start development server
npm run dev
```

---

## 👤 First-Time User Experience

### **Account Setup**
- [ ] **Create Admin Account**: Register your first user account
- [ ] **Verify Email**: Complete email verification process
- [ ] **Set User Permissions**: Configure role-based access control
- [ ] **Complete Profile**: Add your name, role, and preferences

### **Integration Configuration**
- [ ] **Email Integration**: Connect your email account (Gmail/Outlook)
- [ ] **Calendar Sync**: Link your calendar for meeting scheduling
- [ ] **CRM Connection**: Import existing customer data (optional)
- [ ] **Slack/Teams**: Set up team communication integrations (optional)

### **AI Agent Configuration**
- [ ] **AI Personality Settings**: Configure communication tone and style
- [ ] **Confidence Levels**: Set AI autonomy and decision-making thresholds
- [ ] **Workflow Triggers**: Define when AI agents should activate
- [ ] **Approval Workflows**: Set up human approval for critical actions

### **Initial Data Setup**
- [ ] **Import Leads**: Upload existing lead/contact data
- [ ] **Configure Sales Stages**: Define your sales pipeline stages
- [ ] **Set Territories**: Assign sales territories and ownership
- [ ] **Define Goals**: Set revenue targets and KPIs

---

## ✅ Verification & Testing

### **System Health Check**
- [ ] **Backend API**: Verify http://localhost:8000/health responds
- [ ] **Frontend Access**: Confirm http://localhost:3000 loads properly
- [ ] **Database Connection**: Test Supabase connectivity
- [ ] **AI Services**: Verify OpenAI API integration

### **Feature Testing**
- [ ] **Create Test Lead**: Add a sample lead to the system
- [ ] **AI Lead Qualification**: Test AI lead scoring and qualification
- [ ] **Email Generation**: Test AI-powered email drafting
- [ ] **Meeting Scheduling**: Test calendar integration
- [ ] **Deal Analysis**: Test AI deal strategy generation
- [ ] **Workflow Automation**: Verify AI workflow execution

### **Performance Verification**
- [ ] **API Response Times**: Ensure < 2 seconds for most requests
- [ ] **AI Response Times**: Verify < 5 seconds for AI operations
- [ ] **Database Queries**: Check query performance
- [ ] **Frontend Loading**: Confirm fast page load times

---

## 🚨 Common Issues & Solutions

### **API Key Issues**
- **OpenAI API Error**: 
  - Verify API key format and validity
  - Check billing status and usage limits
  - Ensure GPT-4 access is enabled
- **Supabase Connection Error**: 
  - Verify URL format (https://project-id.supabase.co)
  - Check key permissions and RLS policies
  - Ensure pgvector extension is enabled

### **Performance Issues**
- **Slow AI Responses**: 
  - Check OpenAI API status and rate limits
  - Monitor token usage and optimize prompts
  - Consider implementing request caching
- **Database Timeouts**: 
  - Verify connection string and network access
  - Check Supabase project status
  - Optimize database queries

### **Integration Issues**
- **Email Sync Failed**: 
  - Verify OAuth2 setup and permissions
  - Check email provider API limits
  - Ensure proper authentication flow
- **Calendar Access Denied**: 
  - Check Google Calendar API permissions
  - Verify OAuth consent screen setup
  - Ensure proper scope configuration

---

## 📊 Monitoring & Maintenance

### **Usage Monitoring**
- [ ] **Set OpenAI Usage Alerts**: Monitor token consumption
- [ ] **Track Supabase Usage**: Monitor database and bandwidth usage
- [ ] **Monitor API Rate Limits**: Ensure you stay within limits
- [ ] **Review Monthly Costs**: Track and optimize spending

### **System Maintenance**
- [ ] **Regular Backups**: Set up automated database backups
- [ ] **Security Updates**: Keep dependencies updated
- [ ] **Performance Monitoring**: Track system performance metrics
- [ ] **User Feedback**: Collect and act on user feedback

---

## 🎯 Success Metrics

After completing this onboarding, you should achieve:

- [ ] **System Operational**: All services running without errors
- [ ] **AI Agents Active**: AI-powered lead qualification and follow-up working
- [ ] **Integrations Connected**: Email, calendar, and CRM syncing properly
- [ ] **Users Onboarded**: Team members can access and use the platform
- [ ] **Data Flowing**: Leads, deals, and interactions being tracked
- [ ] **Workflows Automated**: AI handling routine sales tasks

---

## 📞 Support & Resources

### **Documentation**
- [ ] Review the main README.md for technical details
- [ ] Check the SETUP_CHECKLIST.md for additional setup guidance
- [ ] Explore API documentation at http://localhost:8000/docs

### **Community & Support**
- [ ] Join our community Slack/Discord (if available)
- [ ] Check GitHub issues for known problems
- [ ] Contact support team for critical issues

### **Training Resources**
- [ ] Complete the AI agent configuration tutorial
- [ ] Watch workflow automation demos
- [ ] Review best practices documentation

---

## 🎉 Welcome to the Future of Sales!

Congratulations! You've successfully set up Eclipse AI-Native Sales Platform. You're now ready to experience:

- **Autonomous AI Agents** handling lead qualification and follow-ups
- **Intelligent Deal Analysis** with AI-powered strategy recommendations
- **Automated Workflows** that execute sales processes without human intervention
- **Real-time Insights** from AI analysis of all sales interactions

Your sales team is now equipped with AI-native tools that will transform how you engage with prospects and close deals.

**Next Steps**: Start by creating your first lead and watch Eclipse's AI agents spring into action!

---

*Last Updated: January 2025*
*Version: 1.0*