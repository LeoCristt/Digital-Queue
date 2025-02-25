from app.core.database import engine, Base
from app.models.user import User  # Импортируйте все модели

# Создайте все таблицы
Base.metadata.create_all(bind=engine)

print("Таблицы успешно созданы!")