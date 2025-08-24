from datetime import datetime, timedelta
from typing import Dict, Any, Optional
import asyncio
import json
from app.core.config import settings
from app.core.database import get_supabase

class CostMonitor:
    """Monitor and track API usage costs for Eclipse platform"""
    
    def __init__(self):
        self.supabase = get_supabase()
        self.openai_pricing = {
            "gpt-4": {
                "input": 0.03,  # per 1K tokens
                "output": 0.06  # per 1K tokens
            },
            "gpt-3.5-turbo": {
                "input": 0.001,  # per 1K tokens
                "output": 0.002  # per 1K tokens
            }
        }
    
    async def log_api_usage(self, 
                           service: str, 
                           operation: str, 
                           tokens_used: int, 
                           model: str = "gpt-4",
                           user_id: Optional[str] = None):
        """Log API usage for cost tracking"""
        
        cost = self.calculate_cost(tokens_used, model, operation)
        
        usage_record = {
            "timestamp": datetime.utcnow().isoformat(),
            "service": service,
            "operation": operation,
            "model": model,
            "tokens_used": tokens_used,
            "estimated_cost": cost,
            "user_id": user_id
        }
        
        try:
            await self.supabase.table("api_usage_logs").insert(usage_record).execute()
        except Exception as e:
            print(f"Failed to log API usage: {e}")
    
    def calculate_cost(self, tokens: int, model: str, operation_type: str) -> float:
        """Calculate estimated cost for API usage"""
        
        if model not in self.openai_pricing:
            model = "gpt-4"  # Default to GPT-4 pricing
        
        # Assume 70% input tokens, 30% output tokens for mixed operations
        if operation_type in ["input", "prompt"]:
            cost_per_1k = self.openai_pricing[model]["input"]
        elif operation_type in ["output", "completion"]:
            cost_per_1k = self.openai_pricing[model]["output"]
        else:
            # Mixed operation - estimate based on typical usage
            input_tokens = int(tokens * 0.7)
            output_tokens = int(tokens * 0.3)
            input_cost = (input_tokens / 1000) * self.openai_pricing[model]["input"]
            output_cost = (output_tokens / 1000) * self.openai_pricing[model]["output"]
            return input_cost + output_cost
        
        return (tokens / 1000) * cost_per_1k
    
    async def get_usage_summary(self, 
                               days: int = 30, 
                               user_id: Optional[str] = None) -> Dict[str, Any]:
        """Get usage summary for the specified period"""
        
        start_date = (datetime.utcnow() - timedelta(days=days)).isoformat()
        
        try:
            query = self.supabase.table("api_usage_logs").select("*").gte("timestamp", start_date)
            
            if user_id:
                query = query.eq("user_id", user_id)
            
            result = await query.execute()
            
            if not result.data:
                return {
                    "total_cost": 0,
                    "total_tokens": 0,
                    "operations_count": 0,
                    "daily_breakdown": [],
                    "service_breakdown": {},
                    "model_breakdown": {}
                }
            
            # Calculate summary statistics
            total_cost = sum(record["estimated_cost"] for record in result.data)
            total_tokens = sum(record["tokens_used"] for record in result.data)
            operations_count = len(result.data)
            
            # Service breakdown
            service_breakdown = {}
            model_breakdown = {}
            
            for record in result.data:
                service = record["service"]
                model = record["model"]
                
                if service not in service_breakdown:
                    service_breakdown[service] = {"cost": 0, "tokens": 0, "count": 0}
                service_breakdown[service]["cost"] += record["estimated_cost"]
                service_breakdown[service]["tokens"] += record["tokens_used"]
                service_breakdown[service]["count"] += 1
                
                if model not in model_breakdown:
                    model_breakdown[model] = {"cost": 0, "tokens": 0, "count": 0}
                model_breakdown[model]["cost"] += record["estimated_cost"]
                model_breakdown[model]["tokens"] += record["tokens_used"]
                model_breakdown[model]["count"] += 1
            
            return {
                "period_days": days,
                "total_cost": round(total_cost, 4),
                "total_tokens": total_tokens,
                "operations_count": operations_count,
                "average_cost_per_operation": round(total_cost / operations_count, 4) if operations_count > 0 else 0,
                "service_breakdown": service_breakdown,
                "model_breakdown": model_breakdown,
                "estimated_monthly_cost": round((total_cost / days) * 30, 2) if days > 0 else 0
            }
            
        except Exception as e:
            print(f"Failed to get usage summary: {e}")
            return {"error": str(e)}
    
    async def check_usage_alerts(self, 
                                monthly_budget: float = 200.0,
                                user_id: Optional[str] = None) -> Dict[str, Any]:
        """Check if usage is approaching budget limits"""
        
        # Get current month usage
        current_month_start = datetime.utcnow().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        days_in_month = (datetime.utcnow() - current_month_start).days + 1
        
        summary = await self.get_usage_summary(days=days_in_month, user_id=user_id)
        
        if "error" in summary:
            return summary
        
        current_cost = summary["total_cost"]
        projected_monthly_cost = summary["estimated_monthly_cost"]
        
        alerts = []
        
        # Budget alerts
        if projected_monthly_cost > monthly_budget:
            alerts.append({
                "type": "budget_exceeded",
                "severity": "high",
                "message": f"Projected monthly cost (${projected_monthly_cost:.2f}) exceeds budget (${monthly_budget:.2f})",
                "recommendation": "Consider optimizing AI agent usage or increasing budget"
            })
        elif projected_monthly_cost > monthly_budget * 0.8:
            alerts.append({
                "type": "budget_warning",
                "severity": "medium",
                "message": f"Projected monthly cost (${projected_monthly_cost:.2f}) is approaching budget (${monthly_budget:.2f})",
                "recommendation": "Monitor usage closely and consider optimization"
            })
        
        # Usage pattern alerts
        if summary["operations_count"] > 1000:  # High usage
            alerts.append({
                "type": "high_usage",
                "severity": "low",
                "message": f"High API usage detected: {summary['operations_count']} operations this month",
                "recommendation": "Consider implementing caching or optimizing AI workflows"
            })
        
        return {
            "current_cost": current_cost,
            "projected_monthly_cost": projected_monthly_cost,
            "budget": monthly_budget,
            "budget_utilization": round((projected_monthly_cost / monthly_budget) * 100, 1),
            "alerts": alerts,
            "summary": summary
        }
    
    async def create_usage_tables(self):
        """Create database tables for usage tracking"""
        
        try:
            # Create API usage logs table
            await self.supabase.rpc('create_api_usage_table').execute()
            print("✅ API usage tracking tables created")
        except Exception as e:
            print(f"⚠️ Failed to create usage tables: {e}")
            print("Please create the table manually:")
            print("""
            CREATE TABLE IF NOT EXISTS api_usage_logs (
                id SERIAL PRIMARY KEY,
                timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                service VARCHAR(50) NOT NULL,
                operation VARCHAR(100) NOT NULL,
                model VARCHAR(50) NOT NULL DEFAULT 'gpt-4',
                tokens_used INTEGER NOT NULL,
                estimated_cost DECIMAL(10,6) NOT NULL,
                user_id UUID,
                created_at TIMESTAMPTZ DEFAULT NOW()
            );
            
            CREATE INDEX IF NOT EXISTS idx_api_usage_timestamp ON api_usage_logs(timestamp);
            CREATE INDEX IF NOT EXISTS idx_api_usage_user_id ON api_usage_logs(user_id);
            CREATE INDEX IF NOT EXISTS idx_api_usage_service ON api_usage_logs(service);
            """)

