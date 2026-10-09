from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Question

router = APIRouter(prefix="/api/questions", tags=["Questions"])

@router.get("")
def list_questions(topic: str = None, db: Session = Depends(get_db)):
    query = db.query(Question)
    if topic:
        query = query.filter(Question.topic == topic)
    questions = query.limit(20).all()
    return [
        {
            "id": q.id,
            "topic": q.topic,
            "question_text": q.question_text,
            "option_a": q.option_a,
            "option_b": q.option_b,
            "option_c": q.option_c,
            "option_d": q.option_d,
            "marks": q.marks
        } for q in questions
    ]
