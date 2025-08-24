"""Setup validation API endpoints.

Provides endpoints for validating platform setup and configuration.
"""

from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any
import asyncio
from datetime import datetime

from app.utils.setup_validator import validate_platform_setup, SetupValidator
from app.core.auth import get_current_user
from app.core.database import get_supabase

router = APIRouter(prefix="/setup", tags=["setup"])


@router.get("/health")
async def health_check() -> Dict[str, Any]:
    """Basic health check endpoint."""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "service": "Eclipse Setup Validation"
    }


@router.get("/validate")
async def validate_setup() -> Dict[str, Any]:
    """Validate complete platform setup.
    
    Returns comprehensive validation results including:
    - Environment variables
    - API connections (OpenAI, Supabase)
    - File structure
    - Database connectivity
    - Optional services (Redis)
    """
    try:
        validation_result = await validate_platform_setup()
        return {
            "success": True,
            "data": validation_result,
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Setup validation failed: {str(e)}"
        )


@router.get("/validate/quick")
async def quick_validation() -> Dict[str, Any]:
    """Quick validation check for essential components only.
    
    Returns basic validation status for critical components:
    - Environment variables
    - API keys format
    - Required files
    """
    try:
        validator = SetupValidator()
        
        # Run only essential validations
        env_results = validator.validate_environment_variables()
        file_results = validator.validate_file_structure()
        
        all_results = env_results + file_results
        
        # Count issues
        required_issues = sum(1 for r in all_results 
                            if r.required and r.status.value in ['invalid', 'missing'])
        
        setup_ready = required_issues == 0
        
        return {
            "success": True,
            "data": {
                "setup_ready": setup_ready,
                "required_issues": required_issues,
                "total_checks": len(all_results),
                "summary": {
                    "environment_variables": len(env_results),
                    "file_structure": len(file_results)
                }
            },
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Quick validation failed: {str(e)}"
        )


@router.get("/validate/environment")
async def validate_environment() -> Dict[str, Any]:
    """Validate environment variables only."""
    try:
        validator = SetupValidator()
        env_results = validator.validate_environment_variables()
        
        return {
            "success": True,
            "data": {
                "results": [
                    {
                        "component": r.component,
                        "status": r.status.value,
                        "message": r.message,
                        "required": r.required,
                        "details": r.details
                    }
                    for r in env_results
                ]
            },
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Environment validation failed: {str(e)}"
        )


@router.get("/validate/apis")
async def validate_apis() -> Dict[str, Any]:
    """Validate external API connections."""
    try:
        validator = SetupValidator()
        
        # Run API validations
        openai_result = await validator.validate_openai_connection()
        supabase_result = await validator.validate_supabase_connection()
        redis_result = await validator.validate_redis_connection()
        
        api_results = [openai_result, supabase_result, redis_result]
        
        return {
            "success": True,
            "data": {
                "results": [
                    {
                        "component": r.component,
                        "status": r.status.value,
                        "message": r.message,
                        "required": r.required,
                        "details": r.details
                    }
                    for r in api_results
                ]
            },
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"API validation failed: {str(e)}"
        )


@router.post("/validate/api-key")
async def validate_api_key(request: Dict[str, str]) -> Dict[str, Any]:
    """Validate a specific API key without storing it.
    
    Request body:
    {
        "service": "openai" | "supabase",
        "api_key": "your-api-key",
        "additional_params": {}
    }
    """
    try:
        service = request.get("service")
        api_key = request.get("api_key")
        additional_params = request.get("additional_params", {})
        
        if not service or not api_key:
            raise HTTPException(
                status_code=400,
                detail="Service and api_key are required"
            )
        
        if service == "openai":
            # Validate OpenAI key format
            if not api_key.startswith("sk-"):
                return {
                    "success": False,
                    "valid": False,
                    "message": "Invalid OpenAI API key format (should start with 'sk-')"
                }
            
            # Test the key (in production, you might want to make a minimal API call)
            return {
                "success": True,
                "valid": True,
                "message": "OpenAI API key format is valid",
                "details": {
                    "format_valid": True,
                    "length": len(api_key)
                }
            }
        
        elif service == "supabase":
            supabase_url = additional_params.get("url")
            if not supabase_url:
                raise HTTPException(
                    status_code=400,
                    detail="Supabase URL is required in additional_params"
                )
            
            # Validate Supabase key format and URL
            url_valid = "supabase.co" in supabase_url or "localhost" in supabase_url
            key_valid = len(api_key) > 20  # Basic length check
            
            return {
                "success": True,
                "valid": url_valid and key_valid,
                "message": "Supabase configuration validated",
                "details": {
                    "url_valid": url_valid,
                    "key_format_valid": key_valid,
                    "url": supabase_url
                }
            }
        
        else:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported service: {service}"
            )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"API key validation failed: {str(e)}"
        )


