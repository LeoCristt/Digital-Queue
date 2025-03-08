from fastapi import APIRouter, Depends, HTTPException, Response
from app.schemas.user import UserLoginWithPasswordValidation
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from app.core.security import verify_password, create_access_token, create_refresh_token, REFRESH_TOKEN_EXPIRE_DAYS

router = APIRouter()

@router.post("/login")
async def login(response: Response, user: UserLoginWithPasswordValidation, db: Session = Depends(get_db)):
    user_bd = db.query(User).filter((User.email == user.username) | (User.username == user.username)).first()

    if not user_bd:
        raise HTTPException(status_code=400, detail="Пользователь не найден!")
    
    if not verify_password(user.password, user_bd.hashed_password):
        raise HTTPException(status_code=400, detail="Пароль введен неверно!")
    
    access_token = create_access_token(data={"sub": str(user_bd.id)})
    refresh_token = create_refresh_token(data={"sub": str(user_bd.id)})

    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        max_age=REFRESH_TOKEN_EXPIRE_DAYS * 24 * 3600,
        secure=True  # Для HTTPS
    )

    return {
        "message": "Пользователь авторизован.",
        "access_token": access_token,
        "token_type": "bearer"
    }
    
