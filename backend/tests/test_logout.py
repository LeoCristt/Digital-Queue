from app.core.security import create_access_token
from datetime import datetime, timedelta
from jose import jwt
from app.core.security import SECRET_KEY, ALGORITHM
from http.cookies import SimpleCookie

# Тест 1: Успешный выход из системы
def test_logout_success(client, test_user):
    access_token = create_access_token(data={"sub": str(test_user.id)})
    
    response = client.post(
        "/api/auth/logout",
        headers={"Authorization": f"Bearer {access_token}"}
    )
    
    assert response.status_code == 200
    assert response.json() == {"message": "Пользователь вышел из системы."}
    assert "refresh_token" not in response.cookies

# Тест 2: Попытка выхода без токена
def test_logout_unauthorized(client):
    response = client.post("/api/auth/logout")
    
    assert response.status_code == 401
    assert "Требуется аутентификация" in response.json()["detail"]

# Тест 3: Недействительный токен
def test_logout_invalid_token(client):
    response = client.post(
        "/api/auth/logout",
        headers={"Authorization": "Bearer invalid_token"}
    )
    
    assert response.status_code == 401
    assert "Недействительный токен" in response.json()["detail"]

# Тест 4: Просроченный токен
def test_logout_expired_token(client, test_user):
    expired_payload = {
        "sub": str(test_user.id),
        "exp": datetime.utcnow() - timedelta(minutes=10)
    }
    expired_token = jwt.encode(expired_payload, SECRET_KEY, algorithm=ALGORITHM)
    
    response = client.post(
        "/api/auth/logout",
        headers={"Authorization": f"Bearer {expired_token}"}
    )
    
    assert response.status_code == 401
    assert "Токен истек" in response.json()["detail"]

# Тест 5: Несуществующий пользователь
def test_logout_nonexistent_user(client):
    access_token = create_access_token(data={"sub": "999"})
    
    response = client.post(
        "/api/auth/logout",
        headers={"Authorization": f"Bearer {access_token}"}
    )
    
    assert response.status_code == 401
    assert "Пользователь не найден" in response.json()["detail"]

# Тест 6: Проверка удаления куки
def test_logout_cookie_removal(client, test_user):
    access_token = create_access_token(data={"sub": str(test_user.id)})
    
    response = client.post(
        "/api/auth/logout",
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

# Тест 7: Неверный HTTP метод
def test_logout_wrong_method(client, test_user):
    access_token = create_access_token(data={"sub": str(test_user.id)})
    
    response = client.get(
        "/api/auth/logout",
        headers={"Authorization": f"Bearer {access_token}"}
    )
    
    assert response.status_code == 405
    assert "Method Not Allowed" in response.json()["detail"]