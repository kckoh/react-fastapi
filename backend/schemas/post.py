from datetime import datetime

from pydantic import BaseModel

from schemas.user import UserResponse


class PostResponse(BaseModel):
    id: int
    title: str
    content: str
    author: UserResponse
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class PostRequest(BaseModel):
    title: str
    content: str
