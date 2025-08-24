from sqlalchemy import Column, Integer, String, DateTime, Text, Boolean, JSON, ForeignKey, Float, Enum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

Base = declarative_base()

class LeadStatus(enum.Enum):
    NEW = "new"
    QUALIFIED = "qualified"
    CONTACTED = "contacted"
    NURTURING = "nurturing"
    OPPORTUNITY = "opportunity"
    CLOSED_WON = "closed_won"
    CLOSED_LOST = "closed_lost"

class WorkflowStatus(enum.Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    WAITING_APPROVAL = "waiting_approval"
    COMPLETED = "completed"
    FAILED = "failed"

class TaskType(enum.Enum):
    EMAIL = "email"
    CALL = "call"
    MEETING = "meeting"
    CRM_UPDATE = "crm_update"
    LEAD_ENRICHMENT = "lead_enrichment"
    FOLLOW_UP = "follow_up"
    QUALIFICATION = "qualification"

class Account(Base):
    __tablename__ = "accounts"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    domain = Column(String(255), unique=True)
    industry = Column(String(100))
    size = Column(String(50))  # startup, small, medium, enterprise
    revenue = Column(Float)
    location = Column(String(255))
    description = Column(Text)
    website = Column(String(255))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # AI-generated insights
    ai_score = Column(Float, default=0.0)  # Account scoring
    ai_insights = Column(JSON)  # AI-generated account insights
    
    # Relationships
    leads = relationship("Lead", back_populates="account")
    opportunities = relationship("Opportunity", back_populates="account")

class Lead(Base):
    __tablename__ = "leads"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False)
    first_name = Column(String(100))
    last_name = Column(String(100))
    title = Column(String(255))
    phone = Column(String(50))
    linkedin_url = Column(String(255))
    source = Column(String(100))  # website, linkedin, referral, etc.
    status = Column(Enum(LeadStatus), default=LeadStatus.NEW)
    
    # Lead scoring and qualification
    lead_score = Column(Float, default=0.0)
    qualification_score = Column(Float, default=0.0)
    intent_score = Column(Float, default=0.0)
    
    # AI-generated data
    ai_summary = Column(Text)
    ai_next_actions = Column(JSON)
    ai_qualification_notes = Column(Text)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_contacted = Column(DateTime)
    
    # Foreign keys
    account_id = Column(Integer, ForeignKey("accounts.id"))
    assigned_to = Column(String(255))  # User ID
    
    # Relationships
    account = relationship("Account", back_populates="leads")
    interactions = relationship("Interaction", back_populates="lead")
    tasks = relationship("Task", back_populates="lead")

class Opportunity(Base):
    __tablename__ = "opportunities"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    stage = Column(String(100))  # discovery, proposal, negotiation, closed
    value = Column(Float)
    probability = Column(Float, default=0.0)
    expected_close_date = Column(DateTime)
    actual_close_date = Column(DateTime)
    
    # AI predictions
    ai_win_probability = Column(Float, default=0.0)
    ai_forecasted_value = Column(Float)
    ai_risk_factors = Column(JSON)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Foreign keys
    account_id = Column(Integer, ForeignKey("accounts.id"))
    lead_id = Column(Integer, ForeignKey("leads.id"))
    
    # Relationships
    account = relationship("Account", back_populates="opportunities")

class Interaction(Base):
    __tablename__ = "interactions"
    
    id = Column(Integer, primary_key=True, index=True)
    type = Column(String(50))  # email, call, meeting, demo
    direction = Column(String(20))  # inbound, outbound
    subject = Column(String(255))
    content = Column(Text)
    outcome = Column(String(100))
    sentiment = Column(String(50))  # positive, neutral, negative
    
    # AI analysis
    ai_summary = Column(Text)
    ai_sentiment_score = Column(Float)
    ai_intent_signals = Column(JSON)
    ai_next_actions = Column(JSON)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Foreign keys
    lead_id = Column(Integer, ForeignKey("leads.id"))
    
    # Relationships
    lead = relationship("Lead", back_populates="interactions")

