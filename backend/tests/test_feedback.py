from app.core.security import create_access_token
from datetime import datetime, timedelta
from jose import jwt
from app.core.security import SECRET_KEY, ALGORITHM
from app.models.feedback import Feedback

# Тест 1: Успешная отправка отзыва
def test_feedback_success(client, test_user, db_session):
    access_token = create_access_token(data={"sub": str(test_user.id)})
    
    response = client.post(
        "/api/feedback",
        headers={"Authorization": f"Bearer {access_token}"},
        json={"description": "Отличный сервис!"},
    )
    
    assert response.status_code == 200
    assert response.json() == {"message": "Отзыв принят."}
    
    # Проверяем запись в БД
    feedback = db_session.query(Feedback).first()
    assert feedback is not None
    assert feedback.description == "Отличный сервис!"
    assert feedback.user_id == test_user.id

# Тест 2: Отправка без авторизации
def test_feedback_unauthorized(client):
    response = client.post(
        "/api/feedback",
        json={"description": "Тестовый отзыв"}
    )
    
    assert response.status_code == 401
    assert "Требуется аутентификация" in response.json()["detail"]

# Тест 3: Пустое описание отзыва
def test_feedback_empty_description(client, test_user):
    access_token = create_access_token(data={"sub": str(test_user.id)})
    
    response = client.post(
        "/api/feedback",
        json={"description": ""},
        headers={"Authorization": f"Bearer {access_token}"}
    )
    
    assert response.status_code == 422
    assert "ensure this value has at least 1 character" in str(response.json())

# Тест 4: Недействительный токен
def test_feedback_invalid_token(client):
    response = client.post(
        "/api/feedback",
        json={"description": "Тестовый отзыв"},
        headers={"Authorization": "Bearer invalid_token"}
    )
    
    assert response.status_code == 401
    assert "Недействительный токен" in response.json()["detail"]

# Тест 5: Просроченный токен
def test_feedback_expired_token(client, test_user):
    expired_payload = {
        "sub": str(test_user.id),
        "exp": datetime.utcnow() - timedelta(minutes=10)
    }
    expired_token = jwt.encode(expired_payload, SECRET_KEY, algorithm=ALGORITHM)
    
    response = client.post(
        "/api/feedback",
        json={"description": "Тестовый отзыв"},
        headers={"Authorization": f"Bearer {expired_token}"}
    )
    
    assert response.status_code == 401
    assert "Токен истек" in response.json()["detail"]

# Тест 6: Несуществующий пользователь
def test_feedback_nonexistent_user(client):
    access_token = create_access_token(data={"sub": "999"})
    
    response = client.post(
        "/api/feedback",
        json={"description": "Тестовый отзыв"},
        headers={"Authorization": f"Bearer {access_token}"}
    )
    
    assert response.status_code == 400
    assert "Пользователь не найден" in response.json()["detail"]

# Тест 7: Отправка слишком длинного отзыва
def test_feedback_long_description(client, test_user):
    access_token = create_access_token(data={"sub": str(test_user.id)})
    long_description = "a" * 1001  # Предположим, что максимальная длина 1000 символов
    
    response = client.post(
        "/api/feedback",
        json={"description": long_description},
        headers={"Authorization": f"Bearer {access_token}"}
    )
    
    assert response.status_code == 422
    assert "ensure this value has at most 1000 characters" in str(response.json())