from pydantic_settings import BaseSettings 
from pydantic import Field 
from typing import List 

class Settings(BaseSettings): 
    ENV: str = Field(default="development") 

    DATABASE_URL: str = Field(...) 
    REDIS_URL: str = Field(...) 
    RQ_QUEUE: str = Field(default="default")
    STORAGE_PATH: str = Field(...)

    # CSV origins in env 
    CORS_ORIGINS: str = Field(default="http://localhost:3000,http://127.0.0.1:3000")

    @property 
    def cors_origins_list(self) -> List[str]:
        return [o.strip() for o in self.CORS_ORIGINS.split(",") if o.strip()] 
    
    class Config: 
        env_file = ".env" 
        extra = "ignore" 

settings = Settings() 