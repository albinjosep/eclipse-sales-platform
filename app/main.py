from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.core.config import settings
from app.core.database import init_db

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("🚀 Eclipse AI-Native Sales Platform starting...")
    print("📍 Core services initializing...")
    
    # Initialize database connection
    await init_db()
    
    yield
    # Shutdown
    print("🛑 Shutting down Eclipse...")

app = FastAPI(
    title="Eclipse",
    version="1.0.0",
    debug=True,
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
from app.api.routes import auth, monitoring, setup, config

# API router
from fastapi import APIRouter
api_router = APIRouter(prefix="/api/v1")
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(monitoring.router, prefix="/monitoring", tags=["monitoring"])
api_router.include_router(setup.router, tags=["setup"])
api_router.include_router(config.router, tags=["configuration"])

# Include API router
app.include_router(api_router)

@app.get("/")
async def root():
    return {
        "message": "Eclipse AI-Native Sales Platform",
        "version": "1.0.0",
        "status": "Core services running",
        "vision": "AI as the worker, not the assistant"
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "platform": "Eclipse",
        "architecture": "AI-Native",
        "ready": True
    }

@app.get("/api/v1/vision")
async def get_vision():
    """Get the Eclipse vision and architecture"""
    return {
        "platform": "Eclipse",
        "tagline": "Cursor for Sales",
        "vision": "AI as the worker, not the assistant",
        "architecture": {
            "ai_native_data_model": "Vector-based storage for AI reasoning",
            "autonomous_workflows": "AI agents execute complete sales processes",
            "conversational_interface": "Natural language commands, no forms",
            "continuous_learning": "Every outcome improves future decisions"
        },
        "phases": [
            {
                "phase": 1,
                "name": "Sales Agent MVP",
                "description": "AI follow-up engine and deal signal tracking"
            },
            {
                "phase": 2,
                "name": "AI-Native Deal Desk",
                "description": "AI-driven deal scoring and approval automation"
            },
            {
                "phase": 3,
                "name": "Full AI-Native CRM",
                "description": "Vector-based data model with AI-first reporting"
            },
            {
                "phase": 4,
                "name": "AI Enterprise Platform",
                "description": "Skill marketplace and cross-department AI agents"
            }
        ]
    }

@app.get("/api/v1/ai-agents")
async def list_ai_agents():
    """List the AI agents that will power Eclipse"""
    return {
        "agents": [
            {
                "name": "lead_qualifier",
                "description": "Autonomously qualifies leads based on interaction data",
                "capabilities": ["Lead scoring", "Intent classification", "Company research"]
            },
            {
                "name": "follow_up",
                "description": "Manages customer communication and follow-up sequences",
                "capabilities": ["Email generation", "Meeting scheduling", "Engagement tracking"]
            },
            {
                "name": "deal_strategy",
                "description": "Generates winning strategies for complex deals",
                "capabilities": ["Deal analysis", "Risk assessment", "Strategy generation"]
            },
            {
                "name": "pricing",
                "description": "Optimizes pricing and negotiation strategies",
                "capabilities": ["Pricing analysis", "Discount recommendations", "Negotiation strategy"]
            }
        ],
        "status": "AI agents will be initialized in full version"
    }

@app.get("/api/v1/workflows")
async def list_workflows():
    """List the autonomous AI workflows"""
    return {
        "workflows": [
            {
                "name": "new_lead",
                "description": "AI autonomously qualifies and nurtures new leads",
                "steps": ["Lead qualification", "Customer enrichment", "Follow-up scheduling", "Deal creation"]
            },
            {
                "name": "deal_progression",
                "description": "AI analyzes and advances deals automatically",
                "steps": ["Deal health analysis", "Risk assessment", "Strategy generation", "Next steps planning"]
            },
            {
                "name": "follow_up_sequence",
                "description": "AI manages complete customer communication",
                "steps": ["Interaction analysis", "Follow-up generation", "Scheduling optimization", "Engagement tracking"]
            }
        ],
        "status": "Workflows will be executed in full version"
    }

@app.get("/api/v1/demo")
async def demo_ai_native_approach():
    """Demonstrate the AI-native approach vs traditional CRM"""
    return {
        "traditional_crm": {
            "approach": "Human does the work, AI helps with suggestions",
            "workflow": "Human fills forms → Human moves deals → Human writes emails → Human tracks activities",
            "ai_role": "Assistant - provides insights and suggestions"
        },
        "eclipse_ai_native": {
            "approach": "AI does the work, human supervises and strategizes",
            "workflow": "AI captures data → AI progresses deals → AI writes emails → AI tracks outcomes",
            "ai_role": "Worker - executes complete workflows autonomously"
        },
        "key_difference": "We're not adding AI to CRM - we're rebuilding CRM around AI as the primary worker",
        "productivity_gain": "10x improvement through autonomous AI execution"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
