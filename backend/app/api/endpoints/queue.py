from fastapi import WebSocket, WebSocketDisconnect, APIRouter, HTTPException, Depends, Request, status
from app.core.security import verify_refresh_token
from app.core.database import get_db, SessionLocal
from app.models.user import User
from app.models.queue import Queue
from sqlalchemy.orm import Session
import time
from app.core.security import (
    SECRET_KEY,
    ALGORITHM
)
from jose import jwt, JWTError
from gigachat import GigaChat
import random

router = APIRouter()
queues = {}

def generate_unique_client_id(db: Session):
    used_ids = {user.id for user in db.query(User.id).all()}
    while True:
        client_id_num = random.randint(100, 999)
        if client_id_num not in used_ids:
            return str(client_id_num)
        client_id_num = random.randint(1000, 9999)
        if client_id_num not in used_ids:
            return str(client_id_num)

async def send_message_to_gigachat(message: str):
    # Укажите ключ авторизации, полученный в личном кабинете, в интерфейсе проекта GigaChat API
    with GigaChat(credentials="MTVmZjQ5NTUtNTQ5OS00ODViLWE3NzItZTQzMjM1MDU4MTZjOjcxN2ZlM2ExLTdmYzYtNDBmYS1iMmFjLWQyOTc2YThjOGIwNA==", verify_ssl_certs=False) as giga:
        response = giga.chat(message)
        return (response.choices[0].message.content)

def update_queue_in_db(queue_id: str):
    db = SessionLocal()
    try:
        if queue_id not in queues:
            return
        queue_data = queues[queue_id]
        db_queue = db.query(Queue).filter(Queue.queue_id == queue_id).first()
        if not db_queue:
            db_queue = Queue(queue_id=queue_id)
            db.add(db_queue)
        
        db_queue.queue_data = queue_data["queue"]
        db_queue.password = queue_data.get("password")
        db_queue.removed_user = queue_data.get("removed_user")
        db_queue.processing_times = queue_data.get("processing_times", [])
        db_queue.last_processing_start = queue_data.get("last_processing_start")
        db_queue.avg_time = queue_data.get("avg_time")
        db_queue.messages = queue_data.get("messages", [])
        db_queue.swap_requests = queue_data.get("swap_requests", {})
        
        db.commit()
    except Exception as e:
        db.rollback()
        raise e
    finally:
        db.close()

