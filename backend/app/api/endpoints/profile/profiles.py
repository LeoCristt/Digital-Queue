from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User

router = APIRouter()

@router.get("/{user_id}")
async def profiles(user_id: str, db: Session = Depends(get_db)):
    try:
        int_user_id = int(user_id)
    except:
        raise HTTPException(status_code=422, detail="type=value_error")
    
    user = db.query(User).filter(User.id == int_user_id).first()
    if not user:
        raise HTTPException(status_code=400, detail="Пользователь не найден с таким ID!")
    
    avatar_url = f"http://localhost:8000{user.avatar_url}" if user.avatar_url else None
    
    return {
        "message": "Данные профиля запрошенного пользователя.",
        "username": user.username,
        "avatar_url": avatar_url
    }