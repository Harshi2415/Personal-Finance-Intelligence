from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.database import get_db
from app.models import User
from app.schemas import UserCreate, UserResponse, UserUpdate
from app.security import hash_password
from app.dependencies import get_current_user

router = APIRouter()

@router.post("/users", response_model=UserResponse)
def create_user(
    user: UserCreate,
    db: Session = Depends(get_db)
):
    new_user = User(
        name=user.name,
        email=user.email,
        password_hash=hash_password(user.password),
        currency=user.currency
    )
    try:
        db.add(new_user)
        db.commit()
        db.refresh(new_user)

    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="An account with this email already exists."
        )

    return new_user


@router.get("/users/me", response_model=UserResponse)
def get_current_user_profile(
    current_user: User = Depends(get_current_user)
):
    return current_user


@router.put("/users/{user_id}", response_model=UserResponse)
def update_user(
    user_id: int,
    user: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if user_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="You can only update your own profile"
        )

    existing_user = db.query(User).filter(
        User.id == current_user.id
    ).first()

    if existing_user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    if user.name is not None:
        existing_user.name = user.name
    if user.email is not None:
        existing_user.email = user.email
    if user.currency is not None:
        existing_user.currency = user.currency

    db.commit()
    db.refresh(existing_user)

    return existing_user


@router.delete("/users/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if user_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="You can only delete your own account"
        )

    existing_user = db.query(User).filter(
        User.id == current_user.id
    ).first()

    if existing_user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    db.delete(existing_user)
    db.commit()

    return {"message": "User deleted successfully"}