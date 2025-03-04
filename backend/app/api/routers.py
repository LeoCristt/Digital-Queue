from fastapi import APIRouter
from app.api.endpoints import queue
from app.api.endpoints.auth import register, login, logout, delete
from app.api.endpoints.profile import profiles, settings

api_router = APIRouter()

api_router.include_router(queue.router, tags=["queue"])

api_router.include_router(register.router, prefix="/auth", tags=["auth"])
api_router.include_router(login.router, prefix="/auth", tags=["auth"])
api_router.include_router(logout.router, prefix="/auth", tags=["auth"])
api_router.include_router(delete.router, prefix="/auth", tags=["auth"])

api_router.include_router(profiles.router, prefix="/profiles", tags=["profiles"])
api_router.include_router(settings.router, prefix="/profiles", tags=["profiles"])