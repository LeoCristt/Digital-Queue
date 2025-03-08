from pydantic import BaseModel, field_validator

# Базовая схема для пользователя
class feedbackAdd(BaseModel):
    description: str

class feedbackAddWithDescriptionValidation(feedbackAdd):
    @field_validator('description')
    def validate_description_length_down(cls, v):
        if len(v) < 1:
            raise ValueError('ensure this value has at least 1 character')
        return v
    @field_validator('description')
    def validate_description_length_up(cls, v):
        if len(v) > 1000:
            raise ValueError('ensure this value has at most 1000 characters')
        return v