class Task(Base):
    __tablename__ = "tasks"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    type = Column(Enum(TaskType))
    status = Column(Enum(WorkflowStatus), default=WorkflowStatus.PENDING)
    priority = Column(String(20), default="medium")  # low, medium, high, urgent
    
    # Task execution details
    assigned_to = Column(String(255))  # User ID or AI agent
    due_date = Column(DateTime)
    completed_at = Column(DateTime)
    
    # AI-generated task details
    ai_generated = Column(Boolean, default=False)
    ai_reasoning = Column(Text)
    ai_context = Column(JSON)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Foreign keys
    lead_id = Column(Integer, ForeignKey("leads.id"))
    workflow_id = Column(Integer, ForeignKey("workflows.id"))
    
    # Relationships
    lead = relationship("Lead", back_populates="tasks")
    workflow = relationship("Workflow", back_populates="tasks")

class Workflow(Base):
    __tablename__ = "workflows"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    type = Column(String(100))  # lead_qualification, nurture_sequence, opportunity_management
    status = Column(Enum(WorkflowStatus), default=WorkflowStatus.PENDING)
    
    # Workflow definition
    steps = Column(JSON)  # Workflow step definitions
    current_step = Column(Integer, default=0)
    
    # AI orchestration
    ai_orchestrated = Column(Boolean, default=True)
    ai_decision_points = Column(JSON)
    ai_approval_required = Column(Boolean, default=False)
    
    # Execution tracking
    started_at = Column(DateTime)
    completed_at = Column(DateTime)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Foreign keys
    lead_id = Column(Integer, ForeignKey("leads.id"))
    
    # Relationships
    tasks = relationship("Task", back_populates="workflow")

class AIMemory(Base):
    __tablename__ = "ai_memory"
    
    id = Column(Integer, primary_key=True, index=True)
    entity_type = Column(String(50))  # lead, account, interaction, task
    entity_id = Column(Integer)
    
    # Memory content
    memory_type = Column(String(50))  # context, insight, decision, pattern
    content = Column(Text)
    embedding = Column(JSON)  # Vector embedding for similarity search
    
    # Memory metadata
    confidence_score = Column(Float, default=0.0)
    relevance_score = Column(Float, default=0.0)
    access_count = Column(Integer, default=0)
    last_accessed = Column(DateTime)
    
    # Memory lifecycle
    expires_at = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class AIDecision(Base):
    __tablename__ = "ai_decisions"
    
    id = Column(Integer, primary_key=True, index=True)
    decision_type = Column(String(100))  # lead_scoring, task_prioritization, workflow_routing
    context = Column(JSON)  # Input context for the decision
    reasoning = Column(Text)  # AI reasoning process
    decision = Column(JSON)  # The actual decision made
    confidence = Column(Float, default=0.0)
    
    # Decision tracking
    model_version = Column(String(50))
    execution_time_ms = Column(Integer)
    
    # Feedback and learning
    human_feedback = Column(String(50))  # approved, rejected, modified
    outcome_tracked = Column(Boolean, default=False)
    actual_outcome = Column(JSON)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Foreign keys
    entity_type = Column(String(50))
    entity_id = Column(Integer)

class SystemMetrics(Base):
    __tablename__ = "system_metrics"
    
    id = Column(Integer, primary_key=True, index=True)
    metric_name = Column(String(100), nullable=False)
    metric_value = Column(Float)
    metric_metadata = Column(JSON)
    
    # Time series data
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    # Categorization
    category = Column(String(50))  # performance, accuracy, usage, cost
    subcategory = Column(String(50))

# Indexes for performance
from sqlalchemy import Index

# Create indexes for frequently queried fields
Index('idx_leads_email', Lead.email)
Index('idx_leads_status', Lead.status)
Index('idx_leads_account_id', Lead.account_id)
Index('idx_interactions_lead_id', Interaction.lead_id)
Index('idx_tasks_lead_id', Task.lead_id)
Index('idx_tasks_status', Task.status)
Index('idx_ai_memory_entity', AIMemory.entity_type, AIMemory.entity_id)
Index('idx_ai_decisions_entity', AIDecision.entity_type, AIDecision.entity_id)
Index('idx_system_metrics_timestamp', SystemMetrics.timestamp)