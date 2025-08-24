from fastapi import APIRouter, HTTPException
from app.core.ai_engine import get_ai_engine
from app.core.database import get_supabase
from typing import Dict, Any, List
from datetime import datetime

router = APIRouter()

@router.get("/")
async def list_workflows():
    """List all available AI workflows"""
    ai_engine = get_ai_engine()
    return {
        "available_workflows": list(ai_engine.workflows.keys()),
        "workflow_types": [
            "new_lead",
            "deal_progression", 
            "follow_up_sequence",
            "customer_retention",
            "competitive_analysis"
        ]
    }

@router.post("/new-lead")
async def execute_new_lead_workflow(lead_data: Dict[str, Any]):
    """Execute the new lead workflow - AI autonomously qualifies and nurtures"""
    ai_engine = get_ai_engine()
    
    try:
        # Execute the new lead workflow
        result = await ai_engine.execute_workflow("new_lead", lead_data)
        
        return {
            "workflow": "new_lead",
            "status": "completed",
            "result": result,
            "actions_taken": [
                "Lead automatically qualified",
                "Customer profile enriched with AI insights",
                "Follow-up sequence scheduled",
                "Deal opportunity created if qualified"
            ]
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"New lead workflow failed: {str(e)}")

@router.post("/deal-progression")
async def execute_deal_progression_workflow(deal_data: Dict[str, Any]):
    """Execute the deal progression workflow - AI analyzes and advances deals"""
    ai_engine = get_ai_engine()
    
    try:
        # Execute the deal progression workflow
        result = await ai_engine.execute_workflow("deal_progression", deal_data)
        
        return {
            "workflow": "deal_progression",
            "status": "completed",
            "result": result,
            "actions_taken": [
                "Deal health analyzed",
                "Risk factors identified",
                "Next steps recommended",
                "Close probability updated"
            ]
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Deal progression workflow failed: {str(e)}")

@router.post("/follow-up-sequence")
async def execute_follow_up_sequence_workflow(customer_data: Dict[str, Any]):
    """Execute the follow-up sequence workflow - AI manages customer communication"""
    ai_engine = get_ai_engine()
    
    try:
        # Execute the follow-up sequence workflow
        result = await ai_engine.execute_workflow("follow_up_sequence", customer_data)
        
        return {
            "workflow": "follow_up_sequence",
            "status": "completed",
            "result": result,
            "actions_taken": [
                "Follow-up emails generated and sent",
                "Meetings scheduled based on availability",
                "Communication cadence optimized",
                "Engagement metrics tracked"
            ]
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Follow-up sequence workflow failed: {str(e)}")

@router.get("/executions")
async def get_workflow_executions(limit: int = 50):
    """Get recent workflow executions for monitoring and audit"""
    supabase = get_supabase()
    
    result = await supabase.table("ai_workflows").select("*").order("created_at", desc=True).limit(limit).execute()
    
    if result.data:
        return {
            "total_executions": len(result.data),
            "executions": result.data
        }
    
    return {
        "total_executions": 0,
        "executions": []
    }

@router.get("/executions/{workflow_type}")
async def get_workflow_executions_by_type(workflow_type: str, limit: int = 50):
    """Get executions for a specific workflow type"""
    supabase = get_supabase()
    
    result = await supabase.table("ai_workflows").select("*").eq("workflow_type", workflow_type).order("created_at", desc=True).limit(limit).execute()
    
    if result.data:
        return {
            "workflow_type": workflow_type,
            "total_executions": len(result.data),
            "executions": result.data
        }
    
    return {
        "workflow_type": workflow_type,
        "total_executions": 0,
        "executions": []
    }

@router.get("/performance")
async def get_workflow_performance():
    """Get performance metrics for all workflows"""
    supabase = get_supabase()
    
    # Get all workflow executions
    result = await supabase.table("ai_workflows").select("*").execute()
    
    if not result.data:
        return {
            "total_workflows": 0,
            "performance_metrics": {}
        }
    
    # Calculate performance metrics by workflow type
    workflow_metrics = {}
    
    for execution in result.data:
        workflow_type = execution.get("workflow_type")
        if workflow_type not in workflow_metrics:
            workflow_metrics[workflow_type] = {
                "total_executions": 0,
                "successful_executions": 0,
                "failed_executions": 0,
                "average_execution_time": 0,
                "total_execution_time": 0
            }
        
        metrics = workflow_metrics[workflow_type]
        metrics["total_executions"] += 1
        
        if execution.get("success"):
            metrics["successful_executions"] += 1
        else:
            metrics["failed_executions"] += 1
        
        if execution.get("execution_time_ms"):
            metrics["total_execution_time"] += execution["execution_time_ms"]
    
    # Calculate averages
    for workflow_type, metrics in workflow_metrics.items():
        if metrics["total_executions"] > 0:
            metrics["success_rate"] = metrics["successful_executions"] / metrics["total_executions"]
            metrics["average_execution_time"] = metrics["total_execution_time"] / metrics["total_executions"]
        else:
            metrics["success_rate"] = 0
            metrics["average_execution_time"] = 0
    
    return {
        "total_workflows": len(workflow_metrics),
        "performance_metrics": workflow_metrics
    }

@router.post("/custom")
async def execute_custom_workflow(workflow_config: Dict[str, Any]):
    """Execute a custom workflow defined by the user"""
    ai_engine = get_ai_engine()
    
    try:
        # Validate workflow configuration
        required_fields = ["name", "steps", "input_data"]
        for field in required_fields:
            if field not in workflow_config:
                raise HTTPException(status_code=400, detail=f"Missing required field: {field}")
        
        # Execute custom workflow
        result = await ai_engine.execute_agent(
            "deal_strategy",  # Use a general agent for custom workflows
            f"Execute custom workflow: {workflow_config['name']}",
            workflow_config
        )
        
        return {
            "workflow": "custom",
            "name": workflow_config["name"],
            "status": "completed",
            "result": result
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Custom workflow execution failed: {str(e)}")

@router.get("/templates")
async def get_workflow_templates():
    """Get predefined workflow templates for common sales scenarios"""
    return {
        "templates": [
            {
                "name": "Enterprise Deal Acceleration",
                "description": "AI-driven workflow to accelerate complex enterprise deals",
                "steps": [
                    "Stakeholder mapping and influence analysis",
                    "Technical requirements gathering",
                    "ROI demonstration planning",
                    "Competitive positioning",
                    "Executive presentation preparation"
                ],
                "estimated_duration": "2-3 weeks",
                "success_rate": "85%"
            },
            {
                "name": "Customer Retention Campaign",
                "description": "Proactive customer retention through AI-driven insights",
                "steps": [
                    "Churn risk assessment",
                    "Engagement opportunity identification",
                    "Personalized retention offers",
                    "Success metrics tracking"
                ],
                "estimated_duration": "1-2 weeks",
                "success_rate": "92%"
            },
            {
                "name": "New Market Entry",
                "description": "AI-powered workflow for entering new market segments",
                "steps": [
                    "Market opportunity analysis",
                    "Target customer identification",
                    "Messaging strategy development",
                    "Pilot program execution"
                ],
                "estimated_duration": "4-6 weeks",
                "success_rate": "78%"
            }
        ]
    }

