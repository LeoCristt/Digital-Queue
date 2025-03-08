from pydantic import BaseModel, EmailStr, field_validator, constr

# Базовая схема для пользователя
class SettingsPut(BaseModel):
    email: EmailStr
    username: str
    password: str

class PasswordUpdate(BaseModel):
    old_password: str
    new_password: constr(min_length=8)

    @field_validator('new_password')
    def validate_new_password(cls, v, values):
        if len(v) < 8:
            raise ValueError('Новый пароль должен быть не менее 8 символов')
        if v == values.data.get('old_password'):
            raise ValueError('Новый пароль должен отличаться от старого')
        return v

class UsernameUpdate(BaseModel):
    new_username: constr(min_length=3, max_length=50)

    @field_validator('new_username')
    def validate_new_username(cls, v):
        if not v.strip():
            raise ValueError("Имя пользователя не может быть пустым")
        if ' ' in v:
            raise ValueError("Имя пользователя не должно содержать пробелов")
        return v