from fastapi import APIRouter, HTTPException, Depends, Query
from app.utils.cost_monitor import get_cost_monitor
from app.core.auth import get_current_user
from typing import Optional
from datetime import datetime, timedelta

router = APIRouter()

@router.get("/usage-summary")
async def get_usage_summary(
    days: int = Query(30, ge=1, le=365, description="Number of days to analyze"),
    current_user = Depends(get_current_user)
):
    """Get API usage and cost summary for the specified period"""
    try:
        summary = await get_cost_monitor().get_usage_summary(days=days, user_id=str(current_user.id))
        return {
            "status": "success",
            "data": summary,
            "generated_at": datetime.utcnow().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get usage summary: {str(e)}")

@router.get("/cost-alerts")
async def get_cost_alerts(
    monthly_budget: float = Query(200.0, ge=0, description="Monthly budget in USD"),
    current_user = Depends(get_current_user)
):
    """Check for cost and usage alerts"""
    try:
        alerts = await get_cost_monitor().check_usage_alerts(
            monthly_budget=monthly_budget, 
            user_id=str(current_user.id)
        )
        return {
            "status": "success",
            "data": alerts,
            "generated_at": datetime.utcnow().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get cost alerts: {str(e)}")

@router.get("/usage-trends")
async def get_usage_trends(
    days: int = Query(30, ge=7, le=90, description="Number of days for trend analysis"),
    current_user = Depends(get_current_user)
):
    """Get usage trends and patterns"""
    try:
        # Get usage data for trend analysis
        summary = await get_cost_monitor().get_usage_summary(days=days, user_id=str(current_user.id))
        
        if "error" in summary:
            raise HTTPException(status_code=500, detail=summary["error"])
        
        # Calculate trends
        daily_average_cost = summary["total_cost"] / days if days > 0 else 0
        weekly_projected_cost = daily_average_cost * 7
        monthly_projected_cost = summary["estimated_monthly_cost"]
        
        # Efficiency metrics
        cost_per_operation = summary["average_cost_per_operation"]
        tokens_per_operation = summary["total_tokens"] / summary["operations_count"] if summary["operations_count"] > 0 else 0
        
        trends = {
            "period_analyzed": days,
            "daily_metrics": {
                "average_cost": round(daily_average_cost, 4),
                "average_operations": round(summary["operations_count"] / days, 1),
                "average_tokens": round(summary["total_tokens"] / days, 0)
            },
            "projections": {
                "weekly_cost": round(weekly_projected_cost, 2),
                "monthly_cost": round(monthly_projected_cost, 2),
                "annual_cost": round(monthly_projected_cost * 12, 2)
            },
            "efficiency_metrics": {
                "cost_per_operation": round(cost_per_operation, 4),
                "tokens_per_operation": round(tokens_per_operation, 0),
                "cost_per_1k_tokens": round((summary["total_cost"] / summary["total_tokens"]) * 1000, 4) if summary["total_tokens"] > 0 else 0
            },
            "service_distribution": summary["service_breakdown"],
            "model_distribution": summary["model_breakdown"]
        }
        
        return {
            "status": "success",
            "data": trends,
            "generated_at": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get usage trends: {str(e)}")

@router.post("/log-usage")
async def log_api_usage(
    service: str,
    operation: str,
    tokens_used: int,
    model: str = "gpt-4",
    current_user = Depends(get_current_user)
):
    """Manually log API usage (for testing or external integrations)"""
    try:
        await get_cost_monitor().log_api_usage(
            service=service,
            operation=operation,
            tokens_used=tokens_used,
            model=model,
            user_id=str(current_user.id)
        )
        
        estimated_cost = get_cost_monitor().calculate_cost(tokens_used, model, "mixed")
        
        return {
            "status": "success",
            "message": "Usage logged successfully",
            "data": {
                "service": service,
                "operation": operation,
                "tokens_used": tokens_used,
                "model": model,
                "estimated_cost": round(estimated_cost, 4)
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to log usage: {str(e)}")

@router.get("/cost-optimization-tips")
async def get_cost_optimization_tips(
    current_user = Depends(get_current_user)
):
    """Get personalized cost optimization recommendations"""
    try:
        # Get recent usage data
        summary = await get_cost_monitor().get_usage_summary(days=30, user_id=str(current_user.id))
        
        tips = []
        
        # Analyze usage patterns and provide tips
        if summary["total_cost"] > 100:  # High usage
            tips.append({
                "category": "High Usage",
                "tip": "Consider implementing response caching for frequently asked questions",
                "potential_savings": "20-30%",
                "implementation": "Add Redis caching layer for AI responses"
            })
        
        # Check model usage
        if "model_breakdown" in summary:
            gpt4_usage = summary["model_breakdown"].get("gpt-4", {}).get("cost", 0)
            total_cost = summary["total_cost"]
            
            if gpt4_usage / total_cost > 0.8 if total_cost > 0 else False:
                tips.append({
                    "category": "Model Optimization",
                    "tip": "Consider using GPT-3.5-turbo for simpler tasks",
                    "potential_savings": "60-80%",
                    "implementation": "Route simple queries to GPT-3.5, complex ones to GPT-4"
                })
        
        # Check operation frequency
        if summary["operations_count"] > 500:
            tips.append({
                "category": "Workflow Optimization",
                "tip": "Batch similar operations to reduce API calls",
                "potential_savings": "15-25%",
                "implementation": "Group lead qualifications and process in batches"
            })
        
        # General tips
        tips.extend([
            {
                "category": "Prompt Optimization",
                "tip": "Optimize prompts to be more concise and specific",
                "potential_savings": "10-20%",
                "implementation": "Review and shorten system prompts, use structured outputs"
            },
            {
                "category": "Rate Limiting",
                "tip": "Implement intelligent rate limiting to avoid unnecessary calls",
                "potential_savings": "5-15%",
                "implementation": "Add cooldown periods for similar requests"
            },
            {
                "category": "Context Management",
                "tip": "Optimize context window usage to reduce token consumption",
                "potential_savings": "15-30%",
                "implementation": "Implement smart context truncation and summarization"
            }
        ])
        
        return {
            "status": "success",
            "data": {
                "current_monthly_cost": summary["estimated_monthly_cost"],
                "optimization_tips": tips,
                "potential_total_savings": "30-60%",
                "next_review_date": (datetime.utcnow().replace(day=1) + timedelta(days=32)).replace(day=1).isoformat()
            },
            "generated_at": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get optimization tips: {str(e)}")

@router.get("/health")
async def monitoring_health():
    """Health check for monitoring service"""
    return {
        "status": "healthy",
        "service": "cost_monitoring",
        "timestamp": datetime.utcnow().isoformat(),
        "features": [
            "usage_tracking",
            "cost_calculation",
            "budget_alerts",
            "optimization_tips"
        ]
    }