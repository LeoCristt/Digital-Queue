from fastapi import FastAPI
from app.api.routers import api_router
from app.middleware.auto_refresh import auto_refresh_token_middleware

app = FastAPI(title="My Project")

app.middleware("http")(auto_refresh_token_middleware)

app.include_router(api_router, prefix="/api")