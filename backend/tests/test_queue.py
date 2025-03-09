import pytest
from unittest.mock import patch
from app.core.security import create_access_token
from fastapi import WebSocketDisconnect

# Тест 1: Успешное создание очереди
def test_create_queue_success(client, test_user):
    access_token = create_access_token(data={"sub": str(test_user.id)})
    with client.websocket_connect(f"/api/queue/{test_user.id}?password=test") as ws:
        response = ws.receive_text()
        assert "set_cookie" in response

# Тест 2: Подключение с неверным паролем
def test_join_queue_wrong_password(client, test_user):
    queue_id = str(test_user.id)
    correct_pass = "secret123"
    wrong_pass = "wrong_pass"

    # 1. Создаем очередь с паролем от первого пользователя
    with client.websocket_connect(
        f"/api/queue/{queue_id}?password={correct_pass}",
        cookies={"refresh_token": test_user.refresh_token}
    ) as ws:
        ws.receive_text()  # Получаем подтверждение создания

    # 2. Попытка подключения с неверным паролем
    try:
        with client.websocket_connect(
            f"/api/queue/{queue_id}?password={wrong_pass}",
            cookies={"refresh_token": test_user.refresh_token}
        ) as ws:
            response = ws.receive_text()
            pytest.fail("Connection should have been closed")
    except WebSocketDisconnect as exc:
        assert exc.code == 1008, "Connection closed with wrong code"
        assert "Неверный пароль!" in str(exc.reason)

    # 3. Проверяем доступ с правильным паролем
    with client.websocket_connect(
        f"/api/queue/{queue_id}?password={correct_pass}",
        cookies={"refresh_token": test_user.refresh_token}
    ) as ws:
        assert "queue:" in ws.receive_text()

# Тест 3: Обработка команды next на пустой очереди
def test_next_command(client, test_user):
    queue_id = str(test_user.id)
    correct_pass = "secret123"
    with client.websocket_connect(
        f"/api/queue/{queue_id}?password={correct_pass}", cookies={"refresh_token": test_user.refresh_token}
    ) as ws:
        response = ws.receive_text()
        assert 'queue:' in response
        response = ws.receive_text()
        assert '{"type":"chat_history","data":[]}' in response
        ws.send_text("next")
        response = ws.receive_text()
        assert 'error: Очередь пуста!' in response

# Тест 3: Команды join/leave
def test_join_leave_queue(client, test_user):
    queue_id = str(test_user.id)
    correct_pass = "secret123"
    with client.websocket_connect(
        f"/api/queue/{queue_id}?password={correct_pass}", cookies={"refresh_token": test_user.refresh_token}
    ) as ws:
        response = ws.receive_text()
        assert 'queue:' in response
        response = ws.receive_text()
        assert '{"type":"chat_history","data":[]}' in response
        # Тест команды join
        ws.send_text("join")
        ws.send_text("join")
        response = ws.receive_text()
        assert response.startswith("queue:")
        assert str(test_user.id) in response

        response = ws.receive_text()
        assert 'error: Вы уже в очереди!' in response
        
        # Тест команды leave
        ws.send_text("leave")
        response = ws.receive_text()
        assert response.startswith("queue:")
        assert str(test_user.id) not in response

# Тест 5: Обмен позициями (swap)
def test_swap_positions(client, test_user, second_user):
    queue_id = str(test_user.id)
    correct_pass = "secret123"
    with client.websocket_connect(
        f"/api/queue/{queue_id}?password={correct_pass}", cookies={"refresh_token": test_user.refresh_token}
    ) as creator_ws:
        with client.websocket_connect(
            f"/api/queue/{queue_id}?password={correct_pass}", cookies={"refresh_token": second_user.refresh_token}
        ) as user2_ws:
            response = user2_ws.receive_text()
            assert 'queue:' in response

            response = user2_ws.receive_text()
            assert '{"type":"chat_history","data":[]}' in response

            creator_ws.send_text("join")

            response = user2_ws.receive_text()
            assert 'queue:1:0.0 сек' in response

            user2_ws.send_text("join")

            response = user2_ws.receive_text()
            assert 'queue:1:0.0 сек,2:0.0 сек' in response
            
            user2_ws.send_text("swap_request:1")
            response = user2_ws.receive_text()
            assert "info: Запрос на обмен отправлен" in response

            creator_ws.send_text("swap_accept")
            response = user2_ws.receive_text()
            assert 'queue:2:0.0 сек,1:0.0 сек' in response

            response = user2_ws.receive_text()
            assert 'accept' in response

# Тест 6: Интеграция с Gigachat
@patch("app.api.endpoints.queue.send_message_to_gigachat")
def test_gigachat_integration(mock_giga, client, test_user):
    mock_giga.return_value = "Тестовый ответ"
    
    queue_id = str(test_user.id)
    correct_pass = "secret123"
    with client.websocket_connect(
        f"/api/queue/{queue_id}?password={correct_pass}", cookies={"refresh_token": test_user.refresh_token}
    ) as creator_ws:
        
        response = creator_ws.receive_text()
        assert 'queue:' in response

        response = creator_ws.receive_text()
        assert '{"type":"chat_history","data":[]}' in response

        creator_ws.send_text("message: /ai Как дела?")
        response = creator_ws.receive_text()
        assert "user_id" in response
        response = creator_ws.receive_json()
        assert response["data"]["text"] == "Тестовый ответ"

# Тест 7: Проверка существования очереди
def test_check_queue_existence(client, test_user):
    queue_id = str(test_user.id)
    correct_pass = "secret123"
    with client.websocket_connect(
        f"/api/queue/{queue_id}?password={correct_pass}", cookies={"refresh_token": test_user.refresh_token}
    ) as creator_ws:
        pass
    
    response = client.get(
        "/api/queue",
        headers={"Authorization": f"Bearer {test_user.access_token}"}
    )
    
    assert response.status_code == 200
    assert response.json()["message"] == "Очередь существует."