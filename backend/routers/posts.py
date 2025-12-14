from math import ceil

from database import get_db
from dependencies import get_current_user_id
from fastapi import APIRouter, Depends, HTTPException, Query, status
from models import Post
from schemas.post import PaginatedPostResponse, PostRequest, PostResponse
from sqlalchemy import func
from sqlalchemy.orm import Session, joinedload

router = APIRouter()


@router.get("/", response_model=PaginatedPostResponse)
def get_posts(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(10, ge=1, le=100, description="Items per page"),
    db: Session = Depends(get_db),
):
    # Calculate offset
    offset = (page - 1) * page_size

    #  Get total count
    #  Different methods:
    # .all()     → [(15,)]           # List of tuples
    # .first()   → (15,)             # Single tuple
    # .scalar()  → 15                # Single value
    total = db.query(func.count(Post.id)).scalar()

    # Get paginated posts
    posts = (
        db.query(Post)
        .options(joinedload(Post.author))
        .order_by(Post.created_at.desc())
        .offset(offset)
        .limit(page_size)
        .all()
    )

    # Calculate pagination metadata
    total_pages = ceil(total / page_size)

    return PaginatedPostResponse(
        posts=posts,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
        has_next=page < total_pages,
        has_previous=page > 1,
    )


@router.get("/{id}", response_model=PostResponse)
def get_post_detail(id: int, db: Session = Depends(get_db)):
    post = db.query(Post).options(joinedload(Post.author)).filter(Post.id == id).first()

    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Post with id {id} not found",
        )

    return post


@router.post("/", response_model=PostResponse, status_code=status.HTTP_201_CREATED)
def create_post(
    post: PostRequest,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id),
):
    # Dependency automatically validates session and returns user_id
    # If we reach here, user is authenticated

    new_post = Post(title=post.title, content=post.content, author_id=current_user_id)

    db.add(new_post)
    db.commit()
    db.refresh(new_post)

    # Load the author relationship for PostResponse
    db.refresh(new_post, ["author"])

    return new_post
