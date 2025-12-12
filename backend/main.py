from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from database import engine, get_db, Base
from models import User

# Create FastAPI app
app = FastAPI()

# Create all tables in database
Base.metadata.create_all(bind=engine)

# Route 1: Test database connection
@app.get("/")
def read_root():
    return {"message": "Connected to FastAPI + PostgreSQL"}

# Route 2: Create a user
@app.post("/users/")
def create_user(name: str, email: str, db: Session = Depends(get_db)):
    # Create new user
    new_user = User(name=name, email=email)

    # Add to database
    db.add(new_user)
    db.commit()
    db.refresh(new_user)  # Get the ID that was auto-generated

    return {"id": new_user.id, "name": new_user.name, "email": new_user.email}

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
