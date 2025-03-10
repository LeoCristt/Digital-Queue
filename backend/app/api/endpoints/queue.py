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
from gigachat import GigaChat
import random

# Глобальные переменные для хранения очереди и подключений
queues = {}

def generate_unique_client_id(db: Session):
    # Генерируем трехзначные числа, пока не найдем свободное
    used_ids = {user.id for user in db.query(User.id).all()}
    while True:
        client_id_num = random.randint(100, 999)
        if client_id_num not in used_ids:
            return str(client_id_num)
        # Если все трехзначные заняты (маловероятно), расширяем диапазон
        client_id_num = random.randint(1000, 9999)
        if client_id_num not in used_ids:
            return str(client_id_num)

async def send_message_to_gigachat(message: str):
    # Укажите ключ авторизации, полученный в личном кабинете, в интерфейсе проекта GigaChat API
    with GigaChat(credentials="MTVmZjQ5NTUtNTQ5OS00ODViLWE3NzItZTQzMjM1MDU4MTZjOjcxN2ZlM2ExLTdmYzYtNDBmYS1iMmFjLWQyOTc2YThjOGIwNA==", verify_ssl_certs=False) as giga:
        response = giga.chat(message)
        return (response.choices[0].message.content)

def register_websocket_handlers(app):
    @app.websocket("/api/queue/{queue_id}")
    async def websocket_endpoint(websocket: WebSocket, queue_id: str, password: str = None, db: Session = Depends(get_db)):
        await websocket.accept()

        # Генерация client_id
        client_id = websocket.cookies.get(f"client_id_{queue_id}")

        refresh_token = websocket.cookies.get("refresh_token")
        id = None

        if refresh_token:
            payload = verify_refresh_token(refresh_token)
            if not payload:
                raise HTTPException(status_code=401, detail="Недействительный refresh token")
            id = payload.get("sub")

            user = db.query(User).filter(User.id == int(id)).first()
            if not user:
                raise HTTPException(status_code=401, detail="Пользователь не найден")
        
        if not client_id and not id:
            client_id = generate_unique_client_id(db)
            try:
                await websocket.send_text(f"set_cookie:client_id_{queue_id}={client_id}")
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
                "avg_time": None,  # Среднее время обработки
                "messages": [],  # История сообщений чата
                "swap_requests": {},
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

            await broadcast_queue(active_connections, current_queue, queues[queue_id].get("avg_time"))

            await websocket.send_json({
                "type": "chat_history",
                "data": queues[queue_id]["messages"][-50:]  # Последние 50 сообщений
            })
            
            while True:
                data = await websocket.receive_text()

                # Добавьте проверку просроченных запросов в цикл обработки сообщений
                if int(time.time()) % 10 == 0:  # Проверка каждые 10 секунд
                    current_time = time.time()
                    expired = [target_id for target_id, req in queues[queue_id]["swap_requests"].items() 
                            if current_time - req["timestamp"] > 30]
                    
                    for target_id in expired:
                        sender_id = queues[queue_id]["swap_requests"][target_id]["from"]
                        del queues[queue_id]["swap_requests"][target_id]
                        await send_personal_message(sender_id, {"type": "swap_result", "status": "timeout"}, active_connections)

                if data.startswith("message:"):
                    message_text = data[len("message:"):].strip()
                    if message_text:
                        new_message = {
                            "user_id": client_id,
                            "text": message_text,
                            "timestamp": time.time(),
                        }
                        queues[queue_id]["messages"].append(new_message)
                        
                        # Рассылаем сообщение всем участникам
                        await broadcast_message(active_connections, new_message)
                    if "/ai" in message_text:
                        # Разделяем сообщение на части
                        parts = message_text.split("/ai", 1)
                        if len(parts) > 1:
                            ai_message = parts[1].strip()  # Текст после /ai
                            if ai_message:
                                try:
                                    # Отправляем сообщение в Gigachat
                                    gigachat_response = await send_message_to_gigachat(ai_message)
                                    
                                    # Сохраняем ответ Gigachat в истории сообщений
                                    new_message = {
                                        "user_id": "Gigachat",  # Идентификатор Gigachat
                                        "text": gigachat_response,  # Ответ от Gigachat
                                        "timestamp": time.time(),
                                    }
                                    queues[queue_id]["messages"].append(new_message)
                                    
                                    # Рассылаем ответ Gigachat всем участникам
                                    await broadcast_message(active_connections, new_message)
                                except HTTPException as e:
                                    await websocket.send_text(f"error: {e.detail}")
                                except Exception as e:
                                    await websocket.send_text(f"error: Ошибка при взаимодействии с Gigachat: {str(e)}")
                        else:
                            await websocket.send_text("error: Не указано сообщение для нейронки после /ai")
                    continue
                
                if data == "join":
                    if client_id not in [user["client_id"] for user in queues[queue_id]["queue"]]:
                        queues[queue_id]["queue"].append({
                            "client_id": client_id,
                            "join_time": time.time()  # Сохраняем время добавления
                        })
                        await broadcast_queue(active_connections, queues[queue_id]["queue"], queues[queue_id].get("avg_time"))
                    else:
                        await websocket.send_text("info: Вы уже в очереди!")
                
                elif data == "leave":
                    # Удаляем пользователя из очереди в глобальном словаре
                    queues[queue_id]["queue"] = [
                        user for user in queues[queue_id]["queue"] 
                        if user["client_id"] != client_id
                    ]
                    await broadcast_queue(active_connections, queues[queue_id]["queue"], queues[queue_id].get("avg_time"))

                elif data == "delete":
                    if client_id == queue_id:
                        # Сохраняем копию подключений перед удалением
                        connections_to_close = active_connections.copy()
                        
                        # Удаляем очередь из глобального словаря
                        del queues[queue_id]
                        
                        # Рассылаем уведомление и закрываем соединения
                        for connection, _ in connections_to_close:
                            try:
                                await connection.send_text(f"delete_cookie:client_id_{queue_id}")
                                await connection.send_text("error: Очередь была удалена создателем.")
                                await connection.close()
                            except Exception:
                                pass
                        
                        # Очищаем локальный список подключений
                        active_connections.clear()
                        break
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

                        if queues[queue_id]["queue"]:
                            # Начинаем обработку нового пользователя
                            removed_user = queues[queue_id]["queue"].pop(0)
                            queue_data["removed_user"] = removed_user
                            queue_data["last_processing_start"] = time.time()  # Запускаем новый таймер
                            await broadcast_queue(active_connections, queues[queue_id]["queue"], queue_data.get("avg_time"))
                            await websocket.send_text(f"info: Начата обработка пользователя {removed_user['client_id']}")
                        else:
                            queue_data["last_processing_start"] = None  # Сбрасываем таймер
                            await websocket.send_text("info: Очередь пуста!")
                    else:
                        await websocket.send_text("error: Только создатель очереди может использовать команду 'next'!")

                elif data == "undo":
                    if client_id == queue_id:  # Только создатель очереди может использовать команду
                        removed_user = queues[queue_id]["removed_user"]
                        if removed_user:
                            # Возвращаем пользователя обратно в начало очереди
                            queues[queue_id]["queue"].insert(0, removed_user)  # Вставляем в начало
                            queues[queue_id]["removed_user"] = None
                            await broadcast_queue(active_connections, queues[queue_id]["queue"], queues[queue_id].get("avg_time"))
                            await websocket.send_text(f"info: Пользователь {removed_user['client_id']} возвращен в очередь.")
                        else:
                            await websocket.send_text("info: Нет пользователя для возврата!")
                    else:
                        await websocket.send_text("error: Только создатель очереди может использовать команду 'undo'!")
                
                elif data.startswith("swap_request:"):
                    try:
                        target_id = data.split(":")[1].strip()

                        # В блоке обработки swap_request добавьте проверку существующих запросов
                        if queues[queue_id]["swap_requests"].get(target_id):
                            await websocket.send_text("error: У пользователя уже есть активный запрос!")
                            return
                        
                        # Проверка что оба пользователя в очереди
                        current_queue = queues[queue_id]["queue"]
                        sender_in_queue = any(user["client_id"] == client_id for user in current_queue)
                        target_in_queue = any(user["client_id"] == target_id for user in current_queue)
                        
                        if not sender_in_queue:
                            await websocket.send_text("error: Вы не в очереди!")
                        elif not target_in_queue:
                            await websocket.send_text("error: Целевой пользователь не в очереди!")
                        elif target_id == client_id:
                            await websocket.send_text("error: Нельзя меняться с собой!")
                        else:
                            # Сохраняем запрос
                            queues[queue_id]["swap_requests"][target_id] = {
                                "from": client_id,
                                "timestamp": time.time()
                            }
                            
                            # Отправляем уведомления
                            await send_personal_message(target_id, {
                                "type": "swap_request",
                                "from": client_id
                            }, active_connections)
                            
                            await websocket.send_text("info: Запрос на обмен отправлен")

                    except Exception as e:
                        await websocket.send_text("error: Неверный формат команды. Используйте: swap_request:user_id")

                elif data == "swap_accept":
                    await process_swap_response(client_id, queue_id, True, active_connections)

                elif data == "swap_decline":
                    await process_swap_response(client_id, queue_id, False, active_connections)

        except WebSocketDisconnect:
            # Удаляем подключение при разрыве
            if queues[queue_id]:
                active_connections.remove((websocket, client_id))
                await broadcast_queue(active_connections, current_queue, queues[queue_id].get("avg_time"))

    async def send_personal_message(target_id, message, connections):
        for ws, cid in connections:
            if cid == target_id:
                try:
                    await ws.send_json(message)
                except:
                    pass
                break

    async def process_swap_response(client_id, queue_id, accepted, active_connections):
        request = queues[queue_id]["swap_requests"].get(client_id)
        
        if not request:
            return
        
        sender_id = request["from"]
        del queues[queue_id]["swap_requests"][client_id]
        
        if accepted:
            try:
                sender_idx = next(i for i, u in enumerate(queues[queue_id]["queue"]) if u["client_id"] == sender_id)
                target_idx = next(i for i, u in enumerate(queues[queue_id]["queue"]) if u["client_id"] == client_id)
            except StopIteration:
                return
            
            # Обмен позициями
            queues[queue_id]["queue"][sender_idx], queues[queue_id]["queue"][target_idx] = queues[queue_id]["queue"][target_idx], queues[queue_id]["queue"][sender_idx]
            
            # Рассылаем обновленную очередь
            await broadcast_queue(active_connections, queues[queue_id]["queue"], queues[queue_id].get("avg_time"))
            
            # Отправляем подтверждения
            await send_personal_message(sender_id, {
                "type": "swap_result",
                "status": "accepted",
                "with": client_id
            }, active_connections)
            
            await send_personal_message(client_id, {
                "type": "swap_result",
                "status": "accepted",
                "with": sender_id
            }, active_connections)
        else:
            await send_personal_message(sender_id, {
                "type": "swap_result",
                "status": "declined",
                "with": client_id
            }, active_connections)

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

    async def broadcast_message(active_connections, message):
        for connection, _ in list(active_connections):
            try:
                await connection.send_json({
                    "type": "new_message",
                    "data": {
                        "user_id": message["user_id"],
                        "text": message["text"],
                        "timestamp": message["timestamp"],
                    }
                })
            except WebSocketDisconnect:
                try:
                    active_connections.remove((connection, _))
                except ValueError:
                    pass

router = APIRouter()

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