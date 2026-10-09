from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from app.database import get_db
from app.models import Mission, UserMission, User
from app.auth_utils import get_current_user
from app.services.streak_service import award_xp

router = APIRouter(prefix="/api/missions", tags=["Missions"])

@router.get("")
def get_missions(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    missions = db.query(Mission).options(joinedload(Mission.tasks)).all()
    user_missions = db.query(UserMission).filter(UserMission.user_id == user.id).all()
    um_map = {um.mission_id: um for um in user_missions}

    results = []
    for m in missions:
        um = um_map.get(m.id)
        status = um.status if um else "in_progress"
        progress_pct = um.progress_pct if um else 0.0
        
        results.append({
            "id": m.id,
            "title": m.title,
            "description": m.description,
            "duration_mins": m.duration_mins,
            "xp_reward": m.xp_reward,
            "category": m.category,
            "is_daily": m.is_daily,
            "status": status,
            "progress_pct": progress_pct,
            "tasks": [
                {
                    "id": t.id,
                    "task_text": t.task_text,
                    "is_completed_default": t.is_completed_default
                } for t in m.tasks
            ]
        })
    return results

@router.post("/{id}/claim")
def claim_mission(id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    mission = db.query(Mission).filter(Mission.id == id).first()
    if not mission:
        raise HTTPException(status_code=404, detail="Mission not found")

    um = db.query(UserMission).filter(UserMission.user_id == user.id, UserMission.mission_id == id).first()
    if not um:
        um = UserMission(user_id=user.id, mission_id=id, status="claimed", progress_pct=100.0)
        db.add(um)
    else:
        if um.status == "claimed":
            return {"status": "already_claimed", "message": "Mission XP already claimed today!"}
        um.status = "claimed"
        um.progress_pct = 100.0

    updated_user = award_xp(db, user, mission.xp_reward, category="mission")

    return {
        "status": "success",
        "xp_earned": mission.xp_reward,
        "total_xp": updated_user.xp,
        "level": updated_user.level,
        "streak_count": updated_user.streak_count
    }
