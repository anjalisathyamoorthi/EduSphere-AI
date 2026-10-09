import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from app.database import get_db
from app.models import Exam, Question, ExamSubmission, User
from app.schemas import ExamSubmitRequest
from app.auth_utils import get_current_user
from app.services.streak_service import award_xp

router = APIRouter(prefix="/api/exams", tags=["Exams"])

@router.get("")
def list_exams(db: Session = Depends(get_db)):
    exams = db.query(Exam).options(joinedload(Exam.questions)).all()
    res = []
    for e in exams:
        res.append({
            "id": e.id,
            "title": e.title,
            "subject": e.subject,
            "duration_mins": e.duration_mins,
            "total_questions": len(e.questions) if e.questions else e.total_questions,
            "total_marks": e.total_marks,
            "passing_marks": e.passing_marks
        })
    return res

@router.get("/{id}")
def get_exam_detail(id: int, db: Session = Depends(get_db)):
    exam = db.query(Exam).options(joinedload(Exam.questions)).filter(Exam.id == id).first()
    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found")

    return {
        "id": exam.id,
        "title": exam.title,
        "subject": exam.subject,
        "duration_mins": exam.duration_mins,
        "total_questions": len(exam.questions),
        "total_marks": exam.total_marks,
        "passing_marks": exam.passing_marks,
        "questions": [
            {
                "id": q.id,
                "topic": q.topic,
                "question_text": q.question_text,
                "option_a": q.option_a,
                "option_b": q.option_b,
                "option_c": q.option_c,
                "option_d": q.option_d,
                "marks": q.marks
            } for q in exam.questions
        ]
    }

@router.post("/{id}/submit")
def submit_exam(id: int, req: ExamSubmitRequest, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    exam = db.query(Exam).options(joinedload(Exam.questions)).filter(Exam.id == id).first()
    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found")

    user_answers = {}
    try:
        user_answers = json.loads(req.answers_json)
    except Exception:
        pass

    score = 0
    detailed_eval = []
    for q in exam.questions:
        user_ans = user_answers.get(str(q.id)) or user_answers.get(q.id)
        is_correct = (user_ans == q.correct_option)
        if is_correct:
            score += q.marks
        detailed_eval.append({
            "question_id": q.id,
            "question_text": q.question_text,
            "user_answer": user_ans,
            "correct_answer": q.correct_option,
            "is_correct": is_correct,
            "explanation": q.explanation
        })

    passed = score >= exam.passing_marks

    sub = ExamSubmission(
        user_id=user.id,
        exam_id=exam.id,
        score=score,
        total_marks=exam.total_marks,
        time_taken_secs=req.time_taken_secs,
        answers_json=req.answers_json,
        passed=passed
    )
    db.add(sub)
    
    xp_earned = score * 2 if passed else 20
    updated_user = award_xp(db, user, xp_earned, category="general")
    db.commit()

    return {
        "status": "success",
        "score": score,
        "total_marks": exam.total_marks,
        "passed": passed,
        "percentage": round((score / exam.total_marks) * 100, 1),
        "detailed_eval": detailed_eval,
        "xp_earned": xp_earned,
        "user_xp": updated_user.xp
    }
