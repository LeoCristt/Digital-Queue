from fastapi import APIRouter
from app.api.endpoints import queue
from app.api.endpoints.auth import register, login, refresh

api_router = APIRouter()
api_router.include_router(queue.router, tags=["queue"])
api_router.include_router(register.router, prefix="/auth", tags=["auth"])
api_router.include_router(login.router, prefix="/auth", tags=["auth"])
api_router.include_router(refresh.router, prefix="/auth", tags=["auth"])