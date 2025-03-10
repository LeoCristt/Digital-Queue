from sqlalchemy import Column, Integer, String, JSON, Float
from app.models.base import Base

class Queue(Base):
    __tablename__ = "queues"

    id = Column(Integer, primary_key=True)
    queue_id = Column(String, unique=True, nullable=False)
    password = Column(String)
    queue_data = Column(JSON, default=[])
    processing_times = Column(JSON, default=[])
    avg_time = Column(Float)
    messages = Column(JSON, default=[])
    swap_requests = Column(JSON, default={})
    removed_user = Column(JSON)
    last_processing_start = Column(Float)