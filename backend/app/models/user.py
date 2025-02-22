from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import declarative_base

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)  # Новое поле
    hashed_password = Column(String, nullable=False)

    def __repr__(self):
        return f"<User(id={self.id}, email={self.email}, username={self.username})>"