@router.get("/requirements")
async def get_setup_requirements() -> Dict[str, Any]:
    """Get setup requirements and recommendations."""
    return {
        "success": True,
        "data": {
            "required_environment_variables": [
                {
                    "name": "SECRET_KEY",
                    "description": "Application secret key for security",
                    "example": "your-secret-key-here",
                    "required": True
                },
                {
                    "name": "JWT_SECRET_KEY",
                    "description": "JWT token signing key",
                    "example": "your-jwt-secret-here",
                    "required": True
                },
                {
                    "name": "OPENAI_API_KEY",
                    "description": "OpenAI API key for AI features",
                    "example": "sk-...",
                    "required": True,
                    "get_url": "https://platform.openai.com/api-keys"
                },
                {
                    "name": "SUPABASE_URL",
                    "description": "Supabase project URL",
                    "example": "https://your-project-id.supabase.co",
                    "required": True,
                    "get_url": "https://supabase.com"
                },
                {
                    "name": "SUPABASE_ANON_KEY",
                    "description": "Supabase anonymous key",
                    "example": "eyJ...",
                    "required": True
                },
                {
                    "name": "SUPABASE_SERVICE_ROLE_KEY",
                    "description": "Supabase service role key",
                    "example": "eyJ...",
                    "required": True
                },
                {
                    "name": "DATABASE_URL",
                    "description": "Database connection URL",
                    "example": "postgresql://user:pass@host:port/db",
                    "required": True
                }
            ],
            "optional_environment_variables": [
                {
                    "name": "REDIS_URL",
                    "description": "Redis URL for caching",
                    "example": "redis://localhost:6379",
                    "required": False
                },
                {
                    "name": "SMTP_HOST",
                    "description": "Email SMTP host",
                    "example": "smtp.gmail.com",
                    "required": False
                }
            ],
            "cost_estimates": {
                "openai": {
                    "typical_monthly": "$50-200",
                    "description": "Based on typical sales team usage",
                    "factors": ["Number of leads", "AI agent interactions", "Email analysis"]
                },
                "supabase": {
                    "free_tier": "500MB database, 2GB bandwidth",
                    "pro_tier": "$25/month for 8GB database",
                    "description": "Scales with data and usage"
                }
            },
            "setup_steps": [
                "Create OpenAI account and generate API key",
                "Create Supabase project and get credentials",
                "Configure environment variables",
                "Run database migrations",
                "Test API connections",
                "Configure optional integrations"
            ]
        },
        "timestamp": datetime.utcnow().isoformat()
    }


@router.get("/status")
async def get_setup_status() -> Dict[str, Any]:
    """Get current setup status summary."""
    try:
        # Run quick validation
        validator = SetupValidator()
        env_results = validator.validate_environment_variables()
        
        # Count configured vs missing
        required_vars = [r for r in env_results if r.required]
        configured_required = sum(1 for r in required_vars if r.status.value == 'valid')
        total_required = len(required_vars)
        
        optional_vars = [r for r in env_results if not r.required]
        configured_optional = sum(1 for r in optional_vars if r.status.value == 'valid')
        total_optional = len(optional_vars)
        
        setup_percentage = (configured_required / total_required * 100) if total_required > 0 else 0
        
        return {
            "success": True,
            "data": {
                "setup_complete": configured_required == total_required,
                "setup_percentage": round(setup_percentage, 1),
                "required_configured": configured_required,
                "required_total": total_required,
                "optional_configured": configured_optional,
                "optional_total": total_optional,
                "next_steps": [
                    "Configure missing environment variables",
                    "Test API connections",
                    "Run database setup",
                    "Configure integrations"
                ] if configured_required < total_required else [
                    "Your setup is complete!",
                    "Consider configuring optional services",
                    "Test the platform with sample data"
                ]
            },
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Status check failed: {str(e)}"
        )