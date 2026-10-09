import random
import string
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from app.database import get_db
from app.models import Group, GroupMember, PomodoroSession, User
from app.schemas import GroupCreateRequest
from app.auth_utils import get_current_user
from app.services.streak_service import award_xp

router = APIRouter(prefix="/api/groups", tags=["Groups / Squads"])

def generate_squad_code():
    return "".join(random.choices(string.ascii_uppercase + string.digits, k=6))

@router.get("")
def list_groups(db: Session = Depends(get_db)):
    groups = db.query(Group).options(
        joinedload(Group.members).joinedload(GroupMember.user)
    ).all()

    res = []
    for g in groups:
        res.append({
            "id": g.id,
            "name": g.name,
            "description": g.description,
            "avatar_url": g.avatar_url or f"https://api.dicebear.com/7.x/identicon/svg?seed={g.name}",
            "code": g.code,
            "member_count": len(g.members),
            "weekly_xp": g.weekly_xp,
            "leader_id": g.leader_id,
            "members": [
                {
                    "user_id": m.user.id,
                    "full_name": m.user.full_name,
                    "avatar_url": m.user.avatar_url,
                    "role": m.role,
                    "xp": m.user.xp
                } for m in g.members if m.user
            ]
        })
    return res

@router.post("")
def create_group(req: GroupCreateRequest, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    squad_code = generate_squad_code()
    group = Group(
        name=req.name,
        description=req.description,
        avatar_url=f"https://api.dicebear.com/7.x/identicon/svg?seed={req.name}",
        code=squad_code,
        leader_id=user.id,
        member_count=1,
        weekly_xp=user.xp
    )
    db.add(group)
    db.commit()
    db.refresh(group)

    member = GroupMember(group_id=group.id, user_id=user.id, role="leader")
    db.add(member)
    db.commit()

    return {
        "id": group.id,
        "name": group.name,
        "description": group.description,
        "code": group.code,
        "weekly_xp": group.weekly_xp
    }

@router.post("/{id}/join")
def join_group(id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    group = db.query(Group).filter(Group.id == id).first()
    if not group:
        raise HTTPException(status_code=404, detail="Squad not found")

    existing = db.query(GroupMember).filter(GroupMember.group_id == id, GroupMember.user_id == user.id).first()
    if not existing:
        gm = GroupMember(group_id=id, user_id=user.id, role="member")
        db.add(gm)
        group.member_count += 1
        group.weekly_xp += user.xp
        db.commit()

    return {"status": "success", "message": f"Joined squad '{group.name}'!"}

@router.post("/{id}/pomodoro")
def log_pomodoro(id: int, payload: dict, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    duration = payload.get("duration_mins", 25)
    subject = payload.get("subject", "Focus Study Session")

    pomo = PomodoroSession(
        group_id=id,
        user_id=user.id,
        subject=subject,
        duration_mins=duration,
        status="completed"
    )
    db.add(pomo)
    
    # Update squad weekly XP
    group = db.query(Group).filter(Group.id == id).first()
    if group:
        group.weekly_xp += 50

    updated_user = award_xp(db, user, 50, category="general")
    db.commit()

    return {
        "status": "success",
        "xp_earned": 50,
        "user_xp": updated_user.xp,
        "squad_xp": group.weekly_xp if group else 0
    }
