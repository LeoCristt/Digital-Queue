from fastapi import WebSocket, WebSocketDisconnect, APIRouter, HTTPException, Depends, Request
import uuid
from app.core.security import verify_refresh_token
from app.core.database import get_db
from app.models.user import User
from sqlalchemy.orm import Session
import time
from app.core.security import (
    SECRET_KEY,
    ALGORITHM
)
from jose import jwt

router = APIRouter()

# Глобальные переменные для хранения очереди и подключений
queues = {}

@router.websocket("/queue/{queue_id}/{password}")
async def websocket_endpoint(websocket: WebSocket, queue_id: str, password: str = None, db: Session = Depends(get_db)):
    await websocket.accept()

    # Генерация client_id
    client_id = websocket.cookies.get("client_id")

    refresh_token = websocket.cookies.get("refresh_token")

    payload = verify_refresh_token(refresh_token)
    if not payload:
        raise HTTPException(status_code=401, detail="Недействительный refresh token")
    id = payload.get("sub")

    user = db.query(User).filter(User.id == int(id)).first()
    if not user:
        raise HTTPException(status_code=401, detail="Пользователь не найден")
    
    if not client_id and not id:
        client_id = str(uuid.uuid4())
        try:
            await websocket.send_text(f"set_cookie:client_id={client_id}")
        except WebSocketDisconnect:
            return  # Выход, если соединение закрыто
    elif not client_id and id:
        client_id = id

    # Проверка, что queue_id совпадает с user_id при создании новой очереди
    if queue_id not in queues:
        if queue_id != client_id:
            await websocket.send_text("error: You can only create a queue with your own user ID")
            await websocket.close()
            return
        queues[queue_id] = {
            "queue": [],  # Очередь с информацией о пользователях
            "connections": [],
            "password": password,
            "removed_user": None,  # Поле для хранения временно удаленного пользователя
            "processing_times": [],  # История времени обработки
            "last_processing_start": None,  # Время начала обработки текущего пользователя
            "avg_time": None  # Среднее время обработки
        }
    else:
        # Если очередь уже существует
        if queues[queue_id]["password"] is not None:  # Если очередь защищена паролем
            if password != queues[queue_id]["password"]:  # Проверяем пароль
                await websocket.send_text("error: Неверный пароль!")
                await websocket.close()
                return

    current_queue = queues[queue_id]["queue"]
    active_connections = queues[queue_id]["connections"]

    try:
        # Добавляем подключение в список
        active_connections.append((websocket, client_id))
        
        while True:
            data = await websocket.receive_text()
            
            if data == "join":
                if client_id not in [user["client_id"] for user in current_queue]:
                    current_queue.append({
                        "client_id": client_id,
                        "join_time": time.time()  # Сохраняем время добавления
                    })
                    await broadcast_queue(active_connections, current_queue, queues[queue_id].get("avg_time"))
                else:
                    await websocket.send_text("error: Вы уже в очереди!")
            
            elif data == "leave":
                if client_id in [user["client_id"] for user in current_queue]:
                    current_queue = [user for user in current_queue if user["client_id"] != client_id]
                    await broadcast_queue(active_connections, current_queue, queues[queue_id].get("avg_time"))

            elif data == "delete":
                if client_id == queue_id:
                    # Сохраняем копию подключений перед удалением
                    connections_to_close = active_connections.copy()
                    
                    # Удаляем очередь из глобального словаря
                    del queues[queue_id]
                    
                    # Рассылаем уведомление и закрываем соединения
                    for connection, _ in connections_to_close:
                        try:
                            await connection.send_text("info: Очередь была удалена создателем.")
                            await connection.close()
                        except Exception:
                            pass
                    
                    # Очищаем локальный список подключений
                    active_connections.clear()
                else:
                    await websocket.send_text("error: Только создатель очереди может её удалить!")
            
            elif data == "next":
                if client_id == queue_id:  # Только создатель очереди может использовать команду
                    queue_data = queues[queue_id]
                    
                    # Фиксируем время обработки предыдущего пользователя (если было начато)
                    if queue_data.get("last_processing_start"):
                        processing_time = time.time() - queue_data["last_processing_start"]
                        queue_data["processing_times"].append(processing_time)
                        queue_data["avg_time"] = sum(queue_data["processing_times"]) / len(queue_data["processing_times"])
                        await websocket.send_text(f"info: Предыдущий пользователь обработан за {processing_time:.1f} сек. Среднее время: {queue_data['avg_time']:.1f} сек")

                    if current_queue:
                        # Начинаем обработку нового пользователя
                        removed_user = current_queue.pop(0)
                        queue_data["removed_user"] = removed_user
                        queue_data["last_processing_start"] = time.time()  # Запускаем новый таймер
                        await broadcast_queue(active_connections, current_queue, queue_data.get("avg_time"))
                        await websocket.send_text(f"info: Начата обработка пользователя {removed_user['client_id']}")
                    else:
                        queue_data["last_processing_start"] = None  # Сбрасываем таймер
                        await websocket.send_text("error: Очередь пуста!")
                else:
                    await websocket.send_text("error: Только создатель очереди может использовать команду 'next'!")

            elif data == "undo":
                if client_id == queue_id:  # Только создатель очереди может использовать команду
                    removed_user = queues[queue_id]["removed_user"]
                    if removed_user:
                        # Возвращаем пользователя обратно в начало очереди
                        current_queue.insert(0, removed_user)  # Вставляем в начало
                        queues[queue_id]["removed_user"] = None
                        await broadcast_queue(active_connections, current_queue, queues[queue_id].get("avg_time"))
                        await websocket.send_text(f"info: Пользователь {removed_user['client_id']} возвращен в очередь.")
                    else:
                        await websocket.send_text("error: Нет пользователя для возврата!")
                else:
                    await websocket.send_text("error: Только создатель очереди может использовать команду 'undo'!")

    except WebSocketDisconnect:
        # Удаляем подключение при разрыве
        active_connections.remove((websocket, client_id))
        await broadcast_queue(active_connections, current_queue, queues[queue_id].get("avg_time"))

async def broadcast_queue(active_connections, current_queue, avg_time):
    if avg_time is None:
        avg_time = 0  # Если среднее время не установлено, считаем его нулевым

    for connection, _ in list(active_connections):
        try:
            queue_info = []
            for idx, user in enumerate(current_queue):
                expected_time = idx * avg_time  # Ожидаемое время для текущего пользователя
                queue_info.append(f"{user['client_id']}:{expected_time:.1f} сек")
            await connection.send_text(f"queue:{','.join(queue_info)}")
        except WebSocketDisconnect:
            try:
                active_connections.remove((connection, _))
            except ValueError:
                pass

@router.get("/queue")
async def check_queue_existence(request: Request, db: Session = Depends(get_db)):

    auth_header = request.headers.get("New-Access-Token")
    if not auth_header:
        auth_header = request.headers.get("Authorization")
    
    access_token = auth_header.split(" ")[1]

    payload = jwt.decode(
        access_token,
        SECRET_KEY,
        algorithms=[ALGORITHM]
    )

    access_user_id = payload.get("sub")
    
    user = db.query(User).filter(User.id == int(access_user_id)).first()
    if not user:
        raise HTTPException(status_code=401, detail="Некорректный access token!")
    
    # Проверка существования очереди
    if access_user_id not in queues:
        raise HTTPException(status_code=404, detail="Очередь не найдена!")
    
    # Дополнительная проверка прав доступа (если очередь приватная)
    queue_info = queues[access_user_id]
    
    return {
        "message": "Очередь существует.",
        "queue_id": access_user_id,
        "password": queue_info["password"]
    }