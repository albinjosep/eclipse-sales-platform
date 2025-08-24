from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from uuid import UUID

class CustomerBase(BaseModel):
    name: str = Field(..., description="Customer name")
    email: Optional[str] = Field(None, description="Customer email")
    company: Optional[str] = Field(None, description="Company name")
    industry: Optional[str] = Field(None, description="Industry vertical")

class CustomerCreate(CustomerBase):
    pass

class Customer(CustomerBase):
    id: UUID
    buying_intent_score: float = Field(default=0.0, description="AI-calculated buying intent score")
    churn_risk_score: float = Field(default=0.0, description="AI-calculated churn risk")
    lifetime_value_prediction: float = Field(default=0.0, description="AI-predicted lifetime value")
    ai_generated_insights: Optional[Dict[str, Any]] = Field(None, description="AI-generated customer insights")
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class InteractionBase(BaseModel):
    customer_id: UUID
    interaction_type: str = Field(..., description="Type of interaction (email, call, meeting, chat)")
    content: str = Field(..., description="Interaction content")
    metadata: Optional[Dict[str, Any]] = Field(None, description="Additional interaction metadata")

class InteractionCreate(InteractionBase):
    pass

class Interaction(InteractionBase):
    id: UUID
    content_vector: Optional[List[float]] = Field(None, description="Vector embedding of content")
    sentiment_score: Optional[float] = Field(None, description="AI-calculated sentiment score")
    intent_classification: Optional[str] = Field(None, description="AI-classified customer intent")
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class DealBase(BaseModel):
    customer_id: UUID
    title: str = Field(..., description="Deal title")
    value: Optional[float] = Field(None, description="Deal value")
    stage: str = Field(..., description="Current deal stage")

class DealCreate(DealBase):
    pass

class Deal(DealBase):
    id: UUID
    close_probability: float = Field(default=0.0, description="AI-predicted close probability")
    ai_predicted_close_date: Optional[datetime] = Field(None, description="AI-predicted close date")
    ai_recommended_actions: Optional[Dict[str, Any]] = Field(None, description="AI-recommended actions")
    ai_generated_strategy: Optional[str] = Field(None, description="AI-generated deal strategy")
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class AIWorkflowBase(BaseModel):
    workflow_type: str = Field(..., description="Type of AI workflow")
    status: str = Field(..., description="Workflow status")
    input_data: Optional[Dict[str, Any]] = Field(None, description="Input data for the workflow")
    ai_agent_id: Optional[str] = Field(None, description="AI agent that executed the workflow")

class AIWorkflowCreate(AIWorkflowBase):
    pass

class AIWorkflow(AIWorkflowBase):
    id: UUID
    output_data: Optional[Dict[str, Any]] = Field(None, description="Output data from the workflow")
    execution_time_ms: Optional[int] = Field(None, description="Workflow execution time in milliseconds")
    success: Optional[bool] = Field(None, description="Whether the workflow succeeded")
    error_message: Optional[str] = Field(None, description="Error message if workflow failed")
    created_at: datetime
    completed_at: Optional[datetime] = Field(None, description="When the workflow completed")

    class Config:
        from_attributes = True

class LeadQualificationRequest(BaseModel):
    customer_id: UUID
    interaction_data: List[InteractionCreate]
    company_data: Optional[Dict[str, Any]] = None

class LeadQualificationResponse(BaseModel):
    qualification_score: float
    buying_intent: str
    recommended_actions: List[str]
    ai_reasoning: str

class FollowUpRequest(BaseModel):
    customer_id: UUID
    deal_id: Optional[UUID] = None
    context: str
    preferred_medium: str = "email"  # email, call, meeting

class FollowUpResponse(BaseModel):
    generated_content: str
    scheduled_actions: List[Dict[str, Any]]
    next_follow_up_date: Optional[datetime] = None

class DealStrategyRequest(BaseModel):
    deal_id: UUID
    current_context: str
    customer_interactions: List[Interaction]

class DealStrategyResponse(BaseModel):
    strategy_recommendations: List[str]
    risk_assessment: Dict[str, Any]
    next_steps: List[str]
    predicted_outcome: str

class PricingRequest(BaseModel):
    deal_id: UUID
    customer_context: Dict[str, Any]
    competitive_landscape: Optional[Dict[str, Any]] = None

class PricingResponse(BaseModel):
    recommended_pricing: Dict[str, Any]
    discount_recommendations: List[Dict[str, Any]]
    negotiation_strategy: str
    pricing_confidence: float

