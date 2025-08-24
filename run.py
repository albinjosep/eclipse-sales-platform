#!/usr/bin/env python3
"""
Eclipse AI-Native Sales Platform
Startup script for development and testing
"""

import uvicorn
from app.main import app

if __name__ == "__main__":
    print("🚀 Starting Eclipse AI-Native Sales Platform...")
    print("📍 AI agents are initializing...")
    print("🔗 API will be available at: http://localhost:8000")
    print("📚 API documentation at: http://localhost:8000/docs")
    print("🔍 Health check at: http://localhost:8000/health")
    print()
    
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )


