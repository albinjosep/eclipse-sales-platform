from fastapi import APIRouter, HTTPException
from app.core.ai_engine import get_ai_engine
from typing import Dict, Any, List

router = APIRouter()

@router.get("/")
async def list_agents():
    """List all available AI agents"""
    ai_engine = get_ai_engine()
    return {
        "agents": list(ai_engine.agents.keys()),
        "workflows": list(ai_engine.workflows.keys()),
        "status": "active"
    }

@router.post("/{agent_name}/execute")
async def execute_agent(agent_name: str, task: str, context: Dict[str, Any] = None):
    """Execute a specific AI agent with a task"""
    ai_engine = get_ai_engine()
    
    if agent_name not in ai_engine.agents:
        raise HTTPException(status_code=404, detail=f"Agent {agent_name} not found")
    
    try:
        result = await ai_engine.execute_agent(agent_name, task, context or {})
        return {
            "agent": agent_name,
            "task": task,
            "result": result,
            "status": "completed"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Agent execution failed: {str(e)}")

@router.get("/{agent_name}/status")
async def get_agent_status(agent_name: str):
    """Get status and performance metrics for a specific agent"""
    ai_engine = get_ai_engine()
    
    if agent_name not in ai_engine.agents:
        raise HTTPException(status_code=404, detail=f"Agent {agent_name} not found")
    
    # Get agent performance from database
    supabase = ai_engine.supabase
    workflows = await supabase.table("ai_workflows").select("*").eq("ai_agent_id", agent_name).execute()
    
    if workflows.data:
        total_executions = len(workflows.data)
        successful_executions = len([w for w in workflows.data if w.get("success")])
        success_rate = successful_executions / total_executions if total_executions > 0 else 0
        
        return {
            "agent": agent_name,
            "status": "active",
            "total_executions": total_executions,
            "successful_executions": successful_executions,
            "success_rate": success_rate,
            "last_execution": workflows.data[0].get("created_at") if workflows.data else None
        }
    
    return {
        "agent": agent_name,
        "status": "active",
        "total_executions": 0,
        "successful_executions": 0,
        "success_rate": 0,
        "last_execution": None
    }

@router.post("/{agent_name}/train")
async def train_agent(agent_name: str, training_data: Dict[str, Any]):
    """Provide feedback to improve agent performance"""
    ai_engine = get_ai_engine()
    
    if agent_name not in ai_engine.agents:
        raise HTTPException(status_code=404, detail=f"Agent {agent_name} not found")
    
    try:
        # Log training feedback for future model improvement
        supabase = ai_engine.supabase
        training_log = {
            "agent_id": agent_name,
            "training_type": "feedback",
            "training_data": training_data,
            "created_at": "2024-01-01T00:00:00Z"  # TODO: Use actual datetime
        }
        
        await supabase.table("ai_workflows").insert(training_log).execute()
        
        return {
            "agent": agent_name,
            "training_status": "feedback_logged",
            "message": "Training feedback logged for future model improvement"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Training feedback logging failed: {str(e)}")

@router.get("/performance/overview")
async def get_agents_performance():
    """Get performance overview of all AI agents"""
    ai_engine = get_ai_engine()
    supabase = ai_engine.supabase
    
    # Get performance data for all agents
    workflows = await supabase.table("ai_workflows").select("*").execute()
    
    agent_performance = {}
    
    for agent_name in ai_engine.agents.keys():
        agent_workflows = [w for w in workflows.data if w.get("ai_agent_id") == agent_name]
        
        if agent_workflows:
            total_executions = len(agent_workflows)
            successful_executions = len([w for w in agent_workflows if w.get("success")])
            success_rate = successful_executions / total_executions if total_executions > 0 else 0
            
            agent_performance[agent_name] = {
                "total_executions": total_executions,
                "successful_executions": successful_executions,
                "success_rate": success_rate,
                "last_execution": agent_workflows[0].get("created_at") if agent_workflows else None
            }
        else:
            agent_performance[agent_name] = {
                "total_executions": 0,
                "successful_executions": 0,
                "success_rate": 0,
                "last_execution": None
            }
    
    return {
        "total_agents": len(ai_engine.agents),
        "agent_performance": agent_performance,
        "overall_success_rate": sum([p["success_rate"] for p in agent_performance.values()]) / len(agent_performance) if agent_performance else 0
    }

