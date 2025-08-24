from typing import Dict, Any, List, Optional, Union
from datetime import datetime, timedelta
from enum import Enum
from dataclasses import dataclass
import json
import asyncio
from abc import ABC, abstractmethod

class ToolType(Enum):
    EMAIL = "email"
    CALENDAR = "calendar"
    CRM_UPDATE = "crm_update"
    LEAD_ENRICHMENT = "lead_enrichment"
    CALL = "call"
    DATA_ANALYSIS = "data_analysis"
    WORKFLOW_TRIGGER = "workflow_trigger"
    NOTIFICATION = "notification"

class ToolStatus(Enum):
    PENDING = "pending"
    EXECUTING = "executing"
    COMPLETED = "completed"
    FAILED = "failed"
    REQUIRES_APPROVAL = "requires_approval"

@dataclass
class ToolResult:
    success: bool
    data: Optional[Dict[str, Any]] = None
    error: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None

@dataclass
class ToolExecution:
    tool_id: str
    tool_type: ToolType
    parameters: Dict[str, Any]
    status: ToolStatus
    result: Optional[ToolResult] = None
    created_at: datetime = None
    completed_at: Optional[datetime] = None
    requires_human_approval: bool = False

    def __post_init__(self):
        if self.created_at is None:
            self.created_at = datetime.utcnow()

class AITool(ABC):
    """Base class for all AI tools"""
    
    def __init__(self, tool_type: ToolType, name: str, description: str):
        self.tool_type = tool_type
        self.name = name
        self.description = description
        self.requires_approval = False
    
    @abstractmethod
    async def execute(self, parameters: Dict[str, Any]) -> ToolResult:
        """Execute the tool with given parameters"""
        pass
    
    @abstractmethod
    def validate_parameters(self, parameters: Dict[str, Any]) -> bool:
        """Validate tool parameters before execution"""
        pass
    
    def get_schema(self) -> Dict[str, Any]:
        """Return the parameter schema for this tool"""
        return {
            "type": "object",
            "properties": {},
            "required": []
        }

class EmailTool(AITool):
    """Tool for sending emails"""
    
    def __init__(self):
        super().__init__(
            ToolType.EMAIL,
            "send_email",
            "Send personalized emails to leads and customers"
        )
        self.requires_approval = True
    
    def validate_parameters(self, parameters: Dict[str, Any]) -> bool:
        required_fields = ['to', 'subject', 'body']
        return all(field in parameters for field in required_fields)
    
    async def execute(self, parameters: Dict[str, Any]) -> ToolResult:
        try:
            # Simulate email sending
            await asyncio.sleep(1)  # Simulate API call
            
            email_data = {
                "to": parameters['to'],
                "subject": parameters['subject'],
                "body": parameters['body'],
                "sent_at": datetime.utcnow().isoformat(),
                "message_id": f"msg_{datetime.utcnow().timestamp()}"
            }
            
            return ToolResult(
                success=True,
                data=email_data,
                metadata={"delivery_status": "sent", "provider": "smtp"}
            )
        except Exception as e:
            return ToolResult(success=False, error=str(e))
    
    def get_schema(self) -> Dict[str, Any]:
        return {
            "type": "object",
            "properties": {
                "to": {"type": "string", "description": "Recipient email address"},
                "subject": {"type": "string", "description": "Email subject line"},
                "body": {"type": "string", "description": "Email body content"},
                "cc": {"type": "array", "items": {"type": "string"}, "description": "CC recipients"},
                "template_id": {"type": "string", "description": "Email template to use"}
            },
            "required": ["to", "subject", "body"]
        }

class CalendarTool(AITool):
    """Tool for calendar operations"""
    
    def __init__(self):
        super().__init__(
            ToolType.CALENDAR,
            "schedule_meeting",
            "Schedule meetings and manage calendar events"
        )
    
    def validate_parameters(self, parameters: Dict[str, Any]) -> bool:
        required_fields = ['title', 'start_time', 'duration', 'attendees']
        return all(field in parameters for field in required_fields)
    
    async def execute(self, parameters: Dict[str, Any]) -> ToolResult:
        try:
            await asyncio.sleep(1)  # Simulate calendar API call
            
            meeting_data = {
                "event_id": f"evt_{datetime.utcnow().timestamp()}",
                "title": parameters['title'],
                "start_time": parameters['start_time'],
                "duration": parameters['duration'],
                "attendees": parameters['attendees'],
                "meeting_link": f"https://meet.company.com/room/{datetime.utcnow().timestamp()}",
                "created_at": datetime.utcnow().isoformat()
            }
            
            return ToolResult(
                success=True,
                data=meeting_data,
                metadata={"calendar_provider": "google", "timezone": "UTC"}
            )
        except Exception as e:
            return ToolResult(success=False, error=str(e))
    
    def get_schema(self) -> Dict[str, Any]:
        return {
            "type": "object",
            "properties": {
                "title": {"type": "string", "description": "Meeting title"},
                "start_time": {"type": "string", "description": "Meeting start time (ISO format)"},
                "duration": {"type": "integer", "description": "Duration in minutes"},
                "attendees": {"type": "array", "items": {"type": "string"}, "description": "Attendee email addresses"},
                "description": {"type": "string", "description": "Meeting description"},
                "location": {"type": "string", "description": "Meeting location or video link"}
            },
            "required": ["title", "start_time", "duration", "attendees"]
        }

