import datetime
from sqlalchemy import Column, Integer, String, Text, Boolean, Float, ForeignKey, DateTime, Index
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    avatar_url = Column(String(512), nullable=True)
    role = Column(String(50), default="student")
    xp = Column(Integer, default=150)
    level = Column(Integer, default=1)
    streak_count = Column(Integer, default=3)
    last_active_date = Column(String(10), nullable=True) # YYYY-MM-DD
    created_at = Column(DateTime, default=datetime.datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    profile = relationship("Profile", back_populates="user", uselist=False)
    missions = relationship("UserMission", back_populates="user")
    challenges = relationship("UserChallenge", back_populates="user")
    flashcards = relationship("UserFlashcard", back_populates="user")
    notes = relationship("Note", back_populates="user")
    memberships = relationship("GroupMember", back_populates="user")
    feed_posts = relationship("FeedPost", back_populates="user")
    feed_likes = relationship("FeedLike", back_populates="user")
    exam_submissions = relationship("ExamSubmission", back_populates="user")
    progress_records = relationship("UserProgress", back_populates="user")
    typing_results = relationship("TypingResult", back_populates="user")


class Profile(Base):
    __tablename__ = "profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, index=True, nullable=False)
    branch = Column(String(100), default="Computer Science & Engineering")
    year = Column(String(50), default="3rd Year")
    college = Column(String(255), default="Indian Institute of Technology / NIT")
    target_goals = Column(Text, default="DSA, Web Dev, System Design")
    daily_time_target_mins = Column(Integer, default=45)
    bio = Column(Text, nullable=True)
    github_url = Column(String(255), nullable=True)
    linkedin_url = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, index=True)

    user = relationship("User", back_populates="profile")


class LearningTrack(Base):
    __tablename__ = "learning_tracks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, index=True, nullable=False)
    branch = Column(String(100), nullable=False, index=True)
    description = Column(Text, nullable=False)
    icon = Column(String(100), default="code")
    level = Column(String(50), default="Beginner to Advanced")
    xp_reward = Column(Integer, default=500)
    total_modules = Column(Integer, default=4)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, index=True)

    modules = relationship("LearningModule", back_populates="track", cascade="all, delete-orphan")
    flashcards = relationship("Flashcard", back_populates="track")


class LearningModule(Base):
    __tablename__ = "learning_modules"

    id = Column(Integer, primary_key=True, index=True)
    track_id = Column(Integer, ForeignKey("learning_tracks.id"), index=True, nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    order = Column(Integer, default=1)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, index=True)

    track = relationship("LearningTrack", back_populates="modules")
    topics = relationship("Topic", back_populates="module", cascade="all, delete-orphan")


class Topic(Base):
    __tablename__ = "topics"

    id = Column(Integer, primary_key=True, index=True)
    module_id = Column(Integer, ForeignKey("learning_modules.id"), index=True, nullable=False)
    title = Column(String(255), nullable=False)
    story_content = Column(Text, nullable=False)
    code_snippet = Column(Text, nullable=True)
    mcqs_json = Column(Text, nullable=False) # JSON array of MCQs
    xp_reward = Column(Integer, default=50)
    order = Column(Integer, default=1)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, index=True)

    module = relationship("LearningModule", back_populates="topics")


class Mission(Base):
    __tablename__ = "missions"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    duration_mins = Column(Integer, default=15)
    xp_reward = Column(Integer, default=100)
    category = Column(String(100), default="Coding")
    is_daily = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, index=True)

    tasks = relationship("MissionTask", back_populates="mission", cascade="all, delete-orphan")
    user_missions = relationship("UserMission", back_populates="mission")


class MissionTask(Base):
    __tablename__ = "mission_tasks"

    id = Column(Integer, primary_key=True, index=True)
    mission_id = Column(Integer, ForeignKey("missions.id"), index=True, nullable=False)
    task_text = Column(String(255), nullable=False)
    is_completed_default = Column(Boolean, default=False)
    order = Column(Integer, default=1)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, index=True)

    mission = relationship("Mission", back_populates="tasks")


class UserMission(Base):
    __tablename__ = "user_missions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True, nullable=False)
    mission_id = Column(Integer, ForeignKey("missions.id"), index=True, nullable=False)
    status = Column(String(50), default="in_progress") # in_progress, completed, claimed
    progress_pct = Column(Float, default=0.0)
    completed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, index=True)

    user = relationship("User", back_populates="missions")
    mission = relationship("Mission", back_populates="user_missions")


class Challenge(Base):
    __tablename__ = "challenges"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, index=True, nullable=False)
    difficulty = Column(String(50), default="Medium") # Easy, Medium, Hard, Boss
    description = Column(Text, nullable=False)
    problem_statement = Column(Text, nullable=False)
    starter_code_py = Column(Text, nullable=True)
    starter_code_js = Column(Text, nullable=True)
    test_cases_json = Column(Text, nullable=False) # JSON array of test cases
    hints_json = Column(Text, nullable=True) # JSON array of hints
    xp_reward = Column(Integer, default=250)
    boss_name = Column(String(100), default="Algorithm Titan")
    created_at = Column(DateTime, default=datetime.datetime.utcnow, index=True)

    user_challenges = relationship("UserChallenge", back_populates="challenge")


class UserChallenge(Base):
    __tablename__ = "user_challenges"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True, nullable=False)
    challenge_id = Column(Integer, ForeignKey("challenges.id"), index=True, nullable=False)
    status = Column(String(50), default="unsolved") # unsolved, solved
    submitted_code = Column(Text, nullable=True)
    language = Column(String(20), default="python")
    passed_tests = Column(Integer, default=0)
    total_tests = Column(Integer, default=0)
    completed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, index=True)

    user = relationship("User", back_populates="challenges")
    challenge = relationship("Challenge", back_populates="user_challenges")


class Flashcard(Base):
    __tablename__ = "flashcards"

    id = Column(Integer, primary_key=True, index=True)
    track_id = Column(Integer, ForeignKey("learning_tracks.id"), index=True, nullable=True)
    topic = Column(String(100), nullable=False)
    question = Column(Text, nullable=False)
    answer = Column(Text, nullable=False)
    explanation = Column(Text, nullable=True)
    difficulty = Column(String(50), default="Medium")
    created_at = Column(DateTime, default=datetime.datetime.utcnow, index=True)

    track = relationship("LearningTrack", back_populates="flashcards")
    user_flashcards = relationship("UserFlashcard", back_populates="flashcard")


class UserFlashcard(Base):
    __tablename__ = "user_flashcards"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True, nullable=False)
    flashcard_id = Column(Integer, ForeignKey("flashcards.id"), index=True, nullable=False)
    box_level = Column(Integer, default=1) # Leitner box 1-5
    interval_days = Column(Integer, default=1)
    next_review_at = Column(DateTime, default=datetime.datetime.utcnow, index=True)
    last_reviewed_at = Column(DateTime, nullable=True)

    user = relationship("User", back_populates="flashcards")
    flashcard = relationship("Flashcard", back_populates="user_flashcards")


class Note(Base):
    __tablename__ = "notes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True, nullable=False)
    title = Column(String(255), nullable=False)
    subject = Column(String(100), nullable=False)
    track_name = Column(String(100), default="Computer Science")
    content = Column(Text, nullable=False)
    ai_summary = Column(Text, nullable=True)
    tags_json = Column(Text, default="[]")
    created_at = Column(DateTime, default=datetime.datetime.utcnow, index=True)

    user = relationship("User", back_populates="notes")


class Group(Base):
    __tablename__ = "groups"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    avatar_url = Column(String(512), nullable=True)
    code = Column(String(50), unique=True, index=True, nullable=False)
    member_count = Column(Integer, default=1)
    weekly_xp = Column(Integer, default=0)
    leader_id = Column(Integer, ForeignKey("users.id"), index=True, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, index=True)

    members = relationship("GroupMember", back_populates="group", cascade="all, delete-orphan")
    pomodoro_sessions = relationship("PomodoroSession", back_populates="group")


class GroupMember(Base):
    __tablename__ = "group_members"

    id = Column(Integer, primary_key=True, index=True)
    group_id = Column(Integer, ForeignKey("groups.id"), index=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), index=True, nullable=False)
    role = Column(String(50), default="member") # leader, admin, member
    joined_at = Column(DateTime, default=datetime.datetime.utcnow, index=True)

    group = relationship("Group", back_populates="members")
    user = relationship("User", back_populates="memberships")


