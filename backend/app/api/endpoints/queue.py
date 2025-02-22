from fastapi import WebSocket, WebSocketDisconnect, APIRouter
import uuid

router = APIRouter()

# Глобальные переменные для хранения очереди и подключений
queue = set()
active_connections = []  # Теперь объявлена глобально

@router.websocket("/queue")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    
    # Используем global для работы с глобальной переменной
    global active_connections
    
    # Генерация client_id
    client_id = websocket.cookies.get("client_id")
    if not client_id:
        client_id = str(uuid.uuid4())
        try:
            await websocket.send_text(f"set_cookie:client_id={client_id}")
        except WebSocketDisconnect:
            return  # Выход, если соединение закрыто

    try:
        # Добавляем подключение в список
        active_connections.append((websocket, client_id))
        
        while True:
            data = await websocket.receive_text()
            
            if data == "join":
                if client_id not in queue:
                    queue.add(client_id)
                    await broadcast_queue()
                else:
                    await websocket.send_text("error: Вы уже в очереди!")
            
            elif data == "leave":
                if client_id in queue:
                    queue.remove(client_id)
                    await broadcast_queue()

    except WebSocketDisconnect:
        # Удаляем подключение при разрыве
        active_connections = [conn for conn in active_connections if conn[0] != websocket]
        if client_id in queue:
            queue.remove(client_id)
            await broadcast_queue()

async def broadcast_queue():
    global active_connections
    for connection, _ in active_connections:
        try:
            await connection.send_text(f"queue:{','.join(queue)}")
        except WebSocketDisconnect:
            # Удаляем закрытые подключения
            active_connections = [conn for conn in active_connections if conn[0] != connection]