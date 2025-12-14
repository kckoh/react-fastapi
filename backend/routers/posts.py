from database import get_db
from dependencies import get_current_user_id
from fastapi import APIRouter, Depends, HTTPException, status
from models import Post
from schemas.post import PostRequest, PostResponse
from sqlalchemy.orm import Session, joinedload

router = APIRouter()


@router.get("/", response_model=list[PostResponse])
def get_posts(db: Session = Depends(get_db)):
    # Use joinedload to fetch author in the same query (avoids N+1 problem)
    posts = db.query(Post).options(joinedload(Post.author)).all()
    return posts


@router.get("/{id}", response_model=PostResponse)
def get_post_detail(id: int, db: Session = Depends(get_db)):
    post = (
        db.query(Post)
        .options(joinedload(Post.author))
        .filter(Post.id == id)
        .first()
    )

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
