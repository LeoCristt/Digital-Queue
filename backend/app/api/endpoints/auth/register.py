from fastapi import APIRouter, Depends, HTTPException, Response
from app.schemas.user import UserCreateWithPasswordValidation
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from app.core.security import get_password_hash
from app.core.security import create_access_token, create_refresh_token, REFRESH_TOKEN_EXPIRE_DAYS

router = APIRouter()

@router.post("/register")
async def register(response: Response, user: UserCreateWithPasswordValidation, db: Session = Depends(get_db)):
    if user.password != user.re_password:
        raise HTTPException(status_code=400, detail="Пароли не совпадают!")
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

        # Генерируем токены для нового пользователя
    access_token = create_access_token(data={"sub": str(db_user.id)})
    refresh_token = create_refresh_token(data={"sub": str(db_user.id)})
    
    # Устанавливаем refresh token в куки
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        max_age=REFRESH_TOKEN_EXPIRE_DAYS * 24 * 3600,
        secure=True
    )
    
    return {
        "message": "Пользователь зарегистрирован и авторизован.",
        "access_token": access_token,
        "token_type": "bearer"
    }