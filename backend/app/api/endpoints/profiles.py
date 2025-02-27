from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User

router = APIRouter()

@router.post("/profiles/{user_id}")
async def profiles(user_id: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == int(user_id)).first()
    if not user:
        raise HTTPException(status_code=400, detail="Пользователь не найден с таким ID!")
    
    return {
        "message": "Данные профиля запрошенного пользователя.",
        "username": user.username,
        "avatar_url": f"http://localhost:8000{user.avatar_url}"
    }