class CRMUpdateTool(AITool):
    """Tool for updating CRM records"""
    
    def __init__(self):
        super().__init__(
            ToolType.CRM_UPDATE,
            "update_crm",
            "Update lead, account, and opportunity records in CRM"
        )
    
    def validate_parameters(self, parameters: Dict[str, Any]) -> bool:
        return 'record_type' in parameters and 'record_id' in parameters and 'updates' in parameters
    
    async def execute(self, parameters: Dict[str, Any]) -> ToolResult:
        try:
            await asyncio.sleep(0.5)  # Simulate CRM API call
            
            update_data = {
                "record_type": parameters['record_type'],
                "record_id": parameters['record_id'],
                "updates": parameters['updates'],
                "updated_at": datetime.utcnow().isoformat(),
                "updated_by": "ai_agent"
            }
            
            return ToolResult(
                success=True,
                data=update_data,
                metadata={"crm_system": "salesforce", "version": "v1"}
            )
        except Exception as e:
            return ToolResult(success=False, error=str(e))
    
    def get_schema(self) -> Dict[str, Any]:
        return {
            "type": "object",
            "properties": {
                "record_type": {"type": "string", "enum": ["lead", "account", "opportunity", "contact"]},
                "record_id": {"type": "string", "description": "CRM record ID"},
                "updates": {"type": "object", "description": "Fields to update with new values"}
            },
            "required": ["record_type", "record_id", "updates"]
        }

class LeadEnrichmentTool(AITool):
    """Tool for enriching lead data"""
    
    def __init__(self):
        super().__init__(
            ToolType.LEAD_ENRICHMENT,
            "enrich_lead",
            "Enrich lead data with external sources and AI insights"
        )
    
    def validate_parameters(self, parameters: Dict[str, Any]) -> bool:
        return 'lead_id' in parameters or ('email' in parameters or 'company' in parameters)
    
    async def execute(self, parameters: Dict[str, Any]) -> ToolResult:
        try:
            await asyncio.sleep(2)  # Simulate data enrichment API calls
            
            enriched_data = {
                "lead_id": parameters.get('lead_id'),
                "email": parameters.get('email'),
                "company_info": {
                    "name": "TechCorp Inc",
                    "industry": "Technology",
                    "size": "50-200 employees",
                    "revenue": "$10M-50M",
                    "location": "San Francisco, CA",
                    "technologies": ["React", "Node.js", "AWS"]
                },
                "contact_info": {
                    "linkedin_profile": "https://linkedin.com/in/contact",
                    "job_title": "VP of Engineering",
                    "seniority": "Senior",
                    "department": "Engineering"
                },
                "intent_signals": [
                    "Visited pricing page 3 times",
                    "Downloaded whitepaper",
                    "Attended webinar",
                    "Engaged with LinkedIn posts"
                ],
                "lead_score": 85,
                "enriched_at": datetime.utcnow().isoformat()
            }
            
            return ToolResult(
                success=True,
                data=enriched_data,
                metadata={"sources": ["clearbit", "zoominfo", "linkedin"], "confidence": 0.92}
            )
        except Exception as e:
            return ToolResult(success=False, error=str(e))
    
    def get_schema(self) -> Dict[str, Any]:
        return {
            "type": "object",
            "properties": {
                "lead_id": {"type": "string", "description": "Lead ID in CRM"},
                "email": {"type": "string", "description": "Lead email address"},
                "company": {"type": "string", "description": "Company name"},
                "enrich_company": {"type": "boolean", "description": "Whether to enrich company data"},
                "enrich_contact": {"type": "boolean", "description": "Whether to enrich contact data"}
            },
            "required": []
        }

