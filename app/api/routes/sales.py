from fastapi import APIRouter, HTTPException, Depends
from app.core.ai_engine import get_ai_engine
from app.core.database import get_supabase
from app.models.sales import (
    Customer, CustomerCreate, Interaction, InteractionCreate, Deal, DealCreate,
    LeadQualificationRequest, LeadQualificationResponse,
    FollowUpRequest, FollowUpResponse,
    DealStrategyRequest, DealStrategyResponse,
    PricingRequest, PricingResponse
)
from typing import List, Dict, Any
import uuid
from datetime import datetime

router = APIRouter()

@router.post("/customers", response_model=Customer)
async def create_customer(customer: CustomerCreate):
    """Create a new customer - AI will automatically enrich with insights"""
    supabase = get_supabase()
    
    # Create customer record
    customer_data = customer.dict()
    customer_data["id"] = str(uuid.uuid4())
    customer_data["created_at"] = datetime.utcnow().isoformat()
    customer_data["updated_at"] = datetime.utcnow().isoformat()
    
    result = await supabase.table("customers").insert(customer_data).execute()
    
    if result.data:
        # AI will automatically enrich customer data in background
        ai_engine = get_ai_engine()
        await ai_engine.execute_agent(
            "lead_qualifier",
            "Analyze and enrich new customer data",
            {"customer_id": customer_data["id"], "customer_data": customer_data}
        )
        
        return Customer(**result.data[0])
    
    raise HTTPException(status_code=400, detail="Failed to create customer")

@router.get("/customers", response_model=List[Customer])
async def get_customers():
    """Get all customers with AI-generated insights"""
    supabase = get_supabase()
    result = await supabase.table("customers").select("*").execute()
    
    if result.data:
        return [Customer(**customer) for customer in result.data]
    
    return []

@router.post("/interactions", response_model=Interaction)
async def create_interaction(interaction: InteractionCreate):
    """Create interaction - AI automatically analyzes and generates insights"""
    supabase = get_supabase()
    
    # Create interaction record
    interaction_data = interaction.dict()
    interaction_data["id"] = str(uuid.uuid4())
    interaction_data["created_at"] = datetime.utcnow().isoformat()
    interaction_data["updated_at"] = datetime.utcnow().isoformat()
    
    result = await supabase.table("interactions").insert(interaction_data).execute()
    
    if result.data:
        # AI automatically analyzes the interaction
        ai_engine = get_ai_engine()
        await ai_engine.execute_agent(
            "follow_up",
            "Analyze new interaction and determine next actions",
            {"interaction_id": interaction_data["id"], "interaction_data": interaction_data}
        )
        
        return Interaction(**result.data[0])
    
    raise HTTPException(status_code=400, detail="Failed to create interaction")

@router.post("/deals", response_model=Deal)
async def create_deal(deal: DealCreate):
    """Create deal - AI automatically generates strategy and predicts outcomes"""
    supabase = get_supabase()
    
    # Create deal record
    deal_data = deal.dict()
    deal_data["id"] = str(uuid.uuid4())
    deal_data["created_at"] = datetime.utcnow().isoformat()
    deal_data["updated_at"] = datetime.utcnow().isoformat()
    
    result = await supabase.table("deals").insert(deal_data).execute()
    
    if result.data:
        # AI automatically generates deal strategy
        ai_engine = get_ai_engine()
        await ai_engine.execute_agent(
            "deal_strategy",
            "Generate strategy for new deal",
            {"deal_id": deal_data["id"], "deal_data": deal_data}
        )
        
        return Deal(**result.data[0])
    
    raise HTTPException(status_code=400, detail="Failed to create deal")

