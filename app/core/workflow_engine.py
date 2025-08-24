from typing import Dict, Any, List, Optional, Callable, Set
from datetime import datetime, timedelta
from enum import Enum
from dataclasses import dataclass, field
import json
import asyncio
from abc import ABC, abstractmethod
import uuid

class WorkflowStatus(Enum):
    DRAFT = "draft"
    ACTIVE = "active"
    PAUSED = "paused"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"

class StepStatus(Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    SKIPPED = "skipped"
    WAITING = "waiting"

class TriggerType(Enum):
    MANUAL = "manual"
    SCHEDULED = "scheduled"
    EVENT = "event"
    CONDITION = "condition"
    WEBHOOK = "webhook"

class ActionType(Enum):
    AI_TOOL = "ai_tool"
    HUMAN_TASK = "human_task"
    CONDITION = "condition"
    DELAY = "delay"
    NOTIFICATION = "notification"
    DATA_UPDATE = "data_update"
    WORKFLOW_TRIGGER = "workflow_trigger"

@dataclass
class WorkflowContext:
    """Context data that flows through workflow execution"""
    workflow_id: str
    execution_id: str
    data: Dict[str, Any] = field(default_factory=dict)
    variables: Dict[str, Any] = field(default_factory=dict)
    metadata: Dict[str, Any] = field(default_factory=dict)
    created_at: datetime = field(default_factory=datetime.utcnow)
    updated_at: datetime = field(default_factory=datetime.utcnow)

@dataclass
class WorkflowStep:
    """Individual step in a workflow"""
    id: str
    name: str
    action_type: ActionType
    config: Dict[str, Any]
    dependencies: List[str] = field(default_factory=list)
    conditions: List[Dict[str, Any]] = field(default_factory=list)
    timeout_seconds: Optional[int] = None
    retry_count: int = 0
    max_retries: int = 3
    status: StepStatus = StepStatus.PENDING
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    result: Optional[Dict[str, Any]] = None
    error: Optional[str] = None

class WorkflowTrigger:
    """Defines when a workflow should be triggered"""
    
    def __init__(self, trigger_type: TriggerType, config: Dict[str, Any]):
        self.trigger_type = trigger_type
        self.config = config
        self.id = str(uuid.uuid4())
    
    def should_trigger(self, event_data: Dict[str, Any]) -> bool:
        """Check if this trigger should fire based on event data"""
        if self.trigger_type == TriggerType.EVENT:
            event_type = self.config.get('event_type')
            return event_data.get('type') == event_type
        elif self.trigger_type == TriggerType.CONDITION:
            # Simple condition evaluation
            condition = self.config.get('condition')
            return self._evaluate_condition(condition, event_data)
        return False
    
    def _evaluate_condition(self, condition: str, data: Dict[str, Any]) -> bool:
        """Simple condition evaluator"""
        # This is a simplified implementation
        # In production, you'd want a more robust expression evaluator
        try:
            # Replace variables in condition with actual values
            for key, value in data.items():
                condition = condition.replace(f'${key}', str(value))
            return eval(condition)
        except:
            return False

@dataclass
class WorkflowDefinition:
    """Defines a workflow template"""
    id: str
    name: str
    description: str
    version: str
    steps: List[WorkflowStep]
    triggers: List[WorkflowTrigger] = field(default_factory=list)
    variables: Dict[str, Any] = field(default_factory=dict)
    sla_hours: Optional[int] = None
    tags: List[str] = field(default_factory=list)
    created_at: datetime = field(default_factory=datetime.utcnow)
    updated_at: datetime = field(default_factory=datetime.utcnow)
    created_by: str = "system"

@dataclass
class WorkflowExecution:
    """Runtime instance of a workflow"""
    id: str
    workflow_id: str
    status: WorkflowStatus
    context: WorkflowContext
    current_step: Optional[str] = None
    completed_steps: Set[str] = field(default_factory=set)
    failed_steps: Set[str] = field(default_factory=set)
    started_at: datetime = field(default_factory=datetime.utcnow)
    completed_at: Optional[datetime] = None
    triggered_by: str = "manual"
    priority: int = 5  # 1-10, 10 being highest

class StepExecutor(ABC):
    """Base class for step executors"""
    
    @abstractmethod
    async def execute(self, step: WorkflowStep, context: WorkflowContext) -> Dict[str, Any]:
        """Execute a workflow step"""
        pass

class AIToolExecutor(StepExecutor):
    """Executor for AI tool actions"""
    
    def __init__(self, ai_tools_library):
        self.ai_tools = ai_tools_library
    
    async def execute(self, step: WorkflowStep, context: WorkflowContext) -> Dict[str, Any]:
        tool_name = step.config.get('tool_name')
        parameters = step.config.get('parameters', {})
        
        # Substitute variables from context
        parameters = self._substitute_variables(parameters, context)
        
        execution = await self.ai_tools.execute_tool(tool_name, parameters)
        
        return {
            "success": execution.result.success if execution.result else False,
            "data": execution.result.data if execution.result else None,
            "execution_id": execution.tool_id
        }
    
    def _substitute_variables(self, parameters: Dict[str, Any], context: WorkflowContext) -> Dict[str, Any]:
        """Replace variable placeholders with actual values"""
        result = {}
        for key, value in parameters.items():
            if isinstance(value, str) and value.startswith('${'):
                var_name = value[2:-1]  # Remove ${ and }
                result[key] = context.variables.get(var_name, value)
            else:
                result[key] = value
        return result

class HumanTaskExecutor(StepExecutor):
    """Executor for human tasks"""
    
    async def execute(self, step: WorkflowStep, context: WorkflowContext) -> Dict[str, Any]:
        # Create a human task and wait for completion
        task_data = {
            "task_id": f"task_{step.id}_{context.execution_id}",
            "title": step.config.get('title', step.name),
            "description": step.config.get('description', ''),
            "assignee": step.config.get('assignee'),
            "due_date": datetime.utcnow() + timedelta(hours=step.config.get('due_hours', 24)),
            "context": context.data
        }
        
        # In a real implementation, this would create a task in your task management system
        # For now, we'll simulate immediate completion
        return {
            "success": True,
            "data": task_data,
            "status": "created"
        }

class ConditionExecutor(StepExecutor):
    """Executor for conditional logic"""
    
    async def execute(self, step: WorkflowStep, context: WorkflowContext) -> Dict[str, Any]:
        condition = step.config.get('condition')
        if not condition:
            return {"success": False, "error": "No condition specified"}
        
        try:
            # Simple condition evaluation
            result = self._evaluate_condition(condition, context)
            return {
                "success": True,
                "data": {"condition_result": result},
                "condition_met": result
            }
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    def _evaluate_condition(self, condition: str, context: WorkflowContext) -> bool:
        """Evaluate a condition against context data"""
        # Replace variables with actual values
        for key, value in context.variables.items():
            condition = condition.replace(f'${key}', str(value))
        for key, value in context.data.items():
            condition = condition.replace(f'${key}', str(value))
        
        # Simple evaluation (in production, use a proper expression evaluator)
        return eval(condition)

class DelayExecutor(StepExecutor):
    """Executor for delay/wait actions"""
    
    async def execute(self, step: WorkflowStep, context: WorkflowContext) -> Dict[str, Any]:
        delay_seconds = step.config.get('delay_seconds', 0)
        delay_minutes = step.config.get('delay_minutes', 0)
        delay_hours = step.config.get('delay_hours', 0)
        
        total_delay = delay_seconds + (delay_minutes * 60) + (delay_hours * 3600)
        
        if total_delay > 0:
            await asyncio.sleep(min(total_delay, 300))  # Cap at 5 minutes for demo
        
        return {
            "success": True,
            "data": {"delayed_seconds": total_delay}
        }

class WorkflowEngine:
    """Main workflow engine for managing workflow execution"""
    
    def __init__(self, ai_tools_library=None):
        self.workflows: Dict[str, WorkflowDefinition] = {}
        self.executions: Dict[str, WorkflowExecution] = {}
        self.executors: Dict[ActionType, StepExecutor] = {}
        self.running_executions: Set[str] = set()
        
        # Register default executors
        if ai_tools_library:
            self.executors[ActionType.AI_TOOL] = AIToolExecutor(ai_tools_library)
        self.executors[ActionType.HUMAN_TASK] = HumanTaskExecutor()
        self.executors[ActionType.CONDITION] = ConditionExecutor()
        self.executors[ActionType.DELAY] = DelayExecutor()
        
        # Load default workflows
        self._load_default_workflows()
    
    def _load_default_workflows(self):
        """Load default sales workflows"""
        # Lead Qualification Workflow
        lead_qualification = WorkflowDefinition(
            id="lead_qualification_v1",
            name="Lead Qualification Process",
            description="Automated lead qualification with AI analysis and human review",
            version="1.0",
            steps=[
                WorkflowStep(
                    id="enrich_lead",
                    name="Enrich Lead Data",
                    action_type=ActionType.AI_TOOL,
                    config={
                        "tool_name": "enrich_lead",
                        "parameters": {
                            "lead_id": "${lead_id}",
                            "enrich_company": True,
                            "enrich_contact": True
                        }
                    }
                ),
                WorkflowStep(
                    id="score_lead",
                    name="Calculate Lead Score",
                    action_type=ActionType.AI_TOOL,
                    config={
                        "tool_name": "analyze_data",
                        "parameters": {
                            "analysis_type": "lead_scoring"
                        }
                    },
                    dependencies=["enrich_lead"]
                ),
                WorkflowStep(
                    id="check_score",
                    name="Check Lead Score",
                    action_type=ActionType.CONDITION,
                    config={
                        "condition": "${lead_score} >= 70"
                    },
                    dependencies=["score_lead"]
                ),
                WorkflowStep(
                    id="send_welcome_email",
                    name="Send Welcome Email",
                    action_type=ActionType.AI_TOOL,
                    config={
                        "tool_name": "send_email",
                        "parameters": {
                            "to": "${lead_email}",
                            "subject": "Welcome to our sales process",
                            "body": "Thank you for your interest. We'll be in touch soon."
                        }
                    },
                    dependencies=["check_score"],
                    conditions=[{"step": "check_score", "result": True}]
                ),
                WorkflowStep(
                    id="assign_to_sales",
                    name="Assign to Sales Rep",
                    action_type=ActionType.HUMAN_TASK,
                    config={
                        "title": "Review High-Quality Lead",
                        "description": "A high-scoring lead needs immediate attention",
                        "assignee": "sales_team",
                        "due_hours": 4
                    },
                    dependencies=["send_welcome_email"]
                )
            ],
            triggers=[
                WorkflowTrigger(TriggerType.EVENT, {"event_type": "lead_created"})
            ],
            sla_hours=24
        )
        
        # Opportunity Follow-up Workflow
        opportunity_followup = WorkflowDefinition(
            id="opportunity_followup_v1",
            name="Opportunity Follow-up Process",
            description="Automated follow-up sequence for sales opportunities",
            version="1.0",
            steps=[
                WorkflowStep(
                    id="wait_initial",
                    name="Initial Wait Period",
                    action_type=ActionType.DELAY,
                    config={"delay_hours": 24}
                ),
                WorkflowStep(
                    id="send_followup_email",
                    name="Send Follow-up Email",
                    action_type=ActionType.AI_TOOL,
                    config={
                        "tool_name": "send_email",
                        "parameters": {
                            "to": "${contact_email}",
                            "subject": "Following up on our conversation",
                            "body": "Hi ${contact_name}, I wanted to follow up on our recent discussion..."
                        }
                    },
                    dependencies=["wait_initial"]
                ),
                WorkflowStep(
                    id="schedule_demo",
                    name="Schedule Product Demo",
                    action_type=ActionType.AI_TOOL,
                    config={
                        "tool_name": "schedule_meeting",
                        "parameters": {
                            "title": "Product Demo - ${company_name}",
                            "duration": 60,
                            "attendees": ["${contact_email}", "${sales_rep_email}"]
                        }
                    },
                    dependencies=["send_followup_email"]
                )
            ],
            triggers=[
                WorkflowTrigger(TriggerType.EVENT, {"event_type": "opportunity_created"})
            ],
            sla_hours=72
        )
        
        self.register_workflow(lead_qualification)
        self.register_workflow(opportunity_followup)
    
    def register_workflow(self, workflow: WorkflowDefinition):
        """Register a new workflow definition"""
        self.workflows[workflow.id] = workflow
    
    def get_workflow(self, workflow_id: str) -> Optional[WorkflowDefinition]:
        """Get a workflow definition by ID"""
        return self.workflows.get(workflow_id)
    
    def list_workflows(self) -> List[WorkflowDefinition]:
        """List all registered workflows"""
        return list(self.workflows.values())
    
    async def trigger_workflow(self, workflow_id: str, context_data: Dict[str, Any], 
                              triggered_by: str = "manual") -> WorkflowExecution:
        """Trigger a workflow execution"""
        workflow = self.get_workflow(workflow_id)
        if not workflow:
            raise ValueError(f"Workflow '{workflow_id}' not found")
        
        execution_id = str(uuid.uuid4())
        context = WorkflowContext(
            workflow_id=workflow_id,
            execution_id=execution_id,
            data=context_data,
            variables=workflow.variables.copy()
        )
        
        execution = WorkflowExecution(
            id=execution_id,
            workflow_id=workflow_id,
            status=WorkflowStatus.ACTIVE,
            context=context,
            triggered_by=triggered_by
        )
        
        self.executions[execution_id] = execution
        
        # Start execution in background
        asyncio.create_task(self._execute_workflow(execution))
        
        return execution
    
    async def _execute_workflow(self, execution: WorkflowExecution):
        """Execute a workflow instance"""
        self.running_executions.add(execution.id)
        
        try:
            workflow = self.get_workflow(execution.workflow_id)
            if not workflow:
                execution.status = WorkflowStatus.FAILED
                return
            
            # Execute steps based on dependencies
            remaining_steps = {step.id: step for step in workflow.steps}
            
            while remaining_steps and execution.status == WorkflowStatus.ACTIVE:
                # Find steps that can be executed (all dependencies met)
                ready_steps = [
                    step for step in remaining_steps.values()
                    if all(dep in execution.completed_steps for dep in step.dependencies)
                    and self._check_step_conditions(step, execution)
                ]
                
                if not ready_steps:
                    # No more steps can be executed
                    break
                
                # Execute ready steps
                for step in ready_steps:
                    try:
                        await self._execute_step(step, execution)
                        execution.completed_steps.add(step.id)
                        remaining_steps.pop(step.id)
                    except Exception as e:
                        step.error = str(e)
                        step.status = StepStatus.FAILED
                        execution.failed_steps.add(step.id)
                        remaining_steps.pop(step.id)
            
            # Determine final status
            if execution.failed_steps:
                execution.status = WorkflowStatus.FAILED
            elif not remaining_steps:
                execution.status = WorkflowStatus.COMPLETED
            else:
                execution.status = WorkflowStatus.PAUSED  # Waiting for conditions or manual intervention
            
            execution.completed_at = datetime.utcnow()
            
        except Exception as e:
            execution.status = WorkflowStatus.FAILED
            execution.completed_at = datetime.utcnow()
        
        finally:
            self.running_executions.discard(execution.id)
    
    def _check_step_conditions(self, step: WorkflowStep, execution: WorkflowExecution) -> bool:
        """Check if step conditions are met"""
        if not step.conditions:
            return True
        
        # Simple condition checking
        for condition in step.conditions:
            dep_step = condition.get('step')
            expected_result = condition.get('result')
            
            if dep_step in execution.completed_steps:
                # In a real implementation, you'd check the actual step result
                # For now, assume conditions are met
                continue
            else:
                return False
        
        return True
    
    async def _execute_step(self, step: WorkflowStep, execution: WorkflowExecution):
        """Execute a single workflow step"""
        step.status = StepStatus.RUNNING
        step.started_at = datetime.utcnow()
        execution.current_step = step.id
        
        executor = self.executors.get(step.action_type)
        if not executor:
            raise ValueError(f"No executor found for action type '{step.action_type}'")
        
        # Execute with timeout
        try:
            if step.timeout_seconds:
                result = await asyncio.wait_for(
                    executor.execute(step, execution.context),
                    timeout=step.timeout_seconds
                )
            else:
                result = await executor.execute(step, execution.context)
            
            step.result = result
            step.status = StepStatus.COMPLETED
            step.completed_at = datetime.utcnow()
            
            # Update context with step results
            if result.get('success') and result.get('data'):
                execution.context.data.update(result['data'])
            
        except asyncio.TimeoutError:
            step.status = StepStatus.FAILED
            step.error = "Step execution timed out"
            step.completed_at = datetime.utcnow()
            raise
        except Exception as e:
            step.status = StepStatus.FAILED
            step.error = str(e)
            step.completed_at = datetime.utcnow()
            raise
    
    def get_execution(self, execution_id: str) -> Optional[WorkflowExecution]:
        """Get workflow execution by ID"""
        return self.executions.get(execution_id)
    
    def list_executions(self, workflow_id: Optional[str] = None, 
                       status: Optional[WorkflowStatus] = None) -> List[WorkflowExecution]:
        """List workflow executions with optional filters"""
        executions = list(self.executions.values())
        
        if workflow_id:
            executions = [e for e in executions if e.workflow_id == workflow_id]
        
        if status:
            executions = [e for e in executions if e.status == status]
        
        return sorted(executions, key=lambda x: x.started_at, reverse=True)
    
    async def handle_event(self, event_data: Dict[str, Any]):
        """Handle incoming events and trigger matching workflows"""
        for workflow in self.workflows.values():
            for trigger in workflow.triggers:
                if trigger.should_trigger(event_data):
                    await self.trigger_workflow(
                        workflow.id,
                        event_data,
                        triggered_by=f"event_{event_data.get('type', 'unknown')}"
                    )

# Global instance
workflow_engine = WorkflowEngine()