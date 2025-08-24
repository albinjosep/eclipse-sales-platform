from pydantic import BaseModel, Field
from typing import Optional, List
import os
from dotenv import load_dotenv
from .settings_manager import get_settings_manager, SettingsCategory

# Load environment variables from .env file
load_dotenv()

# Get the centralized settings manager
settings_manager = get_settings_manager()

class Settings(BaseModel):
    """Application settings using centralized settings manager."""
    
    @property
    def app_name(self) -> str:
        return settings_manager.get("app_name", "Eclipse")
    
    @property
    def app_version(self) -> str:
        return settings_manager.get("app_version", "1.0.0")
    
    @property
    def debug(self) -> bool:
        return settings_manager.get("debug", False)
    
    @property
    def secret_key(self) -> str:
        return settings_manager.get("secret_key")
    
    @property
    def jwt_secret_key(self) -> str:
        return settings_manager.get("jwt_secret_key")
    
    @property
    def jwt_algorithm(self) -> str:
        return settings_manager.get("jwt_algorithm", "HS256")
    
    @property
    def access_token_expire_minutes(self) -> int:
        return settings_manager.get("access_token_expire_minutes", 10080)
    
    @property
    def supabase_url(self) -> str:
        return settings_manager.get("supabase_url")
    
    @property
    def supabase_anon_key(self) -> str:
        return settings_manager.get("supabase_anon_key")
    
    @property
    def supabase_service_role_key(self) -> str:
        return settings_manager.get("supabase_service_role_key")
    
    @property
    def openai_api_key(self) -> str:
        return settings_manager.get("openai_api_key")
    
    @property
    def openai_model(self) -> str:
        return settings_manager.get("openai_model", "gpt-4")
    
    @property
    def database_url(self) -> Optional[str]:
        return settings_manager.get("database_url")
    
    @property
    def redis_url(self) -> str:
        return settings_manager.get("redis_url", "redis://localhost:6379")
    
    @property
    def temporal_host(self) -> str:
        return settings_manager.get("temporal_host", "localhost:7233")
    
    @property
    def cors_origins(self) -> List[str]:
        # Get from environment or use default
        origins_str = os.getenv("CORS_ORIGINS", "http://localhost:3000")
        return [origin.strip() for origin in origins_str.split(",")]
    
    @property
    def log_level(self) -> str:
        return settings_manager.get("log_level", "INFO")
    
    @property
    def enable_metrics(self) -> bool:
        return settings_manager.get("enable_metrics", True)
    
    @property
    def enable_ai_features(self) -> bool:
        return settings_manager.get("enable_ai_features", True)
    
    @property
    def enable_workflows(self) -> bool:
        return settings_manager.get("enable_workflows", True)
    
    def get_category_settings(self, category: SettingsCategory) -> dict:
        """Get all settings for a specific category."""
        return settings_manager.get_by_category(category)
    
    def validate_configuration(self) -> dict:
        """Validate entire configuration."""
        return settings_manager.validate_all()
    
    def is_production_ready(self) -> bool:
        """Check if configuration is ready for production."""
        return settings_manager.is_production_ready()

settings = Settings()
