import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Flashcard, UserFlashcard, User
from app.auth_utils import get_current_user
from app.services.streak_service import award_xp

router = APIRouter(prefix="/api/flashcards", tags=["Flashcards"])

@router.get("")
def list_flashcards(topic: str = None, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    query = db.query(Flashcard)
    if topic:
        query = query.filter(Flashcard.topic == topic)
    cards = query.all()

    user_cards = db.query(UserFlashcard).filter(UserFlashcard.user_id == user.id).all()
    uc_map = {uc.flashcard_id: uc for uc in user_cards}

    res = []
    for fc in cards:
        uc = uc_map.get(fc.id)
        res.append({
            "id": fc.id,
            "topic": fc.topic,
            "question": fc.question,
            "answer": fc.answer,
            "explanation": fc.explanation,
            "difficulty": fc.difficulty,
            "box_level": uc.box_level if uc else 1,
            "interval_days": uc.interval_days if uc else 1,
            "next_review_at": uc.next_review_at.isoformat() if uc and uc.next_review_at else None
        })
    return res

@router.post("/{id}/review")
def review_flashcard(id: int, payload: dict, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Rating: "easy" (+2 box), "good" (+1 box), "hard" (reset box 1)
    rating = payload.get("rating", "good")

    fc = db.query(Flashcard).filter(Flashcard.id == id).first()
    if not fc:
        raise HTTPException(status_code=404, detail="Flashcard not found")

    uc = db.query(UserFlashcard).filter(UserFlashcard.user_id == user.id, UserFlashcard.flashcard_id == id).first()
    if not uc:
        uc = UserFlashcard(user_id=user.id, flashcard_id=id, box_level=1, interval_days=1)
        db.add(uc)

    if rating == "easy":
        uc.box_level = min(5, uc.box_level + 2)
        uc.interval_days = uc.box_level * 3
    elif rating == "good":
        uc.box_level = min(5, uc.box_level + 1)
        uc.interval_days = uc.box_level * 2
    else: # hard / fail
        uc.box_level = 1
        uc.interval_days = 1

    uc.last_reviewed_at = datetime.datetime.utcnow()
    uc.next_review_at = datetime.datetime.utcnow() + datetime.timedelta(days=uc.interval_days)

    updated_user = award_xp(db, user, 15, category="flashcard")

    return {
        "status": "success",
        "box_level": uc.box_level,
        "interval_days": uc.interval_days,
        "next_review_at": uc.next_review_at.isoformat(),
        "xp_earned": 15,
        "total_xp": updated_user.xp
    }
