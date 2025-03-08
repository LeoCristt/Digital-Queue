from app.core.security import REFRESH_TOKEN_EXPIRE_DAYS

# Тест 1: Успешная авторизация по email
def test_login_success_email(client, test_user):
    login_data = {
        "username": test_user.email,
        "password": "TestPass123!"
    }
    response = client.post("http://127.0.0.1:8000/api/auth/login", json=login_data)
    
    assert response.status_code == 200
    assert "access_token" in response.json()
    assert response.cookies.get("refresh_token") is not None

# Тест 2: Успешная авторизация по username
def test_login_success_username(client, test_user):
    login_data = {
        "username": test_user.username,
        "password": "TestPass123!"
    }
    response = client.post("http://127.0.0.1:8000/api/auth/login", json=login_data)
    
    assert response.status_code == 200
    assert response.json()["token_type"] == "bearer"

# Тест 3: Неверный пароль
def test_login_wrong_password(client, test_user):
    login_data = {
        "username": test_user.email,
        "password": "WrongPassword123!"
    }
    response = client.post("http://127.0.0.1:8000/api/auth/login", json=login_data)
    
    assert response.status_code == 400
    assert "Пароль введен неверно" in response.json()["detail"]

# Тест 4: Пользователь не найден
def test_login_user_not_found(client):
    login_data = {
        "username": "nonexistent@example.com",
        "password": "AnyPassword123!"
    }
    response = client.post("http://127.0.0.1:8000/api/auth/login", json=login_data)
    
    assert response.status_code == 400
    assert "Пользователь не найден" in response.json()["detail"]

# Тест 5: Проверка refresh token cookie
def test_refresh_token_cookie(client, test_user):
    login_data = {
        "username": test_user.email,
        "password": "TestPass123!"
    }
    response = client.post("http://127.0.0.1:8000/api/auth/login", json=login_data)
    
    cookie = response.headers["set-cookie"]
    assert "refresh_token" in cookie
    assert "HttpOnly" in cookie
    assert "Secure" in cookie
    assert f"Max-Age={REFRESH_TOKEN_EXPIRE_DAYS * 24 * 3600}" in cookie

# Тест 6: Пустой username
def test_login_empty_username(client):
    login_data = {
        "username": "",
        "password": "TestPass123!"
    }
    response = client.post("http://127.0.0.1:8000/api/auth/login", json=login_data)
    
    assert response.status_code == 422
    assert "field required" in str(response.json())

# Тест 7: Слишком короткий пароль
def test_login_short_password(client):
    login_data = {
        "username": "test@example.com",
        "password": "123"
    }
    response = client.post("http://127.0.0.1:8000/api/auth/login", json=login_data)
    
    assert response.status_code == 422
    assert "at least 8 characters" in str(response.json())