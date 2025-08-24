from supabase import create_client, Client
from app.core.config import settings
import asyncio
from typing import Optional

# Global Supabase client
supabase: Optional[Client] = None

async def init_db():
    """Initialize database connection and setup AI-native data model"""
    global supabase
    
    try:
        # Initialize Supabase client
        supabase = create_client(
            settings.supabase_url,
            settings.supabase_service_role_key
        )
        
        # Setup AI-native data model
        await setup_ai_native_schema()
        
        print("✅ Database initialized successfully")
        
    except Exception as e:
        print(f"❌ Database initialization failed: {e}")
        raise

async def setup_ai_native_schema():
    """Setup the AI-native database schema with vector support"""
    
    # Enable pgvector extension
    try:
        await supabase.postgrest.rpc('exec_sql', {
            'sql': 'CREATE EXTENSION IF NOT EXISTS vector;'
        }).execute()
    except Exception as e:
        print(f"⚠️ Could not enable vector extension: {e}")
        # Continue without vector extension for now
    
    # Create AI-native tables
    await create_ai_native_tables()
    
    # Setup vector indexes
    await setup_vector_indexes()

async def create_ai_native_tables():
    """Create tables designed for AI, not human data entry"""
    
    # Interactions table - stores all customer interactions as vectors
    interactions_sql = """
    CREATE TABLE IF NOT EXISTS interactions (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        customer_id UUID REFERENCES customers(id),
        interaction_type VARCHAR(50) NOT NULL, -- email, call, meeting, chat
        content TEXT NOT NULL,
        content_vector vector(1536), -- OpenAI embedding dimension
        metadata JSONB,
        sentiment_score FLOAT,
        intent_classification VARCHAR(100),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    """
    
    # Customers table - AI-enriched customer profiles
    customers_sql = """
    CREATE TABLE IF NOT EXISTS customers (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE,
        company VARCHAR(255),
        industry VARCHAR(100),
        buying_intent_score FLOAT DEFAULT 0.0,
        churn_risk_score FLOAT DEFAULT 0.0,
        lifetime_value_prediction FLOAT DEFAULT 0.0,
        ai_generated_insights JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    """
    
    # Deals table - AI-driven deal management
    deals_sql = """
    CREATE TABLE IF NOT EXISTS deals (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        customer_id UUID REFERENCES customers(id),
        title VARCHAR(255) NOT NULL,
        value DECIMAL(15,2),
        stage VARCHAR(100) NOT NULL,
        close_probability FLOAT DEFAULT 0.0,
        ai_predicted_close_date DATE,
        ai_recommended_actions JSONB,
        ai_generated_strategy TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    """
    
    # AI Workflows table - tracks autonomous AI actions
    ai_workflows_sql = """
    CREATE TABLE IF NOT EXISTS ai_workflows (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        workflow_type VARCHAR(100) NOT NULL,
        status VARCHAR(50) NOT NULL,
        input_data JSONB,
        output_data JSONB,
        ai_agent_id VARCHAR(100),
        execution_time_ms INTEGER,
        success BOOLEAN,
        error_message TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        completed_at TIMESTAMP WITH TIME ZONE
    );
    """
    
    # Execute table creation
    tables = [interactions_sql, customers_sql, deals_sql, ai_workflows_sql]
    
    for table_sql in tables:
        try:
            await supabase.rpc('exec_sql', {'sql': table_sql}).execute()
        except Exception as e:
            print(f"Table creation warning: {e}")

async def setup_vector_indexes():
    """Setup vector indexes for AI semantic search"""
    
    # Create vector index on interactions content
    vector_index_sql = """
    CREATE INDEX IF NOT EXISTS interactions_content_vector_idx 
    ON interactions 
    USING ivfflat (content_vector vector_cosine_ops)
    WITH (lists = 100);
    """
    
    try:
        await supabase.rpc('exec_sql', {'sql': vector_index_sql}).execute()
    except Exception as e:
        print(f"Vector index creation warning: {e}")

def get_supabase() -> Client:
    """Get the Supabase client instance"""
    if supabase is None:
        raise RuntimeError("Database not initialized. Call init_db() first.")
    return supabase

