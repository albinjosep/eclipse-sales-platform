"""Configuration management API endpoints.

Provides endpoints for managing application configuration,
validating settings, and generating environment templates.
"""

from fastapi import APIRouter, HTTPException, Depends, Query
from typing import Dict, Any, Optional, List
from datetime import datetime
import json

from app.core.settings_manager import (
    get_settings_manager, 
    validate_configuration,
    SettingsCategory,
    Environment
)
from app.core.auth import get_current_user
from app.core.config import settings

router = APIRouter(prefix="/config", tags=["configuration"])


@router.get("/health")
async def config_health_check() -> Dict[str, Any]:
    """Configuration service health check."""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "service": "Eclipse Configuration Management"
    }


@router.get("/validate")
async def validate_config() -> Dict[str, Any]:
    """Validate complete application configuration.
    
    Returns comprehensive validation results including:
    - All setting validations
    - Missing required settings
    - Production readiness status
    - Category-wise breakdown
    """
    try:
        validation_result = validate_configuration()
        
        return {
            "success": True,
            "data": validation_result,
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Configuration validation failed: {str(e)}"
        )


@router.get("/validate/category/{category}")
async def validate_category(
    category: str
) -> Dict[str, Any]:
    """Validate settings for a specific category."""
    try:
        # Validate category
        try:
            settings_category = SettingsCategory(category.lower())
        except ValueError:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid category: {category}. Valid categories: {[c.value for c in SettingsCategory]}"
            )
        
        manager = get_settings_manager()
        category_settings = manager.get_by_category(settings_category)
        
        # Validate each setting in the category
        validation_results = []
        for key in category_settings.keys():
            result = manager.validate_setting(key)
            validation_results.append(result)
        
        valid_count = sum(1 for r in validation_results if r["valid"])
        
        return {
            "success": True,
            "data": {
                "category": category,
                "total_settings": len(validation_results),
                "valid_settings": valid_count,
                "invalid_settings": len(validation_results) - valid_count,
                "results": validation_results
            },
            "timestamp": datetime.utcnow().isoformat()
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Category validation failed: {str(e)}"
        )


@router.get("/settings")
async def get_settings(
    category: Optional[str] = Query(None, description="Filter by category"),
    include_sensitive: bool = Query(False, description="Include sensitive values (admin only)")
) -> Dict[str, Any]:
    """Get application settings.
    
    Args:
        category: Optional category filter
        include_sensitive: Whether to include sensitive values (requires admin)
    """
    try:
        manager = get_settings_manager()
        
        if category:
            try:
                settings_category = SettingsCategory(category.lower())
                settings_data = manager.get_by_category(settings_category)
            except ValueError:
                raise HTTPException(
                    status_code=400,
                    detail=f"Invalid category: {category}"
                )
        else:
            # Export all configuration
            config_export = manager.export_config(include_sensitive=include_sensitive)
            settings_data = config_export["settings"]
        
        return {
            "success": True,
            "data": {
                "settings": settings_data,
                "environment": manager.environment.value,
                "category_filter": category,
                "sensitive_included": include_sensitive
            },
            "timestamp": datetime.utcnow().isoformat()
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get settings: {str(e)}"
        )


@router.get("/template")
async def get_environment_template(
    environment: Optional[str] = Query(None, description="Target environment")
) -> Dict[str, Any]:
    """Generate environment file template.
    
    Args:
        environment: Target environment (development, staging, production)
    """
    try:
        # Create settings manager for specific environment if provided
        if environment:
            try:
                env = Environment(environment.lower())
                from app.core.settings_manager import SettingsManager
                manager = SettingsManager(env)
            except ValueError:
                raise HTTPException(
                    status_code=400,
                    detail=f"Invalid environment: {environment}. Valid: {[e.value for e in Environment]}"
                )
        else:
            manager = get_settings_manager()
        
        template_content = manager.get_environment_template()
        
        return {
            "success": True,
            "data": {
                "template": template_content,
                "environment": manager.environment.value,
                "filename": f".env.{manager.environment.value}" if environment else ".env"
            },
            "timestamp": datetime.utcnow().isoformat()
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate template: {str(e)}"
        )


@router.get("/status")
async def get_config_status() -> Dict[str, Any]:
    """Get configuration status summary."""
    try:
        manager = get_settings_manager()
        validation_result = validate_configuration()
        missing_required = manager.get_missing_required()
        
        # Calculate readiness percentage
        total_required = sum(1 for d in manager._definitions.values() if d.required)
        configured_required = total_required - len(missing_required)
        readiness_percentage = (configured_required / total_required * 100) if total_required > 0 else 0
        
        return {
            "success": True,
            "data": {
                "environment": manager.environment.value,
                "production_ready": manager.is_production_ready(),
                "readiness_percentage": round(readiness_percentage, 1),
                "summary": validation_result["summary"],
                "missing_required": missing_required,
                "categories": {
                    category.value: {
                        "settings_count": len(manager.get_by_category(category)),
                        "description": _get_category_description(category)
                    }
                    for category in SettingsCategory
                },
                "next_steps": _get_next_steps(missing_required, manager.environment)
            },
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get configuration status: {str(e)}"
        )


