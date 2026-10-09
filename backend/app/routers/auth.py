from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from app.database import get_db
from app.models import User, Profile
from app.schemas import UserSignup, UserLogin, Token
from app.auth_utils import verify_password, get_password_hash, create_access_token, get_current_user

router = APIRouter(prefix="/api/auth", tags=["Auth"])

@router.post("/signup", response_model=Token)
def signup(data: UserSignup, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(
        email=data.email,
        hashed_password=get_password_hash(data.password),
        full_name=data.full_name,
        avatar_url=f"https://api.dicebear.com/7.x/avataaars/svg?seed={data.full_name.replace(' ', '')}",
        xp=150,
        level=1,
        streak_count=1
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    profile = Profile(
        user_id=user.id,
        branch=data.branch or "Computer Science & Engineering",
        year=data.year or "3rd Year",
        college="IIT / NIT / B.Tech Institute"
    )
    db.add(profile)
    db.commit()

    token = create_access_token({"sub": user.email})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "avatar_url": user.avatar_url,
            "xp": user.xp,
            "level": user.level,
            "streak_count": user.streak_count,
            "branch": profile.branch,
            "year": profile.year
        }
    }

@router.post("/login", response_model=Token)
def login(data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).options(joinedload(User.profile)).filter(User.email == data.email).first()
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token({"sub": user.email})
    branch = user.profile.branch if user.profile else "Computer Science"
    year = user.profile.year if user.profile else "3rd Year"
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "avatar_url": user.avatar_url,
            "xp": user.xp,
            "level": user.level,
            "streak_count": user.streak_count,
            "branch": branch,
            "year": year
        }
    }

@router.get("/me")
def get_me(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = db.query(Profile).filter(Profile.user_id == user.id).first()
    return {
        "id": user.id,
        "email": user.email,
        "full_name": user.full_name,
        "avatar_url": user.avatar_url,
        "xp": user.xp,
        "level": user.level,
        "streak_count": user.streak_count,
        "profile": {
            "branch": profile.branch if profile else "Computer Science & Engineering",
            "year": profile.year if profile else "3rd Year",
            "college": profile.college if profile else "NIT",
            "target_goals": profile.target_goals if profile else "DSA, Dev",
            "daily_time_target_mins": profile.daily_time_target_mins if profile else 45,
            "bio": profile.bio if profile else "",
            "github_url": profile.github_url if profile else "",
            "linkedin_url": profile.linkedin_url if profile else ""
        }
    }
