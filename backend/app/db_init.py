from app.core.database import engine
from app.models.base import Base
from app.models.user import User  # Импортируйте все модели
from app.models.feedback import Feedback  # Импортируйте все модели
from app.models.queue import Queue  # Импортируйте все модели

# Создайте все таблицы
Base.metadata.create_all(bind=engine)

print("Таблицы успешно созданы!")