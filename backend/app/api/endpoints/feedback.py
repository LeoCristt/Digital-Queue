from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from app.models.feedback import Feedback
from app.core.security import (
    SECRET_KEY,
    ALGORITHM,
)
from jose import jwt
from app.schemas.feedback import feedbackAddWithDescriptionValidation

router = APIRouter()

@router.post("/feedback")
async def feedback(request: Request, data: feedbackAddWithDescriptionValidation, db: Session = Depends(get_db)):

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
    
    user = db.query(User).filter(User.id == int(access_user_id)).first()
    if not user:
        raise HTTPException(status_code=400, detail="Пользователь не найден с таким ID!")
    
    db_feedback = Feedback(user_id=user.id, description=data.description)
    db.add(db_feedback)
    db.commit()
    db.refresh(db_feedback)
    
    return {
        "message": "Отзыв принят.",
    }