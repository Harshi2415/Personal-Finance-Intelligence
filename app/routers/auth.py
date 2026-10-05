from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User
from app.security import verify_password, create_access_token

router = APIRouter()

@router.post("/login")
def login(
    login_data: OAuth2PasswordRequestForm = Depends(),
    db: Session =  Depends(get_db)
):
    existing_user = (
        db.query(User).filter(
            User.email == login_data.username
        ).first()
    )

    if existing_user is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    password_correct = verify_password(
        login_data.password,
        existing_user.password_hash   
    )

    if not password_correct:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    token = create_access_token(existing_user.id)

    return{
        "access_token" : token,
        "token_type" : "bearer"
    }