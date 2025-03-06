from pydantic import BaseModel, EmailStr

# Базовая схема для пользователя
class SettingsPut(BaseModel):
    email: EmailStr
    username: str
    password: str