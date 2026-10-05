import os
from dotenv import load_dotenv
from pwdlib import PasswordHash
from jose import jwt, JWTError
from datetime import datetime, timedelta, timezone
load_dotenv()

password_hash = PasswordHash.recommended()

SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    raise ValueError("Secret key is not configured")
ALGORITHM = "HS256"

def hash_password(password: str) -> str:
    return password_hash.hash(password)

def verify_password(password: str, hashed_password: str) -> bool:
    return password_hash.verify(password, hashed_password)

def create_access_token(user_id: int):
    expiration_time = datetime.now(timezone.utc) + timedelta(minutes=30)
    data = {
        "user_id": user_id,
        "exp": expiration_time
    }
    token = jwt.encode(
        data, 
        SECRET_KEY, 
        algorithm=ALGORITHM
    )
    return token

def decode_access_token(token: str):
    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )
        return payload  
    except JWTError:
        return None
