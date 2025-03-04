from fastapi import APIRouter, Depends, HTTPException, Request, UploadFile, File
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from app.core.security import (
    SECRET_KEY,
    ALGORITHM,
    verify_password
)
from jose import jwt
from app.schemas.settings import SettingsPut
import os
import shutil

AVATAR_DIR = "static/avatars"

router = APIRouter()

@router.get("/{user_id}/settings")
async def get_settings(request: Request, user_id: str, db: Session = Depends(get_db)):

    auth_header = request.headers.get("New-Access-Token")
    if not auth_header:
        auth_header = request.headers.get("Authorization")
    
    access_token = auth_header.split(" ")[1]

    payload = jwt.decode(
        access_token,
        SECRET_KEY,
        algorithms=[ALGORITHM]
    )

    access_user_id = payload.get("sub")
    
    if user_id != access_user_id:
        raise HTTPException(status_code=400, detail="Несанкционированный доступ!")
    
    user = db.query(User).filter(User.id == int(user_id)).first()
    if not user:
        raise HTTPException(status_code=400, detail="Пользователь не найден с таким ID!")
    
    return {
        "message": "Данные для настроек запрошенного пользователя.",
        "username": user.username,
        "avatar_url": f"http://localhost:8000{user.avatar_url}",
        "email": user.email
    }

@router.put("/{user_id}/settings")
async def put_settings(request: Request, user_id: str, settings: SettingsPut, db: Session = Depends(get_db), file: UploadFile = File(default="default_avatar.png")):

    auth_header = request.headers.get("New-Access-Token")
    if not auth_header:
        auth_header = request.headers.get("Authorization")
    
    access_token = auth_header.split(" ")[1]

    payload = jwt.decode(
        access_token,
        SECRET_KEY,
        algorithms=[ALGORITHM]
    )

    access_user_id = payload.get("sub")
    
    if user_id != access_user_id:
        raise HTTPException(status_code=400, detail="Несанкционированный доступ!")
    
    user = db.query(User).filter(User.id == int(user_id)).first()
    if not user:
        raise HTTPException(status_code=400, detail="Пользователь не найден с таким ID!")
    
    if not verify_password(settings.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Пароль введен неверно!")
    
        # Проверка типа файла
    allowed_types = ["image/jpeg", "image/png", "image/webp"]
    if file.content_type not in allowed_types:
        raise HTTPException(400, "Допустимые форматы: JPEG, PNG, WEBP")

    # Генерируем уникальное имя файла
    base_filename = f"avatar_{user_id}"
    filename = base_filename + f".{file.filename.split('.')[-1]}"
    file_path = os.path.join(AVATAR_DIR, filename)

    try:
        # Ищем все файлы, начинающиеся с базового имени
        for existing_file in os.listdir(AVATAR_DIR):
            if existing_file.startswith(base_filename):
                os.remove(os.path.join(AVATAR_DIR, existing_file))
    except Exception as e:
        raise HTTPException(500, f"Ошибка при удалении старых файлов: {str(e)}")

    # Сохраняем файл
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    user.avatar_url = f"/{AVATAR_DIR}/{filename}"
    user.email = settings.email
    user.username = settings.username

    db.commit()
    db.refresh(user)
    
    return {
        "message": "Настройки были обновлены."
    }