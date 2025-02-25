from fastapi import WebSocket, WebSocketDisconnect, APIRouter, HTTPException
import uuid
from app.core.security import verify_refresh_token
from app.core.database import get_db
from app.models.user import User
from sqlalchemy.orm import Session

router = APIRouter()

# Глобальные переменные для хранения очереди и подключений
queues = {}

@router.websocket("/queue/{queue_id}")
async def websocket_endpoint(websocket: WebSocket, queue_id: str):
    await websocket.accept()

    db: Session = next(get_db())
    
    # Генерация client_id
    client_id = websocket.cookies.get("client_id")

    refresh_token = websocket.cookies.get("refresh_token")

    payload = verify_refresh_token(refresh_token)
    if not payload:
        raise HTTPException(status_code=401, detail="Недействительный refresh token")
    id = payload.get("sub")

    user = db.query(User).filter(User.id == id).first()
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
        if queue_id != id:
            await websocket.send_text("error: You can only create a queue with your own user ID")
            await websocket.close()
            return
        queues[queue_id] = {
            "queue": set(),
            "connections": []
        }

    current_queue = queues[queue_id]["queue"]
    active_connections = queues[queue_id]["connections"]

    try:
        # Добавляем подключение в список
        active_connections.append((websocket, client_id))
        
        while True:
            data = await websocket.receive_text()
            
            if data == "join":
                if client_id not in current_queue:
                    current_queue.add(client_id)
                    await broadcast_queue(active_connections, current_queue)
                else:
                    await websocket.send_text("error: Вы уже в очереди!")
            
            elif data == "leave":
                if client_id in current_queue:
                    current_queue.remove(client_id)
                    await broadcast_queue(active_connections, current_queue)

    except WebSocketDisconnect:
        # Удаляем подключение при разрыве
        active_connections.remove((websocket, client_id))
        if client_id in current_queue:
            current_queue.remove(client_id)
            await broadcast_queue(active_connections, current_queue)

async def broadcast_queue(active_connections, current_queue):
    for connection, _ in list(active_connections):
        try:
            await connection.send_text(f"queue:{','.join(current_queue)}")
        except WebSocketDisconnect:
            try:
                active_connections.remove((connection, _))
            except ValueError:
                pass