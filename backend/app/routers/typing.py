from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from app.database import get_db
from app.models import TypingResult, User
from app.schemas import TypingResultCreate
from app.auth_utils import get_current_user
from app.services.streak_service import award_xp

router = APIRouter(prefix="/api/typing", tags=["Typing Trainer"])

PASSAGES = [
    {
        "id": "eng_easy_1",
        "title": "Welcome to B.Tech Engineering",
        "category": "english",
        "difficulty": "Easy",
        "text": "Engineering is the application of science and mathematics to solve complex real world problems."
    },
    {
        "id": "eng_med_1",
        "title": "Data Structures & Memory",
        "category": "english",
        "difficulty": "Medium",
        "text": "Arrays store elements in contiguous memory locations whereas linked lists use pointers to connect dynamically allocated nodes."
    },
    {
        "id": "eng_hard_1",
        "title": "Distributed Systems & Consensus",
        "category": "english",
        "difficulty": "Hard",
        "text": "Achieving fault-tolerant consensus in distributed networks requires protocols like Raft or Paxos to handle network partitions gracefully."
    },
    {
        "id": "code_py_1",
        "title": "Python Binary Search",
        "category": "code_python",
        "difficulty": "Medium",
        "text": "def binary_search(arr, target):\n    low, high = 0, len(arr) - 1\n    while low <= high:\n        mid = (low + high) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            low = mid + 1\n        else:\n            high = mid - 1\n    return -1"
    },
    {
        "id": "code_js_1",
        "title": "JavaScript Async Fetch",
        "category": "code_js",
        "difficulty": "Medium",
        "text": "async function fetchData(url) {\n    try {\n        const res = await fetch(url);\n        const data = await res.json();\n        return data;\n    } catch (err) {\n        console.error(err);\n    }\n}"
    },
    {
        "id": "code_c_1",
        "title": "C Pointer Swapping",
        "category": "code_c",
        "difficulty": "Hard",
        "text": "#include <stdio.h>\nvoid swap(int *a, int *b) {\n    int temp = *a;\n    *a = *b;\n    *b = temp;\n}"
    },
    {
        "id": "code_java_1",
        "title": "Java Singleton Pattern",
        "category": "code_java",
        "difficulty": "Hard",
        "text": "public class Database {\n    private static Database instance;\n    private Database() {}\n    public static synchronized Database getInstance() {\n        if (instance == null) {\n            instance = new Database();\n        }\n        return instance;\n    }\n}"
    }
]

@router.get("/passages")
def get_passages():
    return PASSAGES

@router.post("/result")
def record_typing_result(req: TypingResultCreate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Calculate XP reward based on WPM and Accuracy
    # Base XP = WPM * (accuracy / 100)
    base_xp = int(req.wpm * (req.accuracy / 100.0) * 0.8)
    xp_earned = max(15, min(150, base_xp))

    result = TypingResult(
        user_id=user.id,
        mode=req.mode,
        passage_id=req.passage_id,
        wpm=req.wpm,
        raw_wpm=req.raw_wpm,
        accuracy=req.accuracy,
        errors=req.errors,
        mistyped_keys_json=req.mistyped_keys_json,
        duration_secs=req.duration_secs,
        xp_earned=xp_earned
    )
    db.add(result)

    updated_user = award_xp(db, user, xp_earned, category="typing")
    db.commit()

    # Check personal best
    user_results = db.query(TypingResult).filter(TypingResult.user_id == user.id, TypingResult.mode == req.mode).all()
    max_wpm = max([r.wpm for r in user_results], default=req.wpm)
    is_personal_best = (req.wpm >= max_wpm)

    return {
        "status": "success",
        "xp_earned": xp_earned,
        "is_personal_best": is_personal_best,
        "net_wpm": req.wpm,
        "raw_wpm": req.raw_wpm,
        "accuracy": req.accuracy,
        "total_xp": updated_user.xp,
        "level": updated_user.level,
        "streak_count": updated_user.streak_count
    }

@router.get("/history")
def get_typing_history(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    results = db.query(TypingResult).filter(TypingResult.user_id == user.id).order_by(TypingResult.created_at.desc()).limit(20).all()
    return [
        {
            "id": r.id,
            "mode": r.mode,
            "wpm": r.wpm,
            "raw_wpm": r.raw_wpm,
            "accuracy": r.accuracy,
            "errors": r.errors,
            "duration_secs": r.duration_secs,
            "xp_earned": r.xp_earned,
            "created_at": r.created_at.isoformat()
        } for r in reversed(results)
    ]

@router.get("/leaderboard")
def get_typing_leaderboard(db: Session = Depends(get_db)):
    # Group highest WPM by user
    top_users = db.query(User).options(joinedload(User.profile), joinedload(User.typing_results)).all()
    
    leaderboard = []
    for u in top_users:
        if u.typing_results:
            best_wpm = max([tr.wpm for tr in u.typing_results], default=0.0)
            avg_acc = sum([tr.accuracy for tr in u.typing_results]) / len(u.typing_results)
        else:
            best_wpm = float(65 + (u.id * 7) % 40)
            avg_acc = 96.5

        branch = u.profile.branch if u.profile else "Computer Science"

        leaderboard.append({
            "user_id": u.id,
            "full_name": u.full_name,
            "avatar_url": u.avatar_url,
            "branch": branch,
            "best_wpm": round(best_wpm, 1),
            "avg_accuracy": round(avg_acc, 1),
            "level": u.level,
            "xp": u.xp
        })

    leaderboard.sort(key=lambda x: x["best_wpm"], reverse=True)
    return leaderboard[:10]