@router.get("/categories")
async def get_categories() -> Dict[str, Any]:
    """Get available configuration categories."""
    try:
        manager = get_settings_manager()
        
        categories_info = {}
        for category in SettingsCategory:
            category_settings = manager.get_by_category(category)
            categories_info[category.value] = {
                "name": category.value.title(),
                "description": _get_category_description(category),
                "settings_count": len(category_settings),
                "required_count": sum(
                    1 for key in category_settings.keys() 
                    if manager._definitions[key].required
                )
            }
        
        return {
            "success": True,
            "data": {
                "categories": categories_info,
                "total_categories": len(SettingsCategory)
            },
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get categories: {str(e)}"
        )


@router.get("/environments")
async def get_environments() -> Dict[str, Any]:
    """Get available environments and their characteristics."""
    try:
        current_manager = get_settings_manager()
        
        environments_info = {}
        for env in Environment:
            environments_info[env.value] = {
                "name": env.value.title(),
                "description": _get_environment_description(env),
                "current": env == current_manager.environment,
                "recommended_settings": _get_environment_recommendations(env)
            }
        
        return {
            "success": True,
            "data": {
                "environments": environments_info,
                "current_environment": current_manager.environment.value,
                "total_environments": len(Environment)
            },
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get environments: {str(e)}"
        )


def _get_category_description(category: SettingsCategory) -> str:
    """Get description for a settings category."""
    descriptions = {
        SettingsCategory.CORE: "Essential application settings like name, version, and debug mode",
        SettingsCategory.DATABASE: "Database connection and Supabase configuration",
        SettingsCategory.AI: "AI service configuration including OpenAI settings",
        SettingsCategory.SECURITY: "Security-related settings like secret keys and JWT configuration",
        SettingsCategory.INTEGRATIONS: "Third-party service integrations like Redis, email, and workflows",
        SettingsCategory.MONITORING: "Logging, metrics, and observability settings",
        SettingsCategory.FEATURES: "Feature flags and optional functionality toggles"
    }
    return descriptions.get(category, "Configuration settings")


def _get_environment_description(environment: Environment) -> str:
    """Get description for an environment."""
    descriptions = {
        Environment.DEVELOPMENT: "Local development environment with debug features enabled",
        Environment.STAGING: "Pre-production environment for testing and validation",
        Environment.PRODUCTION: "Live production environment with optimized settings",
        Environment.TESTING: "Automated testing environment with test-specific configurations"
    }
    return descriptions.get(environment, "Application environment")


def _get_environment_recommendations(environment: Environment) -> List[str]:
    """Get recommendations for an environment."""
    recommendations = {
        Environment.DEVELOPMENT: [
            "Enable debug mode for detailed error messages",
            "Use local database for development",
            "Enable all logging levels",
            "Use development API keys"
        ],
        Environment.STAGING: [
            "Disable debug mode",
            "Use staging database",
            "Enable metrics collection",
            "Test with production-like data"
        ],
        Environment.PRODUCTION: [
            "Disable debug mode",
            "Use strong secret keys",
            "Enable monitoring and alerting",
            "Optimize for performance",
            "Enable security headers"
        ],
        Environment.TESTING: [
            "Use test database",
            "Mock external services",
            "Enable detailed logging",
            "Use test API keys"
        ]
    }
    return recommendations.get(environment, [])


def _get_next_steps(missing_required: List[str], environment: Environment) -> List[str]:
    """Get next steps based on missing configuration."""
    if not missing_required:
        return [
            "Configuration is complete!",
            "Consider reviewing optional settings",
            "Test the application functionality",
            "Monitor application performance"
        ]
    
    steps = []
    
    # Prioritize critical settings
    critical_settings = ["secret_key", "jwt_secret_key", "openai_api_key"]
    missing_critical = [s for s in missing_required if s in critical_settings]
    
    if missing_critical:
        steps.append(f"Configure critical settings: {', '.join(missing_critical)}")
    
    # Database settings
    db_settings = ["supabase_url", "supabase_anon_key", "supabase_service_role_key", "database_url"]
    missing_db = [s for s in missing_required if s in db_settings]
    
    if missing_db:
        steps.append(f"Configure database settings: {', '.join(missing_db)}")
    
    # Environment-specific recommendations
    if environment == Environment.PRODUCTION:
        steps.append("Ensure all secret keys are strong and unique")
        steps.append("Enable monitoring and logging")
    elif environment == Environment.DEVELOPMENT:
        steps.append("Set up local development environment")
        steps.append("Configure debug settings")
    
    steps.append("Run configuration validation after updates")
    steps.append("Test application functionality")
    
    return steps