"""Centralized settings management for Eclipse platform.

This module provides a comprehensive settings management system with:
- Environment-specific configurations
- Validation and type checking
- Runtime configuration updates
- Settings caching and performance optimization
"""

import os
import json
from typing import Dict, Any, Optional, List, Union
from dataclasses import dataclass, field
from enum import Enum
from pathlib import Path
import logging
from functools import lru_cache

try:
    from pydantic import BaseModel, Field, validator
except ImportError:
    BaseModel = object
    Field = lambda **kwargs: None
    validator = lambda *args, **kwargs: lambda f: f


class Environment(Enum):
    """Application environment types."""
    DEVELOPMENT = "development"
    STAGING = "staging"
    PRODUCTION = "production"
    TESTING = "testing"


class SettingsCategory(Enum):
    """Settings category types."""
    CORE = "core"
    DATABASE = "database"
    AI = "ai"
    SECURITY = "security"
    INTEGRATIONS = "integrations"
    MONITORING = "monitoring"
    FEATURES = "features"


@dataclass
class SettingDefinition:
    """Definition of a configuration setting."""
    key: str
    category: SettingsCategory
    description: str
    required: bool = True
    default_value: Any = None
    env_var: Optional[str] = None
    validation_pattern: Optional[str] = None
    sensitive: bool = False
    environment_specific: bool = False
    allowed_values: Optional[List[Any]] = None