def register_websocket_handlers(app):
    @app.websocket("/api/queue/{queue_id}")
    async def websocket_endpoint(websocket: WebSocket, queue_id: str, password: str = None):
        await websocket.accept()
        db = SessionLocal()
        try:
            client_id = websocket.cookies.get(f"client_id_{queue_id}")

            refresh_token = websocket.cookies.get("refresh_token")
            id = None

            if refresh_token:
                payload = verify_refresh_token(refresh_token)
                if not payload:
                    raise HTTPException(status_code=401, detail="Invalid refresh token")
                id = payload.get("sub")

                user = db.query(User).filter(User.id == int(id)).first()
                if not user:
                    raise HTTPException(status_code=401, detail="User not found")
            
            if not client_id and not id:
                client_id = generate_unique_client_id(db)
                try:
                    await websocket.send_text(f"set_cookie:client_id_{queue_id}={client_id}")
                except WebSocketDisconnect:
                    return
            elif not client_id and id:
                client_id = id

            if queue_id not in queues:
                db_queue = db.query(Queue).filter(Queue.queue_id == queue_id).first()
                if db_queue:
                    queues[queue_id] = {
                        "queue": db_queue.queue_data,
                        "connections": [],
                        "password": db_queue.password,
                        "removed_user": db_queue.removed_user,
                        "processing_times": db_queue.processing_times,
                        "last_processing_start": db_queue.last_processing_start,
                        "avg_time": db_queue.avg_time,
                        "messages": db_queue.messages,
                        "swap_requests": db_queue.swap_requests,
                    }
                else:
                    if queue_id != client_id:
                        await websocket.send_text("error: You can only create a queue with your own user ID")
                        await websocket.close()
                        return
                    queues[queue_id] = {
                        "queue": [],
                        "connections": [],
                        "password": password,
                        "removed_user": None,
                        "processing_times": [],
                        "last_processing_start": None,
                        "avg_time": None,
                        "messages": [],
                        "swap_requests": {},
                    }
                    new_db_queue = Queue(
                        queue_id=queue_id,
                        password=password,
                        queue_data=[],
                        processing_times=[],
                        avg_time=None,
                        messages=[],
                        swap_requests={},
                        removed_user=None,
                        last_processing_start=None
                    )
                    db.add(new_db_queue)
                    db.commit()
            else:
                if queues[queue_id]["password"] is not None:
                    if password != queues[queue_id]["password"]:
                        await websocket.send_text("error: Invalid password!")
                        await websocket.close()
                        raise WebSocketDisconnect(code=status.WS_1008_POLICY_VIOLATION, reason="error: Invalid password!")

            current_queue = queues[queue_id]["queue"]
            active_connections = queues[queue_id]["connections"]

            active_connections.append((websocket, client_id))
            
            try:
                await broadcast_queue(active_connections, current_queue, queues[queue_id].get("avg_time"))
                await websocket.send_json({
                    "type": "chat_history",
                    "data": queues[queue_id]["messages"][-50:]
                })
                
                while True:
                    data = await websocket.receive_text()

                    if int(time.time()) % 10 == 0:
                        current_time = time.time()
                        expired = [target_id for target_id, req in queues[queue_id]["swap_requests"].items() 
                                    if current_time - req["timestamp"] > 30]
                        
                        for target_id in expired:
                            sender_id = queues[queue_id]["swap_requests"][target_id]["from"]
                            del queues[queue_id]["swap_requests"][target_id]
                            await send_personal_message(sender_id, {"type": "swap_result", "status": "timeout"}, active_connections)
                            update_queue_in_db(queue_id)

                    if data.startswith("message:"):
                        message_text = data[len("message:"):].strip()
                        if message_text:
                            new_message = {
                                "user_id": client_id,
                                "text": message_text,
                                "timestamp": time.time(),
                            }
                            queues[queue_id]["messages"].append(new_message)
                            await broadcast_message(active_connections, new_message)
                            update_queue_in_db(queue_id)
                        if "/ai" in message_text:
                            parts = message_text.split("/ai", 1)
                            if len(parts) > 1:
                                ai_message = parts[1].strip()
                                if ai_message:
                                    try:
                                        gigachat_response = await send_message_to_gigachat(ai_message)
                                        new_message = {
                                            "user_id": "Gigachat",
                                            "text": gigachat_response,
                                            "timestamp": time.time(),
                                        }
                                        queues[queue_id]["messages"].append(new_message)
                                        await broadcast_message(active_connections, new_message)
                                        update_queue_in_db(queue_id)
                                    except Exception as e:
                                        await websocket.send_text(f"error: Gigachat error: {str(e)}")
                            continue
                    
                    if data == "join":
                        if client_id not in [user["client_id"] for user in queues[queue_id]["queue"]]:
                            queues[queue_id]["queue"].append({
                                "client_id": client_id,
                                "join_time": time.time()
                            })
                            await broadcast_queue(active_connections, queues[queue_id]["queue"], queues[queue_id].get("avg_time"))
                            update_queue_in_db(queue_id)
                        else:
                            await websocket.send_text("error: Already in queue!")
                    
                    elif data == "leave":
                        queues[queue_id]["queue"] = [
                            user for user in queues[queue_id]["queue"] 
                            if user["client_id"] != client_id
                        ]
                        await broadcast_queue(active_connections, queues[queue_id]["queue"], queues[queue_id].get("avg_time"))
                        update_queue_in_db(queue_id)

                    elif data == "delete":
                        if client_id == queue_id:
                            # Сохраняем копию подключений перед удалением
                            connections_to_close = list(active_connections)
                            
                            # Закрываем соединения перед удалением очереди
                            for connection, _ in connections_to_close:
                                try:
                                    await connection.send_text(f"delete_cookie:client_id_{queue_id}")
                                    await connection.send_text("info: Очередь была удалена создателем.")
                                    await connection.close()
                                except Exception as e:
                                    print(f"Ошибка при закрытии соединения: {str(e)}")
                                finally:
                                    if (connection, _) in active_connections:
                                        active_connections.remove((connection, _))
                            
                            # Удаляем очередь из памяти и БД
                            if queue_id in queues:
                                del queues[queue_id]
                            db.query(Queue).filter(Queue.queue_id == queue_id).delete()
                            db.commit()
                            
                            # Прерываем выполнение после удаления
                            return
                        else:
                            await websocket.send_text("error: Только создатель очереди может её удалить!")
                    
                    elif data == "next":
                        if client_id == queue_id:
                            queue_data = queues[queue_id]
                            if queue_data.get("last_processing_start"):
                                processing_time = time.time() - queue_data["last_processing_start"]
                                queue_data["processing_times"].append(processing_time)
                                queue_data["avg_time"] = sum(queue_data["processing_times"]) / len(queue_data["processing_times"])
                                await websocket.send_text(f"info: Processing time: {processing_time:.1f}s, Avg: {queue_data['avg_time']:.1f}s")

                            if queues[queue_id]["queue"]:
                                removed_user = queues[queue_id]["queue"].pop(0)
                                queue_data["removed_user"] = removed_user
                                queue_data["last_processing_start"] = time.time()
                                update_queue_in_db(queue_id)
                                await broadcast_queue(active_connections, queues[queue_id]["queue"], queue_data.get("avg_time"))
                                await websocket.send_text(f"info: Processing user {removed_user['client_id']}")
                            else:
                                queue_data["last_processing_start"] = None
                                await websocket.send_text("error: Queue is empty!")
                        else:
                            await websocket.send_text("error: Only queue owner can use 'next'!")

                    elif data == "undo":
                        if client_id == queue_id:  # Только создатель очереди
                            queue_data = queues[queue_id]
                            removed_user = queue_data["removed_user"]
                            
                            if not removed_user:
                                await websocket.send_text("error: Нет пользователя для возврата!")
                                return
                                
                            # Проверяем, что удаленный пользователь не в текущей очереди
                            user_in_queue = any(user["client_id"] == removed_user["client_id"] 
                                            for user in queue_data["queue"])
                            
                            if user_in_queue:
                                await websocket.send_text("error: Пользователь уже в очереди!")
                                return
                                
                            # Проверяем, что пользователь не присоединился заново
                            current_time = time.time()
                            rejoined = any(
                                user["client_id"] == removed_user["client_id"] and 
                                user["join_time"] > removed_user["join_time"]
                                for user in queue_data["queue"]
                            )
                            
                            if rejoined:
                                await websocket.send_text("error: Пользователь уже вернулся в очередь!")
                                return
                                
                            # Возвращаем пользователя
                            queues[queue_id]["queue"].insert(0, removed_user)
                            queues[queue_id]["removed_user"] = None
                            update_queue_in_db(queue_id)
                            
                            await broadcast_queue(active_connections, queues[queue_id]["queue"], queues[queue_id].get("avg_time"))
                            await websocket.send_text(f"info: Пользователь {removed_user['client_id']} возвращен")
                        else:
                            await websocket.send_text("error: Только создатель очереди может использовать 'undo'!")
                    
                    elif data.startswith("swap_request:"):
                        try:
                            target_id = data.split(":")[1].strip()
                            if queues[queue_id]["swap_requests"].get(target_id):
                                await websocket.send_text("error: User already has active request!")
                                return
                            
                            current_queue = queues[queue_id]["queue"]
                            sender_in_queue = any(user["client_id"] == client_id for user in current_queue)
                            target_in_queue = any(user["client_id"] == target_id for user in current_queue)
                            
                            if not sender_in_queue:
                                await websocket.send_text("error: You're not in queue!")
                            elif not target_in_queue:
                                await websocket.send_text("error: Target user not in queue!")
                            elif target_id == client_id:
                                await websocket.send_text("error: Can't swap with yourself!")
                            else:
                                queues[queue_id]["swap_requests"][target_id] = {
                                    "from": client_id,
                                    "timestamp": time.time()
                                }
                                update_queue_in_db(queue_id)
                                await send_personal_message(target_id, {
                                    "type": "swap_request",
                                    "from": client_id
                                }, active_connections)
                                await websocket.send_text("info: Swap request sent")
                        except Exception as e:
                            await websocket.send_text("error: Invalid swap request format")

                    elif data == "swap_accept":
                        await process_swap_response(client_id, queue_id, True, active_connections)
                        update_queue_in_db(queue_id)

                    elif data == "swap_decline":
                        await process_swap_response(client_id, queue_id, False, active_connections)
                        update_queue_in_db(queue_id)

            except WebSocketDisconnect:
                connection_pair = (websocket, client_id)
                if connection_pair in active_connections:
                    active_connections.remove(connection_pair)
                
                # Добавляем проверку существования очереди перед broadcast
                if queue_id in queues:
                    await broadcast_queue(active_connections, current_queue, queues[queue_id].get("avg_time"))
            except Exception as e:
                print(f"WebSocket error: {str(e)}")
        finally:
            db.close()

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
            
            queues[queue_id]["queue"][sender_idx], queues[queue_id]["queue"][target_idx] = queues[queue_id]["queue"][target_idx], queues[queue_id]["queue"][sender_idx]
            await broadcast_queue(active_connections, queues[queue_id]["queue"], queues[queue_id].get("avg_time"))
            
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
            avg_time = 0

        # Создаем копию списка для безопасной итерации
        connections = list(active_connections)
        
        for connection, _ in connections:
            try:
                # Проверяем состояние соединения
                if connection.client_state == "disconnected":
                    active_connections.remove((connection, _))
                    continue

                queue_info = []
                for idx, user in enumerate(current_queue):
                    expected_time = idx * avg_time
                    queue_info.append(f"{user['client_id']}:{expected_time:.1f} сек")
                
                await connection.send_text(f"queue:{','.join(queue_info)}")
            
            except (WebSocketDisconnect, RuntimeError):
                # Безопасное удаление несуществующих соединений
                try:
                    active_connections.remove((connection, _))
                except ValueError:
                    pass
            except Exception as e:
                print(f"Broadcast error: {str(e)}")

    async def broadcast_message(active_connections, message):
        connections = list(active_connections)
        
        for connection, _ in connections:
            try:
                if connection.client_state == "disconnected":
                    active_connections.remove((connection, _))
                    continue

                await connection.send_json({
                    "type": "new_message",
                    "data": {
                        "user_id": message["user_id"],
                        "text": message["text"],
                        "timestamp": message["timestamp"],
                    }
                })
            
            except (WebSocketDisconnect, RuntimeError):
                try:
                    active_connections.remove((connection, _))
                except ValueError:
                    pass
            except Exception as e:
                print(f"Message broadcast error: {str(e)}")

@router.get("/queue")
async def check_queue_existence(request: Request):
    auth_header = request.headers.get("New-Access-Token") or request.headers.get("Authorization")
    if not auth_header:
        raise HTTPException(status_code=401, detail="Missing token")
    
    try:
        token = auth_header.split(" ")[1]
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        access_user_id = payload.get("sub")
        
        db = SessionLocal()
        user = db.query(User).filter(User.id == int(access_user_id)).first()
        db.close()
        
        if not user:
            raise HTTPException(status_code=401, detail="Invalid user")
        
        db = SessionLocal()
        queue_in_db = db.query(Queue).filter(Queue.queue_id == access_user_id).first()
        db.close()
        
        if not queue_in_db:
            raise HTTPException(status_code=404, detail="Queue not found")
        
        return {
            "message": "Queue exists",
            "queue_id": access_user_id,
            "password": queue_in_db.password
        }
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")