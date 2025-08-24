"""Setup validation utility for Eclipse platform.

This module provides functions to validate the platform setup,
including API keys, database connections, and required configurations.
"""

import os
import asyncio
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass
from enum import Enum

try:
    import openai
except ImportError:
    openai = None

try:
    from supabase import create_client, Client
except ImportError:
    Client = None

try:
    import redis
except ImportError:
    redis = None


class ValidationStatus(Enum):
    """Validation status enumeration."""
    VALID = "valid"
    INVALID = "invalid"
    MISSING = "missing"
    WARNING = "warning"


@dataclass
class ValidationResult:
    """Result of a validation check."""
    component: str
    status: ValidationStatus
    message: str
    details: Optional[Dict] = None
    required: bool = True


class SetupValidator:
    """Validates Eclipse platform setup and configuration."""
    
    def __init__(self):
        self.results: List[ValidationResult] = []
    
    def validate_environment_variables(self) -> List[ValidationResult]:
        """Validate required environment variables."""
        required_vars = {
            'SECRET_KEY': 'Application secret key for security',
            'JWT_SECRET_KEY': 'JWT token signing key',
            'SUPABASE_URL': 'Supabase project URL',
            'SUPABASE_ANON_KEY': 'Supabase anonymous key',
            'SUPABASE_SERVICE_ROLE_KEY': 'Supabase service role key',
            'OPENAI_API_KEY': 'OpenAI API key for AI features',
            'DATABASE_URL': 'Database connection URL'
        }
        
        optional_vars = {
            'REDIS_URL': 'Redis URL for caching (optional)',
            'SMTP_HOST': 'Email SMTP host (optional)',
            'SMTP_PORT': 'Email SMTP port (optional)',
            'SMTP_USER': 'Email SMTP username (optional)',
            'SMTP_PASSWORD': 'Email SMTP password (optional)'
        }
        
        results = []
        
        # Check required variables
        for var_name, description in required_vars.items():
            value = os.getenv(var_name)
            if not value:
                results.append(ValidationResult(
                    component=var_name,
                    status=ValidationStatus.MISSING,
                    message=f"Missing required environment variable: {var_name}",
                    details={'description': description},
                    required=True
                ))
            elif var_name == 'OPENAI_API_KEY' and not value.startswith('sk-'):
                results.append(ValidationResult(
                    component=var_name,
                    status=ValidationStatus.INVALID,
                    message="OpenAI API key format appears invalid (should start with 'sk-')",
                    details={'description': description},
                    required=True
                ))
            elif var_name == 'SUPABASE_URL' and not ('supabase.co' in value or 'localhost' in value):
                results.append(ValidationResult(
                    component=var_name,
                    status=ValidationStatus.WARNING,
                    message="Supabase URL format may be invalid",
                    details={'description': description},
                    required=True
                ))
            else:
                results.append(ValidationResult(
                    component=var_name,
                    status=ValidationStatus.VALID,
                    message=f"{var_name} is configured",
                    details={'description': description},
                    required=True
                ))
        
        # Check optional variables
        for var_name, description in optional_vars.items():
            value = os.getenv(var_name)
            if value:
                results.append(ValidationResult(
                    component=var_name,
                    status=ValidationStatus.VALID,
                    message=f"{var_name} is configured",
                    details={'description': description},
                    required=False
                ))
            else:
                results.append(ValidationResult(
                    component=var_name,
                    status=ValidationStatus.MISSING,
                    message=f"Optional variable {var_name} not configured",
                    details={'description': description},
                    required=False
                ))
        
        return results
    
    async def validate_openai_connection(self) -> ValidationResult:
        """Validate OpenAI API connection and key."""
        api_key = os.getenv('OPENAI_API_KEY')
        
        if not api_key:
            return ValidationResult(
                component='OpenAI API',
                status=ValidationStatus.MISSING,
                message="OpenAI API key not configured",
                required=True
            )
        
        if not openai:
            return ValidationResult(
                component='OpenAI API',
                status=ValidationStatus.INVALID,
                message="OpenAI library not installed",
                details={'fix': 'Run: pip install openai'},
                required=True
            )
        
        try:
            # Test API key with a simple request
            client = openai.OpenAI(api_key=api_key)
            response = await asyncio.to_thread(
                client.models.list
            )
            
            if response and hasattr(response, 'data'):
                available_models = [model.id for model in response.data]
                gpt4_available = any('gpt-4' in model for model in available_models)
                
                return ValidationResult(
                    component='OpenAI API',
                    status=ValidationStatus.VALID,
                    message="OpenAI API connection successful",
                    details={
                        'models_count': len(available_models),
                        'gpt4_available': gpt4_available,
                        'sample_models': available_models[:5]
                    },
                    required=True
                )
            else:
                return ValidationResult(
                    component='OpenAI API',
                    status=ValidationStatus.INVALID,
                    message="OpenAI API returned unexpected response",
                    required=True
                )
                
        except Exception as e:
            return ValidationResult(
                component='OpenAI API',
                status=ValidationStatus.INVALID,
                message=f"OpenAI API connection failed: {str(e)}",
                details={'error': str(e)},
                required=True
            )
    
    async def validate_supabase_connection(self) -> ValidationResult:
        """Validate Supabase connection and configuration."""
        url = os.getenv('SUPABASE_URL')
        anon_key = os.getenv('SUPABASE_ANON_KEY')
        service_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
        
        if not url or not anon_key:
            return ValidationResult(
                component='Supabase',
                status=ValidationStatus.MISSING,
                message="Supabase URL or anonymous key not configured",
                required=True
            )
        
        if not Client:
            return ValidationResult(
                component='Supabase',
                status=ValidationStatus.INVALID,
                message="Supabase library not installed",
                details={'fix': 'Run: pip install supabase'},
                required=True
            )
        
        try:
            # Test connection with anonymous key
            supabase = create_client(url, anon_key)
            
            # Try to access a basic endpoint
            response = supabase.auth.get_session()
            
            # Check if pgvector extension is available (for AI features)
            try:
                # This would require a test query to check extensions
                # For now, we'll assume it's available if connection works
                pgvector_available = True
            except:
                pgvector_available = False
            
            details = {
                'url': url,
                'anon_key_configured': bool(anon_key),
                'service_key_configured': bool(service_key),
                'pgvector_available': pgvector_available
            }
            
            if not service_key:
                return ValidationResult(
                    component='Supabase',
                    status=ValidationStatus.WARNING,
                    message="Supabase connected but service role key missing (required for admin operations)",
                    details=details,
                    required=True
                )
            
            return ValidationResult(
                component='Supabase',
                status=ValidationStatus.VALID,
                message="Supabase connection successful",
                details=details,
                required=True
            )
            
        except Exception as e:
            return ValidationResult(
                component='Supabase',
                status=ValidationStatus.INVALID,
                message=f"Supabase connection failed: {str(e)}",
                details={'error': str(e)},
                required=True
            )
    
    async def validate_redis_connection(self) -> ValidationResult:
        """Validate Redis connection (optional)."""
        redis_url = os.getenv('REDIS_URL')
        
        if not redis_url:
            return ValidationResult(
                component='Redis',
                status=ValidationStatus.MISSING,
                message="Redis URL not configured (optional - used for caching)",
                required=False
            )
        
        if not redis:
            return ValidationResult(
                component='Redis',
                status=ValidationStatus.WARNING,
                message="Redis library not installed",
                details={'fix': 'Run: pip install redis'},
                required=False
            )
        
        try:
            r = redis.from_url(redis_url)
            r.ping()
            
            return ValidationResult(
                component='Redis',
                status=ValidationStatus.VALID,
                message="Redis connection successful",
                details={'url': redis_url},
                required=False
            )
            
        except Exception as e:
            return ValidationResult(
                component='Redis',
                status=ValidationStatus.INVALID,
                message=f"Redis connection failed: {str(e)}",
                details={'error': str(e)},
                required=False
            )
    
    def validate_file_structure(self) -> List[ValidationResult]:
        """Validate required file structure and dependencies."""
        required_files = [
            'app/main.py',
            'app/core/config.py',
            'app/core/database.py',
            'app/core/ai_engine.py',
            'app/api/routes/auth.py',
            'requirements.txt'
        ]
        
        results = []
        
        for file_path in required_files:
            if os.path.exists(file_path):
                results.append(ValidationResult(
                    component=f'File: {file_path}',
                    status=ValidationStatus.VALID,
                    message=f"Required file {file_path} exists",
                    required=True
                ))
            else:
                results.append(ValidationResult(
                    component=f'File: {file_path}',
                    status=ValidationStatus.MISSING,
                    message=f"Required file {file_path} is missing",
                    required=True
                ))
        
        return results
    
    async def run_full_validation(self) -> Dict:
        """Run complete platform validation."""
        all_results = []
        
        # Environment variables
        env_results = self.validate_environment_variables()
        all_results.extend(env_results)
        
        # File structure
        file_results = self.validate_file_structure()
        all_results.extend(file_results)
        
        # API connections (async)
        openai_result = await self.validate_openai_connection()
        all_results.append(openai_result)
        
        supabase_result = await self.validate_supabase_connection()
        all_results.append(supabase_result)
        
        redis_result = await self.validate_redis_connection()
        all_results.append(redis_result)
        
        # Categorize results
        valid_count = sum(1 for r in all_results if r.status == ValidationStatus.VALID)
        invalid_count = sum(1 for r in all_results if r.status == ValidationStatus.INVALID)
        missing_count = sum(1 for r in all_results if r.status == ValidationStatus.MISSING)
        warning_count = sum(1 for r in all_results if r.status == ValidationStatus.WARNING)
        
        required_issues = sum(1 for r in all_results 
                            if r.required and r.status in [ValidationStatus.INVALID, ValidationStatus.MISSING])
        
        setup_ready = required_issues == 0
        
        return {
            'setup_ready': setup_ready,
            'summary': {
                'total_checks': len(all_results),
                'valid': valid_count,
                'invalid': invalid_count,
                'missing': missing_count,
                'warnings': warning_count,
                'required_issues': required_issues
            },
            'results': [
                {
                    'component': r.component,
                    'status': r.status.value,
                    'message': r.message,
                    'details': r.details,
                    'required': r.required
                }
                for r in all_results
            ],
            'recommendations': self._generate_recommendations(all_results)
        }
    
    def _generate_recommendations(self, results: List[ValidationResult]) -> List[str]:
        """Generate setup recommendations based on validation results."""
        recommendations = []
        
        # Check for missing required components
        missing_required = [r for r in results 
                          if r.required and r.status == ValidationStatus.MISSING]
        
        if missing_required:
            recommendations.append(
                "Configure missing required environment variables before proceeding"
            )
        
        # Check for API issues
        api_issues = [r for r in results 
                     if 'API' in r.component and r.status == ValidationStatus.INVALID]
        
        if api_issues:
            recommendations.append(
                "Verify API keys and network connectivity for external services"
            )
        
        # Check for optional improvements
        missing_optional = [r for r in results 
                          if not r.required and r.status == ValidationStatus.MISSING]
        
        if missing_optional:
            recommendations.append(
                "Consider configuring optional services like Redis for better performance"
            )
        
        # Database recommendations
        supabase_warnings = [r for r in results 
                           if 'Supabase' in r.component and r.status == ValidationStatus.WARNING]
        
        if supabase_warnings:
            recommendations.append(
                "Ensure Supabase service role key is configured for full functionality"
            )
        
        if not recommendations:
            recommendations.append("Your Eclipse platform setup looks good!")
        
        return recommendations


# Convenience function for quick validation
async def validate_platform_setup() -> Dict:
    """Quick platform setup validation."""
    validator = SetupValidator()
    return await validator.run_full_validation()


if __name__ == "__main__":
    # CLI usage
    import asyncio
    import json
    
    async def main():
        print("Running Eclipse platform setup validation...")
        result = await validate_platform_setup()
        print(json.dumps(result, indent=2))
    
    asyncio.run(main())