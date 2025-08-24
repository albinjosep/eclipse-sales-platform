# Eclipse - AI-Native Sales Platform

> **"Cursor for Sales" - AI as the worker, not the assistant**

Eclipse is the first truly AI-native sales platform, built from the ground up with AI as the core worker rather than just an add-on feature. Just as Salesforce revolutionized CRM with cloud computing, Eclipse revolutionizes sales with AI-native workflows.

## 🚀 The Vision

**Traditional CRM**: Human does the work, AI helps with suggestions
**Eclipse**: AI does the work, human supervises and strategizes

Eclipse transforms sales from "human sells, AI helps" to "AI sells, human guides" - delivering 10x productivity gains through autonomous AI execution.

## 🏗️ Architecture

### **AI-Native Data Model**
- **Vector-based storage** - Every interaction stored as semantic embeddings
- **Real-time processing** - AI analyzes data as it comes in
- **Contextual understanding** - AI reasons across all data types, not just structured fields

### **AI Workflow Engine**
- **Autonomous execution** - AI agents run complete sales processes
- **Continuous learning** - Every outcome improves future decisions
- **Workflow orchestration** - Complex multi-step processes managed by AI

### **Conversational Interface**
- **Natural language commands** - "Show me deals at risk" gets instant AI analysis
- **Persistent context** - AI remembers conversations across weeks
- **No more forms** - Everything through conversation, just like Cursor

## 🔧 Tech Stack

- **Backend**: FastAPI + Python (async-first for AI workflows)
- **Database**: Supabase (PostgreSQL + pgvector for AI-native data)
- **AI Engine**: LangChain + OpenAI GPT-4
- **Real-time**: WebSockets + Supabase subscriptions
- **Vector Search**: pgvector for semantic AI retrieval

## 🎯 Core Features

### **Phase 1: Sales Agent MVP**
- **Auto-capture everything** - Emails, calls, meetings logged automatically
- **AI follow-up engine** - Drafts, personalizes, and schedules follow-ups
- **Deal signal tracking** - Real-time alerts on buyer behavior
- **Conversational dashboard** - Natural language queries and AI insights

### **Phase 2: AI-Native Deal Desk**
- **AI-driven deal scoring** - Predicts close probability from all signals
- **Approval automation** - AI routes contracts and pricing decisions
- **Proposal generator** - Auto-builds proposals from product catalog and context

### **Phase 3: Full AI-Native CRM**
- **Vector-based data model** - Every interaction stored for AI reasoning
- **Graph relationships** - Auto-detects buying committees and influence networks
- **AI-first reporting** - Dynamic forecasts that update in real-time

### **Phase 4: AI Enterprise Platform**
- **Skill marketplace** - Industry-specific AI playbooks
- **Cross-department AI agents** - Sales, marketing, customer success
- **Workflow chaining** - AI agents hand off tasks automatically

## 🚀 Getting Started

### **Prerequisites**
- Python 3.9+
- Supabase account with pgvector enabled
- OpenAI API key

### **Installation**

1. **Clone the repository**
```bash
git clone <repository-url>
cd eclipse_sales
```

2. **Install dependencies**
```bash
pip install -r requirements.txt
```

3. **Environment setup**
```bash
# Copy and configure environment variables
cp .env.example .env
# Edit .env with your Supabase and OpenAI credentials
```

4. **Database setup**
```bash
# Supabase will auto-create the AI-native schema
# Ensure pgvector extension is enabled
```

5. **Run the application**
```bash
python -m app.main
```

### **API Endpoints**

- **Sales Operations**: `/api/v1/sales/*`
- **AI Agents**: `/api/v1/ai-agents/*`
- **Workflows**: `/api/v1/workflows/*`
- **Health Check**: `/health`

## 🔮 The Future of Sales

Eclipse represents the next evolution in enterprise software:

1. **AI as Worker** - Not just helping humans, but executing entire workflows
2. **Autonomous Operations** - Sales processes that run themselves
3. **Continuous Intelligence** - Every interaction makes the system smarter
4. **Human-AI Partnership** - Humans focus on strategy, AI handles execution

## 🎯 Why This Matters

**Salesforce (2000)**: "Store your sales data in the cloud"
**Eclipse (2025)**: "Let AI run your sales process"

The difference is fundamental - we're not just adding AI features to existing software. We're rebuilding sales software around AI as the primary worker, creating systems that are:

- **10x more productive** - AI handles the grunt work
- **Always learning** - Every outcome improves future performance  
- **Predictive** - Anticipates needs before users ask
- **Autonomous** - Executes complex workflows without human intervention

## 🤝 Contributing

Eclipse is built for the AI-native future. We're looking for contributors who understand that:

- **AI isn't a feature** - It's the foundation
- **Workflows matter more than data entry** - Focus on outcomes, not inputs
- **Autonomy beats assistance** - AI should work, not just help

## 📄 License

[License details]

---

**Eclipse**: The AI-native sales platform that doesn't just add AI - it rebuilds sales around AI.

*Built with AI, not just on top of it.*


