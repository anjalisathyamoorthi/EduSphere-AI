import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Challenge, UserChallenge, User
from app.auth_utils import get_current_user
from app.services.sandbox_service import execute_code
from app.services.streak_service import award_xp

router = APIRouter(prefix="/api/challenges", tags=["Challenges"])

@router.get("")
def list_challenges(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    challenges = db.query(Challenge).all()
    user_challenges = db.query(UserChallenge).filter(UserChallenge.user_id == user.id).all()
    uc_map = {uc.challenge_id: uc for uc in user_challenges}

    res = []
    for ch in challenges:
        uc = uc_map.get(ch.id)
        res.append({
            "id": ch.id,
            "title": ch.title,
            "slug": ch.slug,
            "difficulty": ch.difficulty,
            "description": ch.description,
            "xp_reward": ch.xp_reward,
            "boss_name": ch.boss_name,
            "status": uc.status if uc else "unsolved"
        })
    return res

@router.get("/{slug}")
def get_challenge_detail(slug: str, db: Session = Depends(get_db)):
    ch = db.query(Challenge).filter(Challenge.slug == slug).first()
    if not ch:
        raise HTTPException(status_code=404, detail="Challenge not found")

    test_cases = []
    hints = []
    try:
        test_cases = json.loads(ch.test_cases_json)
    except Exception:
        pass
    try:
        hints = json.loads(ch.hints_json or "[]")
    except Exception:
        pass

    return {
        "id": ch.id,
        "title": ch.title,
        "slug": ch.slug,
        "difficulty": ch.difficulty,
        "description": ch.description,
        "problem_statement": ch.problem_statement,
        "starter_code_py": ch.starter_code_py,
        "starter_code_js": ch.starter_code_js,
        "test_cases": test_cases,
        "hints": hints,
        "xp_reward": ch.xp_reward,
        "boss_name": ch.boss_name
    }

@router.post("/{slug}/submit")
def submit_challenge(slug: str, payload: dict, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    ch = db.query(Challenge).filter(Challenge.slug == slug).first()
    if not ch:
        raise HTTPException(status_code=404, detail="Challenge not found")

    code = payload.get("code", "")
    language = payload.get("language", "python")

    test_cases = []
    try:
        test_cases = json.loads(ch.test_cases_json)
    except Exception:
        pass

    # Execute code against test cases in sandbox
    result = execute_code(language, code, test_cases)
    
    uc = db.query(UserChallenge).filter(UserChallenge.user_id == user.id, UserChallenge.challenge_id == ch.id).first()
    if not uc:
        uc = UserChallenge(
            user_id=user.id,
            challenge_id=ch.id,
            submitted_code=code,
            language=language,
            total_tests=len(test_cases)
        )
        db.add(uc)

    passed_count = sum(1 for t in result.get("test_results", []) if t.get("passed"))
    uc.passed_tests = passed_count
    uc.submitted_code = code

    xp_earned = 0
    if result.get("success"):
        if uc.status != "solved":
            uc.status = "solved"
            award_xp(db, user, ch.xp_reward, category="challenge")
            xp_earned = ch.xp_reward

    db.commit()

    return {
        "success": result.get("success"),
        "stdout": result.get("stdout"),
        "stderr": result.get("stderr"),
        "execution_time_ms": result.get("execution_time_ms"),
        "test_results": result.get("test_results"),
        "passed_tests": passed_count,
        "total_tests": len(test_cases),
        "xp_earned": xp_earned,
        "user_xp": user.xp,
        "user_level": user.level
    }
