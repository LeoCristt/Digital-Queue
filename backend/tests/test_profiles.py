# Тест 1: Успешное получение профиля
def test_get_profile_success(client, test_user):
    response = client.get(f"/api/profiles/{test_user.id}")
    
    assert response.status_code == 200
    assert response.json() == {
        "message": "Данные профиля запрошенного пользователя.",
        "username": test_user.username,
        "avatar_url": f"http://localhost:8000{test_user.avatar_url}"
    }

# Тест 2: Пользователь не найден
def test_get_profile_not_found(client):
    response = client.get("/api/profiles/999")
    
    assert response.status_code == 400
    assert "Пользователь не найден" in response.json()["detail"]

# Тест 3: Неверный формат ID
def test_get_profile_invalid_id(client):
    response = client.get("/api/profiles/invalid_id")
    
    assert response.status_code == 422
    assert "type=value_error" in str(response.json())

# Тест 4: Проверка формирования avatar_url
def test_avatar_url_format(client, db_session, test_user):
    # Обновляем аватар через сессию БД
    test_user.avatar_url = "/avatars/test.jpg"
    db_session.commit()
    
    response = client.get(f"/api/profiles/{test_user.id}")
    assert response.json()["avatar_url"] == "http://localhost:8000/avatars/test.jpg"

# Тест 5: Пользователь без аватара
def test_profile_without_avatar(client, db_session, test_user):
    test_user.avatar_url = None
    db_session.commit()
    
    response = client.get(f"/api/profiles/{test_user.id}")
    assert response.json()["avatar_url"] == None

# Тест 6: Проверка структуры ответа
def test_response_structure(client, test_user):
    response = client.get(f"/api/profiles/{test_user.id}")
    data = response.json()
    
    assert set(data.keys()) == {"message", "username", "avatar_url"}
    assert isinstance(data["username"], str)

# Тест 7: Неверный HTTP метод
def test_wrong_http_method(client, test_user):
    response = client.post(f"/api/profiles/{test_user.id}")
    assert response.status_code == 405