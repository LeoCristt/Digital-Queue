from fastapi import WebSocket, WebSocketDisconnect, APIRouter, Depends, HTTPException
from app.schemas.user import UserCreate
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from app.core.security import get_password_hash

router = APIRouter()

@router.post("/register")
async def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user_email = db.query(User).filter(User.email == user.email).first()
    db_user_username = db.query(User).filter(User.username == user.username).first()
    if db_user_email or db_user_username:
        raise HTTPException(status_code=400, detail="Почта или логин уже зарезервированы!")
    
    # Хэширование пароля
    hashed_password = get_password_hash(user.password)
    
    # Создание нового пользователя
    db_user = User(email=user.email, username=user.username, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return {"message": "Пользователь зарегестирован."}