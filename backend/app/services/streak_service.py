import datetime
from sqlalchemy.orm import Session
from app.models import User, UserProgress

def calculate_level(xp: int) -> int:
    if xp < 250:
        return 1
    elif xp < 600:
        return 2
    elif xp < 1100:
        return 3
    elif xp < 1800:
        return 4
    elif xp < 2700:
        return 5
    else:
        return 5 + (xp - 2700) // 1000

def award_xp(db: Session, user: User, xp_amount: int, category: str = "general") -> User:
    user.xp += xp_amount
    user.level = calculate_level(user.xp)
    
    today_str = datetime.date.today().isoformat()
    user.last_active_date = today_str

    progress = db.query(UserProgress).filter(
        UserProgress.user_id == user.id,
        UserProgress.date == today_str
    ).first()

    if not progress:
        progress = UserProgress(
            user_id=user.id,
            date=today_str,
            study_time_mins=15,
            missions_completed=0,
            challenges_solved=0,
            flashcards_reviewed=0,
            typing_tests_completed=0,
            xp_earned=xp_amount
        )
        db.add(progress)
    else:
        progress.xp_earned = (progress.xp_earned or 0) + xp_amount
        progress.study_time_mins = (progress.study_time_mins or 0) + 5

    if category == "mission":
        progress.missions_completed = (progress.missions_completed or 0) + 1
    elif category == "challenge":
        progress.challenges_solved = (progress.challenges_solved or 0) + 1
    elif category == "flashcard":
        progress.flashcards_reviewed = (progress.flashcards_reviewed or 0) + 1
    elif category == "typing":
        progress.typing_tests_completed = (progress.typing_tests_completed or 0) + 1

    db.commit()
    db.refresh(user)
    return user

def update_user_streak(db: Session, user: User) -> int:
    today = datetime.date.today()
    today_str = today.isoformat()
    yesterday_str = (today - datetime.timedelta(days=1)).isoformat()

    if user.last_active_date == today_str:
        return user.streak_count

    if user.last_active_date == yesterday_str:
        user.streak_count += 1
    else:
        user.streak_count = 1

    user.last_active_date = today_str
    db.commit()
    db.refresh(user)
    return user.streak_count
