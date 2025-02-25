from fastapi import FastAPI
from app.api.routers import api_router
from app.middleware.auto_refresh import auto_refresh_token_middleware
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="My Project")

app.middleware("http")(auto_refresh_token_middleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Разрешить все домены (настройте правильно для продакшена!)
    allow_credentials=True,
    allow_methods=["*"],  # Разрешить все методы
    allow_headers=["*"],  # Разрешить все заголовки
)

app.include_router(api_router, prefix="/api")