class DataAnalysisTool(AITool):
    """Tool for analyzing sales data and generating insights"""
    
    def __init__(self):
        super().__init__(
            ToolType.DATA_ANALYSIS,
            "analyze_data",
            "Analyze sales data and generate actionable insights"
        )
    
    def validate_parameters(self, parameters: Dict[str, Any]) -> bool:
        return 'analysis_type' in parameters
    
    async def execute(self, parameters: Dict[str, Any]) -> ToolResult:
        try:
            await asyncio.sleep(1.5)  # Simulate data analysis
            
            analysis_type = parameters['analysis_type']
            
            if analysis_type == 'pipeline_forecast':
                analysis_data = {
                    "forecast_period": "Q1 2024",
                    "predicted_revenue": "$245,000",
                    "confidence_interval": "85%",
                    "deals_likely_to_close": 8,
                    "at_risk_deals": 2,
                    "key_factors": [
                        "Strong momentum in enterprise segment",
                        "Seasonal uptick in Q1",
                        "Two large deals in final stages"
                    ]
                }
            elif analysis_type == 'lead_scoring':
                analysis_data = {
                    "total_leads_analyzed": 150,
                    "high_quality_leads": 23,
                    "conversion_probability": {
                        "high_score": 0.65,
                        "medium_score": 0.35,
                        "low_score": 0.12
                    },
                    "top_scoring_factors": [
                        "Company size match",
                        "Budget authority",
                        "Active evaluation timeline"
                    ]
                }
            else:
                analysis_data = {
                    "analysis_type": analysis_type,
                    "status": "completed",
                    "insights_generated": 5
                }
            
            return ToolResult(
                success=True,
                data=analysis_data,
                metadata={"analysis_engine": "ai_insights", "model_version": "v2.1"}
            )
        except Exception as e:
            return ToolResult(success=False, error=str(e))
    
    def get_schema(self) -> Dict[str, Any]:
        return {
            "type": "object",
            "properties": {
                "analysis_type": {
                    "type": "string",
                    "enum": ["pipeline_forecast", "lead_scoring", "win_loss_analysis", "territory_performance"]
                },
                "time_period": {"type": "string", "description": "Time period for analysis"},
                "filters": {"type": "object", "description": "Additional filters for analysis"}
            },
            "required": ["analysis_type"]
        }

class AIToolsLibrary:
    """Central library for managing AI tools"""
    
    def __init__(self):
        self.tools: Dict[str, AITool] = {}
        self.executions: Dict[str, ToolExecution] = {}
        self._register_default_tools()
    
    def _register_default_tools(self):
        """Register default AI tools"""
        default_tools = [
            EmailTool(),
            CalendarTool(),
            CRMUpdateTool(),
            LeadEnrichmentTool(),
            DataAnalysisTool()
        ]
        
        for tool in default_tools:
            self.register_tool(tool)
    
    def register_tool(self, tool: AITool):
        """Register a new tool"""
        self.tools[tool.name] = tool
    
    def get_tool(self, tool_name: str) -> Optional[AITool]:
        """Get a tool by name"""
        return self.tools.get(tool_name)
    
    def list_tools(self) -> List[Dict[str, Any]]:
        """List all available tools"""
        return [
            {
                "name": tool.name,
                "type": tool.tool_type.value,
                "description": tool.description,
                "requires_approval": tool.requires_approval,
                "schema": tool.get_schema()
            }
            for tool in self.tools.values()
        ]
    
    async def execute_tool(self, tool_name: str, parameters: Dict[str, Any], 
                          execution_id: Optional[str] = None) -> ToolExecution:
        """Execute a tool with given parameters"""
        tool = self.get_tool(tool_name)
        if not tool:
            raise ValueError(f"Tool '{tool_name}' not found")
        
        if not tool.validate_parameters(parameters):
            raise ValueError(f"Invalid parameters for tool '{tool_name}'")
        
        if execution_id is None:
            execution_id = f"{tool_name}_{datetime.utcnow().timestamp()}"
        
        execution = ToolExecution(
            tool_id=execution_id,
            tool_type=tool.tool_type,
            parameters=parameters,
            status=ToolStatus.REQUIRES_APPROVAL if tool.requires_approval else ToolStatus.EXECUTING,
            requires_human_approval=tool.requires_approval
        )
        
        self.executions[execution_id] = execution
        
        if not tool.requires_approval:
            result = await tool.execute(parameters)
            execution.result = result
            execution.status = ToolStatus.COMPLETED if result.success else ToolStatus.FAILED
            execution.completed_at = datetime.utcnow()
        
        return execution
    
    async def approve_execution(self, execution_id: str) -> ToolExecution:
        """Approve a pending tool execution"""
        execution = self.executions.get(execution_id)
        if not execution:
            raise ValueError(f"Execution '{execution_id}' not found")
        
        if execution.status != ToolStatus.REQUIRES_APPROVAL:
            raise ValueError(f"Execution '{execution_id}' is not pending approval")
        
        tool = self.get_tool(execution.tool_type.value)
        if not tool:
            raise ValueError(f"Tool for execution '{execution_id}' not found")
        
        execution.status = ToolStatus.EXECUTING
        result = await tool.execute(execution.parameters)
        execution.result = result
        execution.status = ToolStatus.COMPLETED if result.success else ToolStatus.FAILED
        execution.completed_at = datetime.utcnow()
        
        return execution
    
    def get_execution(self, execution_id: str) -> Optional[ToolExecution]:
        """Get execution status"""
        return self.executions.get(execution_id)
    
    def get_pending_approvals(self) -> List[ToolExecution]:
        """Get all executions pending approval"""
        return [
            execution for execution in self.executions.values()
            if execution.status == ToolStatus.REQUIRES_APPROVAL
        ]

# Global instance
ai_tools = AIToolsLibrary()