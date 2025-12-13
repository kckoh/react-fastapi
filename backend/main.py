from typing import Optional

from database import get_db
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from models import User
from pydantic import BaseModel
from sqlalchemy.orm import Session

# Create FastAPI app
app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite default + React default
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allows all headers
)


# Route 1: Test database connection
@app.get("/")
def read_root():
    return {"message": "Connected to FastAPI + PostgreSQL"}


# create the User DTO
class UserCreate(BaseModel):
    email: str
    password: str


# Route 2: Create a user
@app.post("/api/signup/")
def create_user(
    user: UserCreate, db: Session = Depends(get_db), status_code=status.HTTP_201_CREATED
):
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered"
        )

    # Create new user
    new_user = User(email=user.email, password=user.password)

    # Add to database
    db.add(new_user)
    db.commit()
    db.refresh(new_user)  # Get the ID that was auto-generated

    # return status code
    return {
        "id": new_user.id,
        "email": new_user.email,
        "message": "User created successfully",
    }


# Route 3: Get all users
@app.get("/users/")
def get_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return users


# Route 4: Get user by ID
@app.get("/users/{user_id}")
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return {"error": "User not found"}
    return user
