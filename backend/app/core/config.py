from pydantic_settings import BaseSettings
import os

class Settings(BaseSettings):
    groq_api_key: str
    groq_model: str = "llama-3.3-70b-versatile"
    upload_dir: str = "./uploads"
    max_file_size: int = 10485760  # 10MB
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"

settings = Settings()