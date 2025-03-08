from pydantic import BaseModel, EmailStr
from pydantic import field_validator

# Базовая схема для пользователя
class UserBase(BaseModel):
    email: EmailStr
    username: str

# Схема для создания пользователя (регистрация)
class UserCreate(UserBase):
    password: str
    re_password: str

# Схема для аутентификации
class UserLogin(BaseModel):
    username: str  # Может быть email или username
    password: str

# Схема для возврата информации о пользователе
class User(UserBase):
    id: int
    is_active: bool

    class Config:
        from_attributes = True  # Ранее orm_mode = True

class UserCreateWithPasswordValidation(UserCreate):
    @field_validator('password')
    def validate_password_length(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters')
        return v

class UserLoginWithPasswordValidation(UserLogin):
    @field_validator('password')
    def validate_password_length(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters')
        return v
    
    @field_validator('username')
    def username_not_empty(cls, v):
        if not v.strip():
            raise ValueError("field required")
        return v