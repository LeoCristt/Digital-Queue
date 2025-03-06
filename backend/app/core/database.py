from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Укажите URL для подключения к БД
SQLALCHEMY_DATABASE_URL = "sqlite:///./sql_app.db"  # SQLite будет создан в файле sql_app.db

# Создайте движок для подключения к БД
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}  # Только для SQLite
)

# Создайте фабрику сессий
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Функция для получения сессии БД
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()