class SettingsManager:
    """Centralized settings management system."""
    
    def __init__(self, environment: Optional[Environment] = None):
        self.environment = environment or self._detect_environment()
        self.logger = logging.getLogger(__name__)
        self._settings_cache: Dict[str, Any] = {}
        self._definitions = self._load_setting_definitions()
        self._load_settings()
    
    def _detect_environment(self) -> Environment:
        """Auto-detect current environment."""
        env_str = os.getenv("ENVIRONMENT", os.getenv("NODE_ENV", "development")).lower()
        try:
            return Environment(env_str)
        except ValueError:
            self.logger.warning(f"Unknown environment '{env_str}', defaulting to development")
            return Environment.DEVELOPMENT
    
    def _load_setting_definitions(self) -> Dict[str, SettingDefinition]:
        """Load setting definitions."""
        definitions = {
            # Core Application Settings
            "app_name": SettingDefinition(
                key="app_name",
                category=SettingsCategory.CORE,
                description="Application name",
                required=False,
                default_value="Eclipse",
                env_var="APP_NAME"
            ),
            "app_version": SettingDefinition(
                key="app_version",
                category=SettingsCategory.CORE,
                description="Application version",
                required=False,
                default_value="1.0.0",
                env_var="APP_VERSION"
            ),
            "debug": SettingDefinition(
                key="debug",
                category=SettingsCategory.CORE,
                description="Debug mode flag",
                required=False,
                default_value=False,
                env_var="DEBUG",
                environment_specific=True
            ),
            
            # Security Settings
            "secret_key": SettingDefinition(
                key="secret_key",
                category=SettingsCategory.SECURITY,
                description="Application secret key for security",
                required=True,
                env_var="SECRET_KEY",
                sensitive=True
            ),
            "jwt_secret_key": SettingDefinition(
                key="jwt_secret_key",
                category=SettingsCategory.SECURITY,
                description="JWT token signing key",
                required=True,
                env_var="JWT_SECRET_KEY",
                sensitive=True
            ),
            "jwt_algorithm": SettingDefinition(
                key="jwt_algorithm",
                category=SettingsCategory.SECURITY,
                description="JWT signing algorithm",
                required=False,
                default_value="HS256",
                env_var="JWT_ALGORITHM",
                allowed_values=["HS256", "HS384", "HS512", "RS256"]
            ),
            "access_token_expire_minutes": SettingDefinition(
                key="access_token_expire_minutes",
                category=SettingsCategory.SECURITY,
                description="Access token expiration time in minutes",
                required=False,
                default_value=10080,  # 7 days
                env_var="ACCESS_TOKEN_EXPIRE_MINUTES"
            ),
            
            # Database Settings
            "database_url": SettingDefinition(
                key="database_url",
                category=SettingsCategory.DATABASE,
                description="Database connection URL",
                required=True,
                env_var="DATABASE_URL",
                sensitive=True
            ),
            "supabase_url": SettingDefinition(
                key="supabase_url",
                category=SettingsCategory.DATABASE,
                description="Supabase project URL",
                required=True,
                env_var="SUPABASE_URL",
                validation_pattern=r"^https://[a-z0-9]+\.supabase\.co$"
            ),
            "supabase_anon_key": SettingDefinition(
                key="supabase_anon_key",
                category=SettingsCategory.DATABASE,
                description="Supabase anonymous key",
                required=True,
                env_var="SUPABASE_ANON_KEY",
                sensitive=True
            ),
            "supabase_service_role_key": SettingDefinition(
                key="supabase_service_role_key",
                category=SettingsCategory.DATABASE,
                description="Supabase service role key",
                required=True,
                env_var="SUPABASE_SERVICE_ROLE_KEY",
                sensitive=True
            ),
            
            # AI Settings
            "openai_api_key": SettingDefinition(
                key="openai_api_key",
                category=SettingsCategory.AI,
                description="OpenAI API key for AI features",
                required=True,
                env_var="OPENAI_API_KEY",
                sensitive=True,
                validation_pattern=r"^sk-[a-zA-Z0-9]{48}$"
            ),
            "openai_model": SettingDefinition(
                key="openai_model",
                category=SettingsCategory.AI,
                description="Default OpenAI model to use",
                required=False,
                default_value="gpt-4",
                env_var="OPENAI_MODEL",
                allowed_values=["gpt-3.5-turbo", "gpt-4", "gpt-4-turbo"]
            ),
            "ai_max_tokens": SettingDefinition(
                key="ai_max_tokens",
                category=SettingsCategory.AI,
                description="Maximum tokens for AI responses",
                required=False,
                default_value=2000,
                env_var="AI_MAX_TOKENS"
            ),
            
            # Integration Settings
            "redis_url": SettingDefinition(
                key="redis_url",
                category=SettingsCategory.INTEGRATIONS,
                description="Redis URL for caching",
                required=False,
                default_value="redis://localhost:6379",
                env_var="REDIS_URL"
            ),
            "temporal_host": SettingDefinition(
                key="temporal_host",
                category=SettingsCategory.INTEGRATIONS,
                description="Temporal workflow host",
                required=False,
                default_value="localhost:7233",
                env_var="TEMPORAL_HOST"
            ),
            
            # Email Settings
            "smtp_host": SettingDefinition(
                key="smtp_host",
                category=SettingsCategory.INTEGRATIONS,
                description="SMTP host for email sending",
                required=False,
                env_var="SMTP_HOST"
            ),
            "smtp_port": SettingDefinition(
                key="smtp_port",
                category=SettingsCategory.INTEGRATIONS,
                description="SMTP port",
                required=False,
                default_value=587,
                env_var="SMTP_PORT"
            ),
            "smtp_user": SettingDefinition(
                key="smtp_user",
                category=SettingsCategory.INTEGRATIONS,
                description="SMTP username",
                required=False,
                env_var="SMTP_USER",
                sensitive=True
            ),
            "smtp_password": SettingDefinition(
                key="smtp_password",
                category=SettingsCategory.INTEGRATIONS,
                description="SMTP password",
                required=False,
                env_var="SMTP_PASSWORD",
                sensitive=True
            ),
            
            # Monitoring Settings
            "log_level": SettingDefinition(
                key="log_level",
                category=SettingsCategory.MONITORING,
                description="Application log level",
                required=False,
                default_value="INFO",
                env_var="LOG_LEVEL",
                allowed_values=["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"]
            ),
            "enable_metrics": SettingDefinition(
                key="enable_metrics",
                category=SettingsCategory.MONITORING,
                description="Enable metrics collection",
                required=False,
                default_value=True,
                env_var="ENABLE_METRICS",
                environment_specific=True
            ),
            
            # Feature Flags
            "enable_ai_features": SettingDefinition(
                key="enable_ai_features",
                category=SettingsCategory.FEATURES,
                description="Enable AI-powered features",
                required=False,
                default_value=True,
                env_var="ENABLE_AI_FEATURES"
            ),
            "enable_workflows": SettingDefinition(
                key="enable_workflows",
                category=SettingsCategory.FEATURES,
                description="Enable workflow automation",
                required=False,
                default_value=True,
                env_var="ENABLE_WORKFLOWS"
            ),
        }
        
        return definitions
    
    def _load_settings(self):
        """Load settings from environment variables and defaults."""
        for key, definition in self._definitions.items():
            value = self._get_setting_value(definition)
            self._settings_cache[key] = value
    
    def _get_setting_value(self, definition: SettingDefinition) -> Any:
        """Get setting value from environment or default."""
        # Try to get from environment variable
        if definition.env_var:
            env_value = os.getenv(definition.env_var)
            if env_value is not None:
                return self._convert_value(env_value, definition)
        
        # Use default value if available
        if definition.default_value is not None:
            return definition.default_value
        
        # Return None for optional settings
        if not definition.required:
            return None
        
        # Raise error for required settings without value
        raise ValueError(f"Required setting '{definition.key}' is not configured")
    
    def _convert_value(self, value: str, definition: SettingDefinition) -> Any:
        """Convert string value to appropriate type."""
        # Boolean conversion
        if isinstance(definition.default_value, bool):
            return value.lower() in ("true", "1", "t", "yes", "on")
        
        # Integer conversion
        if isinstance(definition.default_value, int):
            try:
                return int(value)
            except ValueError:
                self.logger.warning(f"Invalid integer value for {definition.key}: {value}")
                return definition.default_value
        
        # Float conversion
        if isinstance(definition.default_value, float):
            try:
                return float(value)
            except ValueError:
                self.logger.warning(f"Invalid float value for {definition.key}: {value}")
                return definition.default_value
        
        # String value (default)
        return value
    
    @lru_cache(maxsize=128)
    def get(self, key: str, default: Any = None) -> Any:
        """Get setting value with caching."""
        return self._settings_cache.get(key, default)
    
    def get_by_category(self, category: SettingsCategory) -> Dict[str, Any]:
        """Get all settings for a specific category."""
        result = {}
        for key, definition in self._definitions.items():
            if definition.category == category:
                result[key] = self.get(key)
        return result
    
    def validate_all(self) -> List[Dict[str, Any]]:
        """Validate all settings and return validation results."""
        results = []
        
        for key, definition in self._definitions.items():
            result = self.validate_setting(key)
            results.append(result)
        
        return results
    
    def validate_setting(self, key: str) -> Dict[str, Any]:
        """Validate a specific setting."""
        if key not in self._definitions:
            return {
                "key": key,
                "valid": False,
                "message": f"Unknown setting: {key}"
            }
        
        definition = self._definitions[key]
        value = self.get(key)
        
        # Check if required setting is missing
        if definition.required and value is None:
            return {
                "key": key,
                "valid": False,
                "message": f"Required setting '{key}' is missing",
                "category": definition.category.value
            }
        
        # Skip validation for None optional values
        if value is None and not definition.required:
            return {
                "key": key,
                "valid": True,
                "message": f"Optional setting '{key}' not configured",
                "category": definition.category.value
            }
        
        # Validate against allowed values
        if definition.allowed_values and value not in definition.allowed_values:
            return {
                "key": key,
                "valid": False,
                "message": f"Invalid value for '{key}'. Allowed: {definition.allowed_values}",
                "category": definition.category.value
            }
        
        # Validate against pattern
        if definition.validation_pattern and isinstance(value, str):
            import re
            if not re.match(definition.validation_pattern, value):
                return {
                    "key": key,
                    "valid": False,
                    "message": f"Invalid format for '{key}'",
                    "category": definition.category.value
                }
        
        return {
            "key": key,
            "valid": True,
            "message": f"Setting '{key}' is valid",
            "category": definition.category.value
        }
    
    def get_environment_template(self) -> str:
        """Generate environment file template."""
        template_lines = []
        template_lines.append(f"# Eclipse Platform Configuration - {self.environment.value.title()}")
        template_lines.append("# Generated environment template\n")
        
        # Group by category
        by_category = {}
        for key, definition in self._definitions.items():
            category = definition.category.value
            if category not in by_category:
                by_category[category] = []
            by_category[category].append((key, definition))
        
        for category, settings in by_category.items():
            template_lines.append(f"# {category.title()} Settings")
            
            for key, definition in settings:
                # Add description as comment
                template_lines.append(f"# {definition.description}")
                
                # Add required/optional indicator
                status = "Required" if definition.required else "Optional"
                template_lines.append(f"# {status}")
                
                # Add environment variable with example or default
                if definition.env_var:
                    if definition.sensitive:
                        example_value = "your_secret_here"
                    elif definition.default_value is not None:
                        example_value = str(definition.default_value)
                    else:
                        example_value = "your_value_here"
                    
                    template_lines.append(f"{definition.env_var}={example_value}")
                
                template_lines.append("")  # Empty line
        
        return "\n".join(template_lines)
    
    def export_config(self, include_sensitive: bool = False) -> Dict[str, Any]:
        """Export current configuration."""
        config = {}
        
        for key, definition in self._definitions.items():
            if definition.sensitive and not include_sensitive:
                config[key] = "[REDACTED]"
            else:
                config[key] = self.get(key)
        
        return {
            "environment": self.environment.value,
            "settings": config,
            "metadata": {
                "total_settings": len(self._definitions),
                "required_settings": sum(1 for d in self._definitions.values() if d.required),
                "optional_settings": sum(1 for d in self._definitions.values() if not d.required)
            }
        }
    
    def get_missing_required(self) -> List[str]:
        """Get list of missing required settings."""
        missing = []
        
        for key, definition in self._definitions.items():
            if definition.required and self.get(key) is None:
                missing.append(key)
        
        return missing
    
    def is_production_ready(self) -> bool:
        """Check if configuration is ready for production."""
        missing_required = self.get_missing_required()
        return len(missing_required) == 0


