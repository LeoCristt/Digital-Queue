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
from app.models.user import User
from app.core.security import get_password_hash

TEST_DATABASE_URL = "sqlite:///./sql_app.db"

engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture
def db_session():
    connection = engine.connect()
    transaction = connection.begin()
    session = TestingSessionLocal(bind=connection)
    
    try:
        yield session
    finally:
        session.close()
        transaction.rollback()
        connection.close()

@pytest.fixture
def client(db_session):
    def override_get_db():
        yield db_session
    
    from app.main import app
    app.dependency_overrides[get_db] = override_get_db
    
    with TestClient(app) as c:
        yield c

@pytest.fixture
def test_user(db_session):
    user = User(
        email="test@example.com",
        username="testuser",
        hashed_password=get_password_hash("TestPass123!")
    )
    db_session.add(user)
    db_session.commit()
    return user