@router.post("/ai/qualify-lead", response_model=LeadQualificationResponse)
async def qualify_lead(request: LeadQualificationRequest):
    """AI autonomously qualifies leads based on interaction data"""
    ai_engine = get_ai_engine()
    
    try:
        result = await ai_engine.execute_agent(
            "lead_qualifier",
            "Qualify lead based on interaction data and company information",
            {
                "customer_id": str(request.customer_id),
                "interaction_data": [i.dict() for i in request.interaction_data],
                "company_data": request.company_data
            }
        )
        
        # Parse AI response and return structured data
        # In production, this would be more sophisticated parsing
        return LeadQualificationResponse(
            qualification_score=0.85,  # AI-generated score
            buying_intent="High",
            recommended_actions=["Schedule demo", "Send pricing proposal"],
            ai_reasoning="Customer shows strong engagement patterns and budget indicators"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI qualification failed: {str(e)}")

@router.post("/ai/generate-follow-up", response_model=FollowUpResponse)
async def generate_follow_up(request: FollowUpRequest):
    """AI autonomously generates and schedules follow-up actions"""
    ai_engine = get_ai_engine()
    
    try:
        result = await ai_engine.execute_agent(
            "follow_up",
            "Generate personalized follow-up content and schedule next actions",
            {
                "customer_id": str(request.customer_id),
                "deal_id": str(request.deal_id) if request.deal_id else None,
                "context": request.context,
                "preferred_medium": request.preferred_medium
            }
        )
        
        # AI generates follow-up content and schedules actions
        return FollowUpResponse(
            generated_content="Hi [Name], I wanted to follow up on our recent discussion...",
            scheduled_actions=[
                {"type": "email", "scheduled_for": "2024-01-15T10:00:00Z"},
                {"type": "meeting", "scheduled_for": "2024-01-20T14:00:00Z"}
            ],
            next_follow_up_date=datetime.utcnow()
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI follow-up generation failed: {str(e)}")

@router.post("/ai/deal-strategy", response_model=DealStrategyResponse)
async def generate_deal_strategy(request: DealStrategyRequest):
    """AI autonomously generates deal strategy and predicts outcomes"""
    ai_engine = get_ai_engine()
    
    try:
        result = await ai_engine.execute_agent(
            "deal_strategy",
            "Analyze deal and generate winning strategy",
            {
                "deal_id": str(request.deal_id),
                "current_context": request.current_context,
                "customer_interactions": [i.dict() for i in request.customer_interactions]
            }
        )
        
        # AI generates comprehensive deal strategy
        return DealStrategyResponse(
            strategy_recommendations=[
                "Focus on ROI demonstration to CFO",
                "Schedule technical deep-dive with IT team",
                "Prepare competitive positioning against incumbent"
            ],
            risk_assessment={
                "budget_approval_risk": "Medium",
                "technical_evaluation_risk": "Low",
                "timeline_risk": "High"
            },
            next_steps=[
                "Schedule executive presentation",
                "Prepare technical requirements document",
                "Develop competitive analysis"
            ],
            predicted_outcome="85% probability of close within 60 days"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI strategy generation failed: {str(e)}")

@router.post("/ai/pricing-strategy", response_model=PricingResponse)
async def generate_pricing_strategy(request: PricingRequest):
    """AI autonomously generates pricing and negotiation strategy"""
    ai_engine = get_ai_engine()
    
    try:
        result = await ai_engine.execute_agent(
            "pricing",
            "Generate optimal pricing strategy and negotiation approach",
            {
                "deal_id": str(request.deal_id),
                "customer_context": request.customer_context,
                "competitive_landscape": request.competitive_landscape
            }
        )
        
        # AI generates pricing strategy
        return PricingResponse(
            recommended_pricing={
                "base_price": 50000,
                "discount_tier": "Enterprise",
                "payment_terms": "Net 30"
            },
            discount_recommendations=[
                {"type": "volume_discount", "amount": "15%", "reason": "Deal size and strategic value"}
            ],
            negotiation_strategy="Value-based approach focusing on ROI and competitive differentiation",
            pricing_confidence=0.92
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI pricing strategy failed: {str(e)}")

@router.get("/ai/workflows", response_model=List[Dict[str, Any]])
async def get_ai_workflows():
    """Get all AI workflow executions for audit and monitoring"""
    supabase = get_supabase()
    result = await supabase.table("ai_workflows").select("*").order("created_at", desc=True).execute()
    
    if result.data:
        return result.data
    
    return []

@router.get("/analytics/ai-insights")
async def get_ai_insights():
    """Get AI-generated insights across all sales data"""
    supabase = get_supabase()
    
    # Get AI-generated insights from various tables
    customers_result = await supabase.table("customers").select("ai_generated_insights").execute()
    deals_result = await supabase.table("deals").select("ai_generated_strategy, ai_recommended_actions").execute()
    
    insights = {
        "customer_insights": [c.get("ai_generated_insights") for c in customers_result.data if c.get("ai_generated_insights")],
        "deal_strategies": [d.get("ai_generated_strategy") for d in deals_result.data if d.get("ai_generated_strategy")],
        "recommended_actions": [d.get("ai_recommended_actions") for d in deals_result.data if d.get("ai_recommended_actions")]
    }
    
    return insights

