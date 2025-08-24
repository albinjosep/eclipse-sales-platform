from typing import Dict, List, Any, Optional, Tuple
from dataclasses import dataclass
from enum import Enum
import json
import asyncio
from datetime import datetime, timedelta
import logging
from .data_schema import Task, Workflow, AIDecision, AIMemory, Lead, WorkflowStatus, TaskType
from .ai_engine import AIEngine

logger = logging.getLogger(__name__)

class DecisionType(Enum):
    TASK_DECOMPOSITION = "task_decomposition"
    WORKFLOW_ROUTING = "workflow_routing"
    APPROVAL_REQUIRED = "approval_required"
    PRIORITY_ASSIGNMENT = "priority_assignment"
    RESOURCE_ALLOCATION = "resource_allocation"

class AgentCapability(Enum):
    EMAIL_AUTOMATION = "email_automation"
    CALENDAR_MANAGEMENT = "calendar_management"
    CRM_UPDATES = "crm_updates"
    LEAD_ENRICHMENT = "lead_enrichment"
    DATA_ANALYSIS = "data_analysis"
    CONTENT_GENERATION = "content_generation"

@dataclass
class AgentTask:
    id: str
    type: TaskType
    description: str
    context: Dict[str, Any]
    priority: str
    estimated_duration: int  # minutes
    required_capabilities: List[AgentCapability]
    dependencies: List[str] = None
    approval_required: bool = False
    human_in_loop: bool = False

@dataclass
class WorkflowStep:
    step_id: str
    name: str
    description: str
    agent_tasks: List[AgentTask]
    conditions: Dict[str, Any]
    next_steps: List[str]
    rollback_steps: List[str] = None

@dataclass
class AgentDecision:
    decision_id: str
    decision_type: DecisionType
    context: Dict[str, Any]
    reasoning: str
    decision: Dict[str, Any]
    confidence: float
    alternatives: List[Dict[str, Any]] = None
    requires_approval: bool = False

