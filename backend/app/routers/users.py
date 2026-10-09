from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, Profile
from app.schemas import ProfileUpdate
from app.auth_utils import get_current_user

router = APIRouter(prefix="/api/users", tags=["Users"])

@router.get("/profile")
def get_profile(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = db.query(Profile).filter(Profile.user_id == user.id).first()
    return {
        "id": user.id,
        "email": user.email,
        "full_name": user.full_name,
        "avatar_url": user.avatar_url,
        "xp": user.xp,
        "level": user.level,
        "streak_count": user.streak_count,
        "branch": profile.branch if profile else "Computer Science & Engineering",
        "year": profile.year if profile else "3rd Year",
        "college": profile.college if profile else "NIT",
        "target_goals": profile.target_goals if profile else "DSA, Full Stack",
        "daily_time_target_mins": profile.daily_time_target_mins if profile else 45,
        "bio": profile.bio if profile else "",
        "github_url": profile.github_url if profile else "",
        "linkedin_url": profile.linkedin_url if profile else ""
    }

@router.put("/profile")
def update_profile(data: ProfileUpdate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = db.query(Profile).filter(Profile.user_id == user.id).first()
    if not profile:
        profile = Profile(user_id=user.id)
        db.add(profile)

    for field, val in data.dict(exclude_unset=True).items():
        if val is not None:
            setattr(profile, field, val)

    db.commit()
    return {"status": "success", "message": "Profile updated successfully!"}
