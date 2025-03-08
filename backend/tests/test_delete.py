from app.core.security import create_access_token, SECRET_KEY, ALGORITHM
from http.cookies import SimpleCookie
from datetime import datetime, timedelta
from jose import jwt

# Тест 1: Успешное удаление пользователя
def test_delete_user_success(client, test_user):
    access_token = create_access_token(data={"sub": str(test_user.id)})
    
    response = client.delete(
        "/api/auth/delete",
        headers={"Authorization": f"Bearer {access_token}"}
    )
    
    assert response.status_code == 200
    assert response.json() == {"message": "Пользователь удален."}
    assert client.cookies.get("refresh_token") is None

# Тест 2: Попытка удаления без токена
def test_delete_unauthorized(client):
    response = client.delete("/api/auth/delete")
    
    assert response.status_code == 401
    assert "Требуется аутентификация" in response.json()["detail"]

# Тест 3: Недействительный токен
def test_delete_invalid_token(client):
    response = client.delete(
        "/api/auth/delete",
        headers={"Authorization": "Bearer invalid_token"}
    )
    
    assert response.status_code == 401
    assert "Недействительный токен" in response.json()["detail"]

# Тест 4: Попытка удаления несуществующего пользователя
def test_delete_nonexistent_user(client):
    access_token = create_access_token(data={"sub": "999"})
    
    response = client.delete(
        "/api/auth/delete",
        headers={"Authorization": f"Bearer {access_token}"}
    )
    
    assert response.status_code == 401
    assert "Пользователь не найден" in response.json()["detail"]

# Тест 5: Проверка удаления куки
def test_delete_cookie_removal(client, test_user):
    access_token = create_access_token(data={"sub": str(test_user.id)})
    
    response = client.delete(
        "/api/auth/delete",
        headers={"Authorization": f"Bearer {access_token}"}
    )
    
    # Парсим заголовок Set-Cookie
    cookies = SimpleCookie()
    cookies.load(response.headers.get("set-cookie", ""))
    
    # Проверяем параметры куки refresh_token
    refresh_cookie = cookies.get("refresh_token")
    assert refresh_cookie is not None
    
    # Проверяем что кука помечена на удаление
    assert refresh_cookie["max-age"] == "0" or int(refresh_cookie["max-age"]) <= 0
    assert refresh_cookie.value == ""

# Тест 6: Использование устаревшего токена
def test_delete_with_expired_token(client, test_user):
    # Создаем токен с прошедшей датой экспирации
    expired_payload = {
        "sub": str(test_user.id),
        "exp": datetime.utcnow() - timedelta(minutes=10)
    }
    expired_token = jwt.encode(expired_payload, SECRET_KEY, algorithm=ALGORITHM)
    
    response = client.delete(
        "/api/auth/delete",
        headers={"Authorization": f"Bearer {expired_token}"}
    )
    
    assert response.status_code == 401
    assert "Токен истек" in response.json()["detail"]

# Тест 7: Попытка удаления с неверным методом
def test_delete_wrong_method(client, test_user):
    access_token = create_access_token(data={"sub": str(test_user.id)})
    
    response = client.get(
        "/api/auth/delete",
        headers={"Authorization": f"Bearer {access_token}"}
    )
    
    assert response.status_code == 405
    assert "Method Not Allowed" in response.json()["detail"]