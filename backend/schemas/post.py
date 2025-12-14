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


class PaginatedPostResponse(BaseModel):
    posts: list[PostResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
    has_next: bool
    has_previous: bool
