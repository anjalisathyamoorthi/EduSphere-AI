import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from app.database import get_db
from app.models import LearningTrack, LearningModule, Topic, User
from app.auth_utils import get_current_user
from app.services.streak_service import award_xp

router = APIRouter(prefix="/api/learning", tags=["Learning"])

@router.get("/tracks")
def get_tracks(branch: str = None, db: Session = Depends(get_db)):
    query = db.query(LearningTrack).options(
        joinedload(LearningTrack.modules).joinedload(LearningModule.topics)
    )
    if branch:
        query = query.filter(LearningTrack.branch == branch)
    tracks = query.all()
    
    result = []
    for tr in tracks:
        result.append({
            "id": tr.id,
            "title": tr.title,
            "slug": tr.slug,
            "branch": tr.branch,
            "description": tr.description,
            "icon": tr.icon,
            "level": tr.level,
            "xp_reward": tr.xp_reward,
            "total_modules": len(tr.modules),
            "modules": [
                {
                    "id": m.id,
                    "title": m.title,
                    "description": m.description,
                    "order": m.order,
                    "topics_count": len(m.topics)
                } for m in tr.modules
            ]
        })
    return result

@router.get("/tracks/{slug}")
def get_track_detail(slug: str, db: Session = Depends(get_db)):
    track = db.query(LearningTrack).options(
        joinedload(LearningTrack.modules).joinedload(LearningModule.topics)
    ).filter(LearningTrack.slug == slug).first()

    if not track:
        raise HTTPException(status_code=404, detail="Track not found")

    return {
        "id": track.id,
        "title": track.title,
        "slug": track.slug,
        "branch": track.branch,
        "description": track.description,
        "icon": track.icon,
        "level": track.level,
        "xp_reward": track.xp_reward,
        "modules": [
            {
                "id": m.id,
                "title": m.title,
                "description": m.description,
                "order": m.order,
                "topics": [
                    {
                        "id": tp.id,
                        "title": tp.title,
                        "xp_reward": tp.xp_reward,
                        "order": tp.order
                    } for tp in m.topics
                ]
            } for m in sorted(track.modules, key=lambda x: x.order)
        ]
    }

@router.get("/topics/{id}")
def get_topic(id: int, db: Session = Depends(get_db)):
    topic = db.query(Topic).options(joinedload(Topic.module)).filter(Topic.id == id).first()
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")

    mcqs = []
    try:
        mcqs = json.loads(topic.mcqs_json)
    except Exception:
        pass

    return {
        "id": topic.id,
        "title": topic.title,
        "story_content": topic.story_content,
        "code_snippet": topic.code_snippet,
        "mcqs": mcqs,
        "xp_reward": topic.xp_reward,
        "module_title": topic.module.title if topic.module else ""
    }

@router.post("/topics/{id}/complete")
def complete_topic(id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    topic = db.query(Topic).filter(Topic.id == id).first()
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")

    updated_user = award_xp(db, user, topic.xp_reward, category="general")
    return {
        "status": "success",
        "xp_earned": topic.xp_reward,
        "total_xp": updated_user.xp,
        "level": updated_user.level,
        "streak_count": updated_user.streak_count
    }
