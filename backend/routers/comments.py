from os.path import curdir

from database import get_db
from dependencies import get_current_user
from fastapi import APIRouter, Depends, HTTPException
from models import Comment, User
from schemas.comment import CommentCreate, CommentResponse
from sqlalchemy.orm import Session

router = APIRouter()


@router.get("/{post_id}/comments", response_model=list[CommentResponse])
def get_comments(post_id: int, db: Session = Depends(get_db)):
    comments = db.query(Comment).all()
    return comments


@router.post("/{post_id}/comments", response_model=CommentResponse)
def create_comment(
    comment: CommentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    c = Comment(
        comment=comment.content, author_id=current_user.id, post_id=comment.postId
    )

    if not c:
        raise HTTPException(status_code=404, detail="Comment cannot be created.")

    db.add(c)
    db.commit()
    db.refresh(c)

    return CommentResponse(
        content=c.commen,
        email=current_user.email,
    )

    # if not user:
    # return user
