from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import AIMentorChatRequest, AIInterviewEvalRequest
from app.services.ai_service import chat_with_mentor, evaluate_mock_interview
from app.auth_utils import get_current_user_optional

router = APIRouter(prefix="/api/ai", tags=["AI Services"])

@router.post("/mentor")
def mentor_chat(req: AIMentorChatRequest, user=Depends(get_current_user_optional)):
    branch = req.branch or "Computer Science"
    if user and hasattr(user, "profile") and user.profile:
        branch = user.profile.branch

    reply = chat_with_mentor(req.message, branch=branch, context=req.context or "")
    return {
        "reply": reply,
        "persona": "EduSphere AI Mentor",
        "branch": branch
    }

@router.post("/interview")
def interview_eval(req: AIInterviewEvalRequest):
    eval_res = evaluate_mock_interview(req.role, req.question, req.student_answer)
    return eval_res