class AIOrchestrator:
    """AI Agent Orchestrator implementing Think → Adapt → Act workflow"""
    
    def __init__(self, ai_engine: AIEngine, db_session):
        self.ai_engine = ai_engine
        self.db = db_session
        self.active_workflows: Dict[str, Workflow] = {}
        self.agent_capabilities = {
            "email_agent": [AgentCapability.EMAIL_AUTOMATION, AgentCapability.CONTENT_GENERATION],
            "calendar_agent": [AgentCapability.CALENDAR_MANAGEMENT],
            "crm_agent": [AgentCapability.CRM_UPDATES, AgentCapability.DATA_ANALYSIS],
            "enrichment_agent": [AgentCapability.LEAD_ENRICHMENT, AgentCapability.DATA_ANALYSIS],
            "analysis_agent": [AgentCapability.DATA_ANALYSIS, AgentCapability.CONTENT_GENERATION]
        }
    
    async def think(self, context: Dict[str, Any]) -> AgentDecision:
        """THINK phase: Analyze context and make strategic decisions"""
        
        # Retrieve relevant memory and context
        memory_context = await self._retrieve_memory_context(context)
        
        # Analyze the situation
        analysis_prompt = f"""
        Analyze the following sales context and determine the best course of action:
        
        Context: {json.dumps(context, indent=2)}
        Memory: {json.dumps(memory_context, indent=2)}
        
        Consider:
        1. Lead qualification status and potential
        2. Previous interactions and outcomes
        3. Current sales pipeline stage
        4. Available resources and timing
        5. Risk factors and opportunities
        
        Provide your analysis in JSON format with:
        - situation_assessment
        - recommended_actions
        - priority_level
        - risk_factors
        - success_probability
        """
        
        analysis_result = await self.ai_engine.generate_response(analysis_prompt)
        
        # Make strategic decision
        decision = AgentDecision(
            decision_id=f"decision_{datetime.utcnow().timestamp()}",
            decision_type=DecisionType.WORKFLOW_ROUTING,
            context=context,
            reasoning=analysis_result.get("reasoning", ""),
            decision=analysis_result,
            confidence=analysis_result.get("confidence", 0.7),
            requires_approval=analysis_result.get("requires_approval", False)
        )
        
        # Store decision for learning
        await self._store_decision(decision)
        
        return decision
    
    async def adapt(self, decision: AgentDecision) -> List[WorkflowStep]:
        """ADAPT phase: Create adaptive workflow based on decision"""
        
        # Decompose high-level decision into actionable workflow steps
        workflow_steps = await self._decompose_into_workflow(decision)
        
        # Adapt based on current system state and resources
        adapted_steps = await self._adapt_workflow_to_context(workflow_steps, decision.context)
        
        # Optimize for efficiency and success probability
        optimized_steps = await self._optimize_workflow(adapted_steps)
        
        return optimized_steps
    
    async def act(self, workflow_steps: List[WorkflowStep], lead_id: int) -> Dict[str, Any]:
        """ACT phase: Execute the workflow with monitoring and adaptation"""
        
        # Create workflow record
        workflow = Workflow(
            name=f"AI_Workflow_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}",
            description="AI-orchestrated sales workflow",
            type="ai_orchestrated",
            steps=json.dumps([step.__dict__ for step in workflow_steps]),
            ai_orchestrated=True,
            lead_id=lead_id,
            started_at=datetime.utcnow()
        )
        
        self.db.add(workflow)
        self.db.commit()
        
        execution_results = {
            "workflow_id": workflow.id,
            "steps_completed": 0,
            "steps_failed": 0,
            "current_step": 0,
            "status": "in_progress",
            "results": []
        }
        
        # Execute workflow steps
        for i, step in enumerate(workflow_steps):
            try:
                step_result = await self._execute_workflow_step(step, workflow.id)
                execution_results["results"].append(step_result)
                execution_results["steps_completed"] += 1
                execution_results["current_step"] = i + 1
                
                # Update workflow progress
                workflow.current_step = i + 1
                self.db.commit()
                
                # Check if human approval is required
                if step_result.get("requires_approval", False):
                    workflow.status = WorkflowStatus.WAITING_APPROVAL
                    execution_results["status"] = "waiting_approval"
                    self.db.commit()
                    break
                
                # Adaptive decision: should we continue or modify the workflow?
                if await self._should_adapt_workflow(step_result, workflow_steps[i+1:]):
                    remaining_steps = await self._adapt_remaining_workflow(step_result, workflow_steps[i+1:])
                    workflow_steps = workflow_steps[:i+1] + remaining_steps
                
            except Exception as e:
                logger.error(f"Step execution failed: {str(e)}")
                execution_results["steps_failed"] += 1
                execution_results["status"] = "failed"
                workflow.status = WorkflowStatus.FAILED
                self.db.commit()
                break
        
        # Mark workflow as completed if all steps succeeded
        if execution_results["status"] == "in_progress":
            workflow.status = WorkflowStatus.COMPLETED
            workflow.completed_at = datetime.utcnow()
            execution_results["status"] = "completed"
            self.db.commit()
        
        return execution_results
    
    async def _retrieve_memory_context(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Retrieve relevant AI memory for context"""
        
        lead_id = context.get("lead_id")
        if not lead_id:
            return {}
        
        # Query AI memory for this lead
        memories = self.db.query(AIMemory).filter(
            AIMemory.entity_type == "lead",
            AIMemory.entity_id == lead_id
        ).order_by(AIMemory.relevance_score.desc()).limit(10).all()
        
        memory_context = {
            "previous_interactions": [],
            "insights": [],
            "patterns": []
        }
        
        for memory in memories:
            if memory.memory_type == "interaction":
                memory_context["previous_interactions"].append(json.loads(memory.content))
            elif memory.memory_type == "insight":
                memory_context["insights"].append(json.loads(memory.content))
            elif memory.memory_type == "pattern":
                memory_context["patterns"].append(json.loads(memory.content))
        
        return memory_context
    
    async def _decompose_into_workflow(self, decision: AgentDecision) -> List[WorkflowStep]:
        """Decompose high-level decision into actionable workflow steps"""
        
        decomposition_prompt = f"""
        Break down this sales decision into specific, actionable workflow steps:
        
        Decision: {json.dumps(decision.decision, indent=2)}
        Context: {json.dumps(decision.context, indent=2)}
        
        Create a workflow with steps that include:
        1. Specific tasks to be performed
        2. Required agent capabilities
        3. Dependencies between steps
        4. Success criteria
        5. Rollback procedures if needed
        
        Format as JSON array of workflow steps.
        """
        
        workflow_definition = await self.ai_engine.generate_response(decomposition_prompt)
        
        workflow_steps = []
        for step_data in workflow_definition.get("steps", []):
            # Convert to WorkflowStep objects
            agent_tasks = []
            for task_data in step_data.get("tasks", []):
                task = AgentTask(
                    id=task_data["id"],
                    type=TaskType(task_data["type"]),
                    description=task_data["description"],
                    context=task_data.get("context", {}),
                    priority=task_data.get("priority", "medium"),
                    estimated_duration=task_data.get("estimated_duration", 30),
                    required_capabilities=[AgentCapability(cap) for cap in task_data.get("capabilities", [])],
                    dependencies=task_data.get("dependencies", []),
                    approval_required=task_data.get("approval_required", False)
                )
                agent_tasks.append(task)
            
            step = WorkflowStep(
                step_id=step_data["step_id"],
                name=step_data["name"],
                description=step_data["description"],
                agent_tasks=agent_tasks,
                conditions=step_data.get("conditions", {}),
                next_steps=step_data.get("next_steps", []),
                rollback_steps=step_data.get("rollback_steps", [])
            )
            workflow_steps.append(step)
        
        return workflow_steps
    
    async def _adapt_workflow_to_context(self, workflow_steps: List[WorkflowStep], context: Dict[str, Any]) -> List[WorkflowStep]:
        """Adapt workflow based on current context and constraints"""
        
        # Check resource availability
        available_agents = await self._get_available_agents()
        
        # Adapt timing based on lead preferences and business hours
        current_time = datetime.utcnow()
        
        adapted_steps = []
        for step in workflow_steps:
            adapted_step = step
            
            # Modify tasks based on available capabilities
            adapted_tasks = []
            for task in step.agent_tasks:
                if self._can_execute_task(task, available_agents):
                    adapted_tasks.append(task)
                else:
                    # Find alternative approach or defer task
                    alternative_task = await self._find_alternative_task(task, available_agents)
                    if alternative_task:
                        adapted_tasks.append(alternative_task)
            
            adapted_step.agent_tasks = adapted_tasks
            adapted_steps.append(adapted_step)
        
        return adapted_steps
    
    async def _execute_workflow_step(self, step: WorkflowStep, workflow_id: int) -> Dict[str, Any]:
        """Execute a single workflow step"""
        
        step_result = {
            "step_id": step.step_id,
            "status": "completed",
            "tasks_completed": 0,
            "tasks_failed": 0,
            "results": [],
            "requires_approval": False
        }
        
        # Execute all tasks in the step
        for task in step.agent_tasks:
            try:
                task_result = await self._execute_agent_task(task, workflow_id)
                step_result["results"].append(task_result)
                step_result["tasks_completed"] += 1
                
                if task.approval_required:
                    step_result["requires_approval"] = True
                
            except Exception as e:
                logger.error(f"Task execution failed: {str(e)}")
                step_result["tasks_failed"] += 1
                step_result["status"] = "failed"
        
        return step_result
    
    async def _execute_agent_task(self, task: AgentTask, workflow_id: int) -> Dict[str, Any]:
        """Execute a specific agent task"""
        
        # Find appropriate agent for this task
        agent_id = self._select_agent_for_task(task)
        
        # Create task record
        db_task = Task(
            title=task.description,
            description=f"AI-generated task: {task.description}",
            type=task.type,
            priority=task.priority,
            assigned_to=agent_id,
            ai_generated=True,
            ai_reasoning=f"Generated as part of workflow step for task type: {task.type.value}",
            ai_context=task.context,
            workflow_id=workflow_id,
            lead_id=task.context.get("lead_id")
        )
        
        self.db.add(db_task)
        self.db.commit()
        
        # Execute task based on type
        if task.type == TaskType.EMAIL:
            result = await self._execute_email_task(task)
        elif task.type == TaskType.CRM_UPDATE:
            result = await self._execute_crm_update_task(task)
        elif task.type == TaskType.LEAD_ENRICHMENT:
            result = await self._execute_enrichment_task(task)
        elif task.type == TaskType.CALL:
            result = await self._execute_call_task(task)
        else:
            result = {"status": "completed", "message": "Task type not implemented"}
        
        # Update task status
        db_task.status = WorkflowStatus.COMPLETED if result.get("status") == "completed" else WorkflowStatus.FAILED
        db_task.completed_at = datetime.utcnow()
        self.db.commit()
        
        return result
    
    async def _store_decision(self, decision: AgentDecision):
        """Store AI decision for learning and audit"""
        
        ai_decision = AIDecision(
            decision_type=decision.decision_type.value,
            context=decision.context,
            reasoning=decision.reasoning,
            decision=decision.decision,
            confidence=decision.confidence,
            model_version="v1.0",
            entity_type=decision.context.get("entity_type", "lead"),
            entity_id=decision.context.get("entity_id")
        )
        
        self.db.add(ai_decision)
        self.db.commit()
    
    def _select_agent_for_task(self, task: AgentTask) -> str:
        """Select the best agent for a given task"""
        
        for agent_id, capabilities in self.agent_capabilities.items():
            if all(cap in capabilities for cap in task.required_capabilities):
                return agent_id
        
        return "general_agent"  # Fallback
    
    def _can_execute_task(self, task: AgentTask, available_agents: List[str]) -> bool:
        """Check if task can be executed with available agents"""
        
        for agent_id in available_agents:
            agent_caps = self.agent_capabilities.get(agent_id, [])
            if all(cap in agent_caps for cap in task.required_capabilities):
                return True
        return False
    
    async def _get_available_agents(self) -> List[str]:
        """Get list of currently available agents"""
        # In a real implementation, this would check agent availability
        return list(self.agent_capabilities.keys())
    
    async def _should_adapt_workflow(self, step_result: Dict[str, Any], remaining_steps: List[WorkflowStep]) -> bool:
        """Determine if workflow should be adapted based on step results"""
        
        # Simple heuristic: adapt if step failed or if new information suggests better approach
        if step_result.get("status") == "failed":
            return True
        
        # Check if step results suggest a different approach
        if step_result.get("suggests_alternative", False):
            return True
        
        return False
    
    async def _find_alternative_task(self, task: AgentTask, available_agents: List[str]) -> Optional[AgentTask]:
        """Find alternative way to accomplish task with available agents"""
        # Simplified implementation - in practice, this would use AI to find alternatives
        return None
    
    async def _adapt_remaining_workflow(self, step_result: Dict[str, Any], remaining_steps: List[WorkflowStep]) -> List[WorkflowStep]:
        """Adapt remaining workflow steps based on current results"""
        # Simplified implementation - would use AI to modify remaining steps
        return remaining_steps
    
    async def _optimize_workflow(self, workflow_steps: List[WorkflowStep]) -> List[WorkflowStep]:
        """Optimize workflow for efficiency and success probability"""
        # Simplified implementation - would reorder steps, parallelize where possible, etc.
        return workflow_steps
    
    async def _execute_email_task(self, task: AgentTask) -> Dict[str, Any]:
        """Execute email-related task"""
        return {"status": "completed", "message": "Email task executed", "task_id": task.id}
    
    async def _execute_crm_update_task(self, task: AgentTask) -> Dict[str, Any]:
        """Execute CRM update task"""
        return {"status": "completed", "message": "CRM updated", "task_id": task.id}
    
    async def _execute_enrichment_task(self, task: AgentTask) -> Dict[str, Any]:
        """Execute lead enrichment task"""
        return {"status": "completed", "message": "Lead enriched", "task_id": task.id}
    
    async def _execute_call_task(self, task: AgentTask) -> Dict[str, Any]:
        """Execute call-related task"""
        return {"status": "completed", "message": "Call scheduled/completed", "task_id": task.id}