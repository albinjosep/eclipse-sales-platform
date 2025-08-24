from typing import Dict, Any, List, Optional, Set, Callable
from datetime import datetime, timedelta
from enum import Enum
from dataclasses import dataclass, field
import json
import asyncio
from abc import ABC, abstractmethod
import uuid
from collections import defaultdict, deque

class ContextType(Enum):
    LEAD_ANALYSIS = "lead_analysis"
    ACCOUNT_OVERVIEW = "account_overview"
    PIPELINE_METRICS = "pipeline_metrics"
    TASK_MANAGEMENT = "task_management"
    MARKET_INTELLIGENCE = "market_intelligence"
    CONVERSATION_HISTORY = "conversation_history"
    RECOMMENDATIONS = "recommendations"
    ALERTS = "alerts"

class Priority(Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class EventType(Enum):
    USER_MESSAGE = "user_message"
    AI_RESPONSE = "ai_response"
    TOOL_EXECUTION = "tool_execution"
    DATA_UPDATE = "data_update"
    WORKFLOW_TRIGGER = "workflow_trigger"
    EXTERNAL_EVENT = "external_event"
    USER_ACTION = "user_action"

@dataclass
class ContextEvent:
    """Represents an event that can trigger context updates"""
    id: str
    event_type: EventType
    data: Dict[str, Any]
    timestamp: datetime = field(default_factory=datetime.utcnow)
    source: str = "system"
    user_id: Optional[str] = None
    session_id: Optional[str] = None

@dataclass
class ContextInsight:
    """Individual insight or data point for the context panel"""
    id: str
    context_type: ContextType
    title: str
    data: Dict[str, Any]
    priority: Priority
    expires_at: Optional[datetime] = None
    created_at: datetime = field(default_factory=datetime.utcnow)
    updated_at: datetime = field(default_factory=datetime.utcnow)
    tags: List[str] = field(default_factory=list)
    metadata: Dict[str, Any] = field(default_factory=dict)

@dataclass
class UserSession:
    """Tracks user session and conversation context"""
    session_id: str
    user_id: str
    started_at: datetime
    last_activity: datetime
    conversation_history: List[Dict[str, Any]] = field(default_factory=list)
    active_contexts: Set[ContextType] = field(default_factory=set)
    variables: Dict[str, Any] = field(default_factory=dict)
    preferences: Dict[str, Any] = field(default_factory=dict)

class ContextProvider(ABC):
    """Base class for context providers"""
    
    def __init__(self, context_type: ContextType, name: str):
        self.context_type = context_type
        self.name = name
        self.subscribers: List[Callable] = []
    
    @abstractmethod
    async def generate_insights(self, event: ContextEvent, session: UserSession) -> List[ContextInsight]:
        """Generate insights based on an event"""
        pass
    
    def subscribe(self, callback: Callable):
        """Subscribe to context updates"""
        self.subscribers.append(callback)
    
    async def notify_subscribers(self, insights: List[ContextInsight]):
        """Notify all subscribers of new insights"""
        for callback in self.subscribers:
            try:
                await callback(insights)
            except Exception as e:
                print(f"Error notifying subscriber: {e}")

class LeadAnalysisProvider(ContextProvider):
    """Provides lead analysis context"""
    
    def __init__(self):
        super().__init__(ContextType.LEAD_ANALYSIS, "Lead Analysis Provider")
    
    async def generate_insights(self, event: ContextEvent, session: UserSession) -> List[ContextInsight]:
        insights = []
        
        # Check if event mentions leads
        if event.event_type == EventType.USER_MESSAGE:
            message = event.data.get('content', '').lower()
            if any(keyword in message for keyword in ['lead', 'prospect', 'qualify', 'score']):
                # Generate lead analysis insight
                lead_data = await self._analyze_current_lead(event, session)
                
                insight = ContextInsight(
                    id=f"lead_analysis_{uuid.uuid4()}",
                    context_type=ContextType.LEAD_ANALYSIS,
                    title="Lead Analysis",
                    data=lead_data,
                    priority=Priority.HIGH,
                    expires_at=datetime.utcnow() + timedelta(hours=2)
                )
                insights.append(insight)
        
        elif event.event_type == EventType.TOOL_EXECUTION:
            tool_name = event.data.get('tool_name')
            if tool_name == 'enrich_lead':
                # Update lead analysis with enrichment results
                enrichment_data = event.data.get('result', {})
                
                insight = ContextInsight(
                    id=f"lead_enrichment_{uuid.uuid4()}",
                    context_type=ContextType.LEAD_ANALYSIS,
                    title="Lead Enrichment Complete",
                    data={
                        "enrichment_results": enrichment_data,
                        "confidence_score": enrichment_data.get('metadata', {}).get('confidence', 0.8),
                        "data_sources": enrichment_data.get('metadata', {}).get('sources', [])
                    },
                    priority=Priority.MEDIUM
                )
                insights.append(insight)
        
        return insights
    
    async def _analyze_current_lead(self, event: ContextEvent, session: UserSession) -> Dict[str, Any]:
        """Analyze the current lead being discussed"""
        # In a real implementation, this would query your CRM/database
        return {
            "lead_id": "lead_123",
            "name": "Sarah Johnson",
            "company": "TechCorp Inc",
            "title": "VP of Engineering",
            "lead_score": 85,
            "stage": "Qualified",
            "last_interaction": "2024-01-15T10:30:00Z",
            "intent_signals": [
                "Visited pricing page 3 times",
                "Downloaded whitepaper",
                "Attended webinar",
                "Engaged with LinkedIn posts"
            ],
            "next_action": "Schedule discovery call",
            "probability": 0.75,
            "estimated_value": 25000
        }

class PipelineMetricsProvider(ContextProvider):
    """Provides pipeline and sales metrics context"""
    
    def __init__(self):
        super().__init__(ContextType.PIPELINE_METRICS, "Pipeline Metrics Provider")
    
    async def generate_insights(self, event: ContextEvent, session: UserSession) -> List[ContextInsight]:
        insights = []
        
        if event.event_type == EventType.USER_MESSAGE:
            message = event.data.get('content', '').lower()
            if any(keyword in message for keyword in ['pipeline', 'forecast', 'revenue', 'deals']):
                metrics_data = await self._get_pipeline_metrics()
                
                insight = ContextInsight(
                    id=f"pipeline_metrics_{uuid.uuid4()}",
                    context_type=ContextType.PIPELINE_METRICS,
                    title="Pipeline Overview",
                    data=metrics_data,
                    priority=Priority.HIGH,
                    expires_at=datetime.utcnow() + timedelta(hours=1)
                )
                insights.append(insight)
        
        return insights
    
    async def _get_pipeline_metrics(self) -> Dict[str, Any]:
        """Get current pipeline metrics"""
        return {
            "total_pipeline_value": "$1,245,000",
            "deals_in_pipeline": 23,
            "deals_closing_this_month": 5,
            "deals_closing_this_quarter": 12,
            "average_deal_size": "$54,130",
            "conversion_rate": "18%",
            "sales_cycle_days": 45,
            "forecast_accuracy": "92%",
            "at_risk_deals": 2,
            "top_opportunities": [
                {"company": "Enterprise Corp", "value": "$150,000", "stage": "Proposal", "probability": 0.8},
                {"company": "Global Solutions", "value": "$120,000", "stage": "Negotiation", "probability": 0.9},
                {"company": "Tech Innovations", "value": "$95,000", "stage": "Demo", "probability": 0.6}
            ]
        }

class TaskManagementProvider(ContextProvider):
    """Provides task and activity context"""
    
    def __init__(self):
        super().__init__(ContextType.TASK_MANAGEMENT, "Task Management Provider")
    
    async def generate_insights(self, event: ContextEvent, session: UserSession) -> List[ContextInsight]:
        insights = []
        
        # Always show current tasks
        if event.event_type in [EventType.USER_MESSAGE, EventType.AI_RESPONSE]:
            tasks_data = await self._get_current_tasks(session.user_id)
            
            insight = ContextInsight(
                id=f"tasks_{uuid.uuid4()}",
                context_type=ContextType.TASK_MANAGEMENT,
                title="Today's Tasks",
                data=tasks_data,
                priority=Priority.MEDIUM,
                expires_at=datetime.utcnow() + timedelta(minutes=30)
            )
            insights.append(insight)
        
        return insights
    
    async def _get_current_tasks(self, user_id: str) -> Dict[str, Any]:
        """Get current tasks for the user"""
        return {
            "pending_tasks": [
                {
                    "id": "task_1",
                    "title": "Follow up with Acme Corp",
                    "priority": "high",
                    "due_date": "2024-01-16T14:00:00Z",
                    "type": "follow_up",
                    "estimated_duration": 30
                },
                {
                    "id": "task_2",
                    "title": "Send proposal to TechStart Inc",
                    "priority": "medium",
                    "due_date": "2024-01-17T10:00:00Z",
                    "type": "proposal",
                    "estimated_duration": 60
                },
                {
                    "id": "task_3",
                    "title": "Schedule demo with Global Solutions",
                    "priority": "high",
                    "due_date": "2024-01-16T16:00:00Z",
                    "type": "scheduling",
                    "estimated_duration": 15
                }
            ],
            "completed_today": 3,
            "overdue_tasks": 1,
            "total_pending": 8
        }

class RecommendationsProvider(ContextProvider):
    """Provides AI-generated recommendations"""
    
    def __init__(self):
        super().__init__(ContextType.RECOMMENDATIONS, "AI Recommendations Provider")
    
    async def generate_insights(self, event: ContextEvent, session: UserSession) -> List[ContextInsight]:
        insights = []
        
        # Generate contextual recommendations based on conversation
        if event.event_type == EventType.AI_RESPONSE:
            recommendations = await self._generate_recommendations(event, session)
            
            insight = ContextInsight(
                id=f"recommendations_{uuid.uuid4()}",
                context_type=ContextType.RECOMMENDATIONS,
                title="AI Recommendations",
                data={"recommendations": recommendations},
                priority=Priority.MEDIUM,
                expires_at=datetime.utcnow() + timedelta(hours=4)
            )
            insights.append(insight)
        
        return insights
    
    async def _generate_recommendations(self, event: ContextEvent, session: UserSession) -> List[Dict[str, Any]]:
        """Generate contextual recommendations"""
        # Analyze conversation history and current context
        recent_topics = self._extract_topics_from_session(session)
        
        recommendations = []
        
        if 'lead' in recent_topics:
            recommendations.extend([
                {
                    "type": "action",
                    "title": "Schedule Discovery Call",
                    "description": "Based on lead score and engagement, schedule a discovery call within 24 hours",
                    "priority": "high",
                    "estimated_impact": "High conversion probability"
                },
                {
                    "type": "content",
                    "title": "Send Industry Report",
                    "description": "Share relevant industry insights to build credibility",
                    "priority": "medium",
                    "estimated_impact": "Increased engagement"
                }
            ])
        
        if 'pipeline' in recent_topics:
            recommendations.extend([
                {
                    "type": "analysis",
                    "title": "Review At-Risk Deals",
                    "description": "2 deals show risk signals - immediate attention needed",
                    "priority": "high",
                    "estimated_impact": "Prevent deal loss"
                },
                {
                    "type": "strategy",
                    "title": "Focus on Q1 Closers",
                    "description": "Prioritize 5 deals with highest Q1 close probability",
                    "priority": "medium",
                    "estimated_impact": "Meet quarterly targets"
                }
            ])
        
        # Always include some general recommendations
        recommendations.extend([
            {
                "type": "optimization",
                "title": "Update CRM Records",
                "description": "12 leads need updated contact information",
                "priority": "low",
                "estimated_impact": "Improved data quality"
            },
            {
                "type": "networking",
                "title": "Connect on LinkedIn",
                "description": "5 prospects haven't been connected with yet",
                "priority": "low",
                "estimated_impact": "Stronger relationships"
            }
        ])
        
        return recommendations[:4]  # Limit to top 4 recommendations
    
    def _extract_topics_from_session(self, session: UserSession) -> Set[str]:
        """Extract key topics from conversation history"""
        topics = set()
        
        for message in session.conversation_history[-10:]:  # Last 10 messages
            content = message.get('content', '').lower()
            if any(word in content for word in ['lead', 'prospect', 'qualify']):
                topics.add('lead')
            if any(word in content for word in ['pipeline', 'forecast', 'deals']):
                topics.add('pipeline')
            if any(word in content for word in ['email', 'send', 'contact']):
                topics.add('communication')
            if any(word in content for word in ['meeting', 'schedule', 'demo']):
                topics.add('scheduling')
        
        return topics

class RealTimeContextEngine:
    """Main engine for managing real-time context and insights"""
    
    def __init__(self):
        self.providers: Dict[ContextType, ContextProvider] = {}
        self.sessions: Dict[str, UserSession] = {}
        self.insights: Dict[str, ContextInsight] = {}
        self.event_history: deque = deque(maxlen=1000)
        self.subscribers: Dict[str, List[Callable]] = defaultdict(list)
        
        # Register default providers
        self._register_default_providers()
        
        # Start cleanup task
        asyncio.create_task(self._cleanup_expired_insights())
    
    def _register_default_providers(self):
        """Register default context providers"""
        providers = [
            LeadAnalysisProvider(),
            PipelineMetricsProvider(),
            TaskManagementProvider(),
            RecommendationsProvider()
        ]
        
        for provider in providers:
            self.register_provider(provider)
    
    def register_provider(self, provider: ContextProvider):
        """Register a context provider"""
        self.providers[provider.context_type] = provider
        
        # Subscribe to provider updates
        provider.subscribe(self._handle_provider_insights)
    
    async def _handle_provider_insights(self, insights: List[ContextInsight]):
        """Handle insights from providers"""
        for insight in insights:
            self.insights[insight.id] = insight
            
            # Notify subscribers
            await self._notify_insight_subscribers(insight)
    
    def create_session(self, user_id: str, session_id: Optional[str] = None) -> UserSession:
        """Create a new user session"""
        if session_id is None:
            session_id = str(uuid.uuid4())
        
        session = UserSession(
            session_id=session_id,
            user_id=user_id,
            started_at=datetime.utcnow(),
            last_activity=datetime.utcnow()
        )
        
        self.sessions[session_id] = session
        return session
    
    def get_session(self, session_id: str) -> Optional[UserSession]:
        """Get a user session"""
        return self.sessions.get(session_id)
    
    async def process_event(self, event: ContextEvent) -> List[ContextInsight]:
        """Process an event and generate context insights"""
        self.event_history.append(event)
        
        # Update session
        session = None
        if event.session_id:
            session = self.get_session(event.session_id)
            if session:
                session.last_activity = datetime.utcnow()
                
                # Add to conversation history
                if event.event_type in [EventType.USER_MESSAGE, EventType.AI_RESPONSE]:
                    session.conversation_history.append({
                        "timestamp": event.timestamp.isoformat(),
                        "type": event.event_type.value,
                        "content": event.data.get('content', ''),
                        "sender": event.data.get('sender', 'unknown')
                    })
        
        # Generate insights from all providers
        all_insights = []
        for provider in self.providers.values():
            try:
                insights = await provider.generate_insights(event, session)
                all_insights.extend(insights)
                
                # Store insights
                for insight in insights:
                    self.insights[insight.id] = insight
                
            except Exception as e:
                print(f"Error generating insights from {provider.name}: {e}")
        
        # Notify subscribers
        for insight in all_insights:
            await self._notify_insight_subscribers(insight)
        
        return all_insights
    
    def get_insights_for_session(self, session_id: str, 
                                context_types: Optional[List[ContextType]] = None) -> List[ContextInsight]:
        """Get current insights for a session"""
        session = self.get_session(session_id)
        if not session:
            return []
        
        # Filter insights by context types if specified
        insights = list(self.insights.values())
        
        if context_types:
            insights = [i for i in insights if i.context_type in context_types]
        
        # Filter out expired insights
        now = datetime.utcnow()
        insights = [i for i in insights if i.expires_at is None or i.expires_at > now]
        
        # Sort by priority and recency
        priority_order = {Priority.CRITICAL: 4, Priority.HIGH: 3, Priority.MEDIUM: 2, Priority.LOW: 1}
        insights.sort(key=lambda x: (priority_order[x.priority], x.updated_at), reverse=True)
        
        return insights[:10]  # Limit to top 10 insights
    
    def subscribe_to_insights(self, session_id: str, callback: Callable):
        """Subscribe to insight updates for a session"""
        self.subscribers[session_id].append(callback)
    
    async def _notify_insight_subscribers(self, insight: ContextInsight):
        """Notify subscribers of new insights"""
        # For now, notify all sessions - in production, you'd filter by relevance
        for session_id, callbacks in self.subscribers.items():
            for callback in callbacks:
                try:
                    await callback(insight)
                except Exception as e:
                    print(f"Error notifying subscriber: {e}")
    
    async def _cleanup_expired_insights(self):
        """Periodically clean up expired insights"""
        while True:
            try:
                now = datetime.utcnow()
                expired_ids = [
                    insight_id for insight_id, insight in self.insights.items()
                    if insight.expires_at and insight.expires_at <= now
                ]
                
                for insight_id in expired_ids:
                    del self.insights[insight_id]
                
                # Clean up old sessions (inactive for more than 24 hours)
                cutoff = now - timedelta(hours=24)
                inactive_sessions = [
                    session_id for session_id, session in self.sessions.items()
                    if session.last_activity < cutoff
                ]
                
                for session_id in inactive_sessions:
                    del self.sessions[session_id]
                    if session_id in self.subscribers:
                        del self.subscribers[session_id]
                
            except Exception as e:
                print(f"Error during cleanup: {e}")
            
            # Run cleanup every 5 minutes
            await asyncio.sleep(300)

# Global instance
context_engine = RealTimeContextEngine()