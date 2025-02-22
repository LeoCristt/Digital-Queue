from fastapi import FastAPI, Depends, HTTPException, status, APIRouter
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from app.core.security import create_access_token, SECRET_KEY, ALGORITHM

router = APIRouter()

@router.post("/refresh")
def refresh_access_token(refresh_token: str):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Ошибка валидации!"
    )
    try:
        payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    # Создание нового Access Token
    access_token = create_access_token(data={"sub": username})
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,  # Можно вернуть новый Refresh Token, если нужно
        "token_type": "bearer"
    }