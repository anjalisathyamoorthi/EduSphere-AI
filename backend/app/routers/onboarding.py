from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, Profile
from app.schemas import OnboardingData
from app.auth_utils import get_current_user

router = APIRouter(prefix="/api/onboarding", tags=["Onboarding"])

@router.post("")
def update_onboarding(data: OnboardingData, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = db.query(Profile).filter(Profile.user_id == user.id).first()
    if not profile:
        profile = Profile(user_id=user.id)
        db.add(profile)

    profile.branch = data.branch
    profile.year = data.year
    profile.college = data.college
    profile.target_goals = data.target_goals
    profile.daily_time_target_mins = data.daily_time_target_mins

    db.commit()
    db.refresh(profile)

    return {
        "status": "success",
        "message": "Onboarding completed successfully!",
        "profile": {
            "branch": profile.branch,
            "year": profile.year,
            "college": profile.college,
            "target_goals": profile.target_goals,
            "daily_time_target_mins": profile.daily_time_target_mins
        }
    }
