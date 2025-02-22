from fastapi import WebSocket, WebSocketDisconnect, APIRouter, Depends, HTTPException
from app.schemas.user import UserLogin
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from app.core.security import verify_password, create_access_token, create_refresh_token

router = APIRouter()

@router.post("/login")
async def login(user: UserLogin, db: Session = Depends(get_db)):
    user_bd = db.query(User).filter((User.email == user.username) | (User.username == user.username)).first()

    if not user_bd:
        raise HTTPException(status_code=401, detail="Пользователь не найден!")
    
    if not verify_password(user.password, user_bd.hashed_password):
        raise HTTPException(status_code=401, detail="Пароль введен неверно!")
    
    access_token = create_access_token(data={"sub": user_bd.username})
    refresh_token = create_refresh_token(data={"sub": user_bd.username})

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }
    