# Global cost monitor instance (lazy-loaded)
cost_monitor = None

def get_cost_monitor() -> CostMonitor:
    """Get the global cost monitor instance, creating it if needed"""
    global cost_monitor
    if cost_monitor is None:
        cost_monitor = CostMonitor()
    return cost_monitor

# Decorator for automatic cost tracking
def track_api_cost(service: str, operation: str, model: str = "gpt-4"):
    """Decorator to automatically track API costs"""
    def decorator(func):
        async def wrapper(*args, **kwargs):
            start_time = datetime.utcnow()
            result = await func(*args, **kwargs)
            
            # Estimate tokens used (this is a rough estimate)
            # In a real implementation, you'd get actual token usage from the API response
            estimated_tokens = 1000  # Default estimate
            
            # Try to extract actual token usage if available in result
            if isinstance(result, dict) and "usage" in result:
                estimated_tokens = result["usage"].get("total_tokens", estimated_tokens)
            
            await cost_monitor.log_api_usage(
                service=service,
                operation=operation,
                tokens_used=estimated_tokens,
                model=model
            )
            
            return result
        return wrapper
    return decorator

# Example usage:
# @track_api_cost("ai_engine", "lead_qualification", "gpt-4")
# async def qualify_lead(lead_data):
#     # Your AI operation here
#     pass