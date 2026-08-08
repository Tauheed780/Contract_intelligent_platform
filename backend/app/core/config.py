from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Groq settings
    groq_api_key: str
    groq_model: str = "llama-3.3-70b-versatile"
    
    # Keep these for compatibility
    upload_dir: str = "./uploads"
    max_file_size: int = 10485760
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()