from app.models.user import User
from app.core.security import verify_password, REFRESH_TOKEN_EXPIRE_DAYS

# Тест 1: Успешная регистрация
def test_register_success(client, db_session):
    test_data = {
        "email": "test@example.com",
        "username": "testuser",
        "password": "TestPass123!",
        "re_password": "TestPass123!"
    }
    
    response = client.post("http://127.0.0.1:8000/api/auth/register", json=test_data)
    
    assert response.status_code == 200
    assert "access_token" in response.json()
    assert response.json()["token_type"] == "bearer"
    
    user = db_session.query(User).filter(User.email == test_data["email"]).first()
    assert user is not None
    assert verify_password(test_data["password"], user.hashed_password)

# Тест 2: Несовпадающие пароли
def test_register_password_mismatch(client):
    test_data = {
        "email": "test2@example.com",
        "username": "testuser2",
        "password": "TestPass123!",
        "re_password": "WrongPass456!"
    }
    
    response = client.post("http://127.0.0.1:8000/api/auth/register", json=test_data)
    
    assert response.status_code == 400
    assert "Пароли не совпадают" in response.json()["detail"]

# Тест 3: Занятый email
def test_register_existing_email(client, db_session):
    # Создаем существующего пользователя
    existing_user = User(
        email="existing@example.com",
        username="existinguser",
        hashed_password="fakehash"
    )
    db_session.add(existing_user)
    db_session.commit()

    test_data = {
        "email": "existing@example.com",
        "username": "newuser",
        "password": "TestPass123!",
        "re_password": "TestPass123!"
    }
    
    response = client.post("http://127.0.0.1:8000/api/auth/register", json=test_data)
    
    assert response.status_code == 400
    assert "Почта или логин уже зарезервированы" in response.json()["detail"]

# Тест 4: Занятый username
def test_register_existing_username(client, db_session):
    existing_user = User(
        email="another@example.com",
        username="takenusername",
        hashed_password="fakehash"
    )
    db_session.add(existing_user)
    db_session.commit()

    test_data = {
        "email": "new@example.com",
        "username": "takenusername",
        "password": "TestPass123!",
        "re_password": "TestPass123!"
    }
    
    response = client.post("http://127.0.0.1:8000/api/auth/register", json=test_data)
    
    assert response.status_code == 400
    assert "Почта или логин уже зарезервированы" in response.json()["detail"]

# Тест 5: Проверка установки refresh token в cookie
def test_refresh_token_cookie(client):
    test_data = {
        "email": "cookie@example.com",
        "username": "cookietest",
        "password": "TestPass123!",
        "re_password": "TestPass123!"
    }
    
    response = client.post("http://127.0.0.1:8000/api/auth/register", json=test_data)
    
    # Проверяем наличие куки через объект cookies
    refresh_cookie = response.cookies.get("refresh_token")
    
    # Основные проверки
    assert refresh_cookie is not None
    assert refresh_cookie.startswith("eyJ")  # Проверка начала JWT токена
    
    # Проверка параметров куки
    cookie_header = response.headers.get("set-cookie")
    assert "HttpOnly" in cookie_header
    assert "Secure" in cookie_header
    assert f"Max-Age={REFRESH_TOKEN_EXPIRE_DAYS * 24 * 3600}" in cookie_header

# Тест 6: Некорректный email
def test_register_invalid_email(client):
    test_data = {
        "email": "not-an-email",
        "username": "invalidemail",
        "password": "TestPass123!",
        "re_password": "TestPass123!"
    }
    
    response = client.post("http://127.0.0.1:8000/api/auth/register", json=test_data)
    
    assert response.status_code == 422
    assert "value is not a valid email address" in str(response.json())

# Тест 7: Слабый пароль
def test_register_weak_password(client):
    test_data = {
        "email": "weak@example.com",
        "username": "weakpassword",
        "password": "123",
        "re_password": "123"
    }
    
    response = client.post("http://127.0.0.1:8000/api/auth/register", json=test_data)
    
    assert response.status_code == 422
    assert "at least 8 characters" in str(response.json())