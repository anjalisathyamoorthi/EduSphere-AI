from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime

# Auth Schemas
class UserSignup(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    branch: Optional[str] = "Computer Science & Engineering"
    year: Optional[str] = "3rd Year"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Dict[str, Any]

# Profile Schemas
class ProfileUpdate(BaseModel):
    branch: Optional[str] = None
    year: Optional[str] = None
    college: Optional[str] = None
    target_goals: Optional[str] = None
    daily_time_target_mins: Optional[int] = None
    bio: Optional[str] = None
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None

class OnboardingData(BaseModel):
    branch: str
    year: str
    college: str
    target_goals: str
    daily_time_target_mins: int

# Sandbox Schema
class SandboxExecuteRequest(BaseModel):
    language: str # python or javascript
    code: str
    test_cases: Optional[List[Dict[str, Any]]] = None

# Typing Result Schema
class TypingResultCreate(BaseModel):
    mode: str
    passage_id: str
    wpm: float
    raw_wpm: float
    accuracy: float
    errors: int
    mistyped_keys_json: str
    duration_secs: int

# Note Create Schema
class NoteCreate(BaseModel):
    title: str
    subject: str
    track_name: Optional[str] = "Computer Science"
    content: str
    tags_json: Optional[str] = "[]"

# Feed Post Create Schema
class FeedPostCreate(BaseModel):
    content: str
    image_url: Optional[str] = None
    category: Optional[str] = "meme"

# AI Mentor Request
class AIMentorChatRequest(BaseModel):
    message: str
    branch: Optional[str] = "CSE"
    context: Optional[str] = ""

# AI Interview Request
class AIInterviewEvalRequest(BaseModel):
    role: str
    question: str
    student_answer: str

# Group Create Request
class GroupCreateRequest(BaseModel):
    name: str
    description: str

# Exam Submission Request
class ExamSubmitRequest(BaseModel):
    exam_id: int
    answers_json: str
    time_taken_secs: int
