from fastapi import APIRouter, Depends, HTTPException, Response, Request
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from app.core.security import (
    SECRET_KEY,
    ALGORITHM
)
from jose import jwt, ExpiredSignatureError, JWTError

router = APIRouter()

@router.post("/logout")
async def logout(response: Response, request: Request, db: Session = Depends(get_db)):

    auth_header = request.headers.get("New-Access-Token")
    if not auth_header:
        auth_header = request.headers.get("Authorization")
    
    access_token = auth_header.split(" ")[1]

    try:
        payload = jwt.decode(
            access_token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )
    except ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid token")

    access_user_id = payload.get("sub")
    
    user = db.query(User).filter(User.id == int(access_user_id)).first()
    if not user:
        raise HTTPException(status_code=401, detail="Пользователь не найден с таким ID!")
    
    response.delete_cookie(
        key="refresh_token",
        secure=True,  # Обязательно, если кука устанавливалась с secure=True
        httponly=True,  # Если использовалось при установке
    )

    return {
        "message": "Пользователь вышел из системы.",
    }
    
