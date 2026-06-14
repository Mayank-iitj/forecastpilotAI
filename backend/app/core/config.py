"""ForecastPilot AI — Backend Configuration"""
from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # Application
    APP_NAME: str = "ForecastPilot AI"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    API_PREFIX: str = "/api/v1"

    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000

    # Database
    DATABASE_URL: str = "sqlite+aiosqlite:///./forecastpilot.db"
    POSTGRES_URL: Optional[str] = None

    # Security
    SECRET_KEY: str = "forecastpilot-dev-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours

    # AI
    OPENAI_API_KEY: Optional[str] = None
    GEMINI_API_KEY: Optional[str] = None
    GROQ_API_KEY: str = "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"
    AI_MODEL: str = "llama-3.1-8b-instant"

    # CORS
    FRONTEND_URL: str = "http://localhost:3000"
    ALLOWED_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
        "https://forecastpilot.vercel.app",
    ]

    # File Upload
    MAX_UPLOAD_SIZE_MB: int = 50
    UPLOAD_DIR: str = "./uploads"

    @property
    def db_url(self) -> str:
        return self.POSTGRES_URL or self.DATABASE_URL

    model_config = {"env_file": ".env", "case_sensitive": True}


settings = Settings()
