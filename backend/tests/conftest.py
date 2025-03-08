import sys
from pathlib import Path

# Добавляем корень проекта в Python path
root_dir = Path(__file__).parent.parent  # Поднимитесь на 3 уровня вверх из tests/
sys.path.insert(0, str(root_dir))

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.database import get_db
from fastapi.testclient import TestClient
from app.models.base import Base

TEST_DATABASE_URL = "sqlite:///./sql_app.db"

engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="module")
def db_session():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

@pytest.fixture(scope="function")
def client(db_session):
    def override_get_db():
        try:
            yield db_session
        finally:
            pass
    
    from app.main import app  # Импортируем после настройки зависимостей
    app.dependency_overrides[get_db] = override_get_db
    
    with TestClient(app) as c:
        yield c