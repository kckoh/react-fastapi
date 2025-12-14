from datetime import datetime

from pydantic import BaseModel
from schemas.user import UserResponse


class CommentCreate(BaseModel):
    content: str


class CommentResponse(BaseModel):
    id: int
    content: str
    author: UserResponse
    created_at: datetime

    class Config:
        from_attributes = True