class PomodoroSession(Base):
    __tablename__ = "pomodoro_sessions"

    id = Column(Integer, primary_key=True, index=True)
    group_id = Column(Integer, ForeignKey("groups.id"), index=True, nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True, nullable=False)
    subject = Column(String(100), default="Deep Work")
    duration_mins = Column(Integer, default=25)
    status = Column(String(50), default="completed") # active, completed
    created_at = Column(DateTime, default=datetime.datetime.utcnow, index=True)

    group = relationship("Group", back_populates="pomodoro_sessions")


class FeedPost(Base):
    __tablename__ = "feed_posts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True, nullable=False)
    content = Column(Text, nullable=False)
    image_url = Column(String(512), nullable=True)
    category = Column(String(50), default="meme") # meme, tech, doubt, win
    likes_count = Column(Integer, default=0)
    comments_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, index=True)

    user = relationship("User", back_populates="feed_posts")
    likes = relationship("FeedLike", back_populates="post", cascade="all, delete-orphan")


class FeedLike(Base):
    __tablename__ = "feed_likes"

    id = Column(Integer, primary_key=True, index=True)
    post_id = Column(Integer, ForeignKey("feed_posts.id"), index=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), index=True, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, index=True)

    post = relationship("FeedPost", back_populates="likes")
    user = relationship("User", back_populates="feed_likes")


class Opportunity(Base):
    __tablename__ = "opportunities"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    company = Column(String(255), nullable=False)
    location = Column(String(100), default="Remote / Hybrid")
    type = Column(String(50), default="Internship") # Internship, Hackathon, Full-time
    stipend_salary = Column(String(100), default="₹25,000 - ₹50,000 / month")
    description = Column(Text, nullable=False)
    apply_url = Column(String(512), nullable=False)
    tags_json = Column(Text, default="[]")
    deadline = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, index=True)


class Exam(Base):
    __tablename__ = "exams"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    subject = Column(String(100), nullable=False)
    duration_mins = Column(Integer, default=30)
    total_questions = Column(Integer, default=10)
    total_marks = Column(Integer, default=100)
    passing_marks = Column(Integer, default=60)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, index=True)

    questions = relationship("Question", back_populates="exam", cascade="all, delete-orphan")
    submissions = relationship("ExamSubmission", back_populates="exam")


class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    exam_id = Column(Integer, ForeignKey("exams.id"), index=True, nullable=False)
    topic = Column(String(100), nullable=False)
    question_text = Column(Text, nullable=False)
    option_a = Column(String(255), nullable=False)
    option_b = Column(String(255), nullable=False)
    option_c = Column(String(255), nullable=False)
    option_d = Column(String(255), nullable=False)
    correct_option = Column(String(10), nullable=False) # A, B, C, D
    explanation = Column(Text, nullable=True)
    marks = Column(Integer, default=10)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, index=True)

    exam = relationship("Exam", back_populates="questions")


class ExamSubmission(Base):
    __tablename__ = "exam_submissions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True, nullable=False)
    exam_id = Column(Integer, ForeignKey("exams.id"), index=True, nullable=False)
    score = Column(Integer, nullable=False)
    total_marks = Column(Integer, nullable=False)
    time_taken_secs = Column(Integer, nullable=False)
    answers_json = Column(Text, nullable=False)
    passed = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, index=True)

    user = relationship("User", back_populates="exam_submissions")
    exam = relationship("Exam", back_populates="submissions")


class UserProgress(Base):
    __tablename__ = "user_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True, nullable=False)
    date = Column(String(10), index=True, nullable=False) # YYYY-MM-DD
    study_time_mins = Column(Integer, default=0)
    missions_completed = Column(Integer, default=0)
    challenges_solved = Column(Integer, default=0)
    flashcards_reviewed = Column(Integer, default=0)
    typing_tests_completed = Column(Integer, default=0)
    xp_earned = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, index=True)

    user = relationship("User", back_populates="progress_records")


class TypingResult(Base):
    __tablename__ = "typing_results"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True, nullable=False)
    mode = Column(String(50), default="code_python") # english, code_python, code_js, code_c, code_java
    passage_id = Column(String(100), default="p1")
    wpm = Column(Float, nullable=False)
    raw_wpm = Column(Float, nullable=False)
    accuracy = Column(Float, nullable=False)
    errors = Column(Integer, default=0)
    mistyped_keys_json = Column(Text, default="{}")
    duration_secs = Column(Integer, default=30)
    xp_earned = Column(Integer, default=50)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, index=True)

    user = relationship("User", back_populates="typing_results")