# Global settings manager instance
_settings_manager: Optional[SettingsManager] = None


def get_settings_manager() -> SettingsManager:
    """Get global settings manager instance."""
    global _settings_manager
    if _settings_manager is None:
        _settings_manager = SettingsManager()
    return _settings_manager


def get_setting(key: str, default: Any = None) -> Any:
    """Convenience function to get a setting value."""
    return get_settings_manager().get(key, default)


def validate_configuration() -> Dict[str, Any]:
    """Validate entire configuration and return summary."""
    manager = get_settings_manager()
    results = manager.validate_all()
    
    valid_count = sum(1 for r in results if r["valid"])
    invalid_count = len(results) - valid_count
    missing_required = manager.get_missing_required()
    
    return {
        "valid": len(missing_required) == 0,
        "summary": {
            "total_settings": len(results),
            "valid_settings": valid_count,
            "invalid_settings": invalid_count,
            "missing_required": len(missing_required)
        },
        "results": results,
        "missing_required": missing_required,
        "production_ready": manager.is_production_ready()
    }


if __name__ == "__main__":
    # CLI usage for generating templates and validation
    import sys
    
    if len(sys.argv) > 1:
        command = sys.argv[1]
        manager = get_settings_manager()
        
        if command == "template":
            print(manager.get_environment_template())
        elif command == "validate":
            result = validate_configuration()
            print(json.dumps(result, indent=2))
        elif command == "export":
            config = manager.export_config()
            print(json.dumps(config, indent=2))
        else:
            print(f"Unknown command: {command}")
            print("Available commands: template, validate, export")
    else:
        print("Settings Manager CLI")
        print("Commands: template, validate, export")
