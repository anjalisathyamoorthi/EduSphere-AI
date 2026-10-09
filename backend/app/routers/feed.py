from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from app.database import get_db
from app.models import FeedPost, FeedLike, User
from app.schemas import FeedPostCreate
from app.auth_utils import get_current_user

router = APIRouter(prefix="/api/feed", tags=["Meme & Tech Feed"])

@router.get("")
def list_feed_posts(category: str = None, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    query = db.query(FeedPost).options(joinedload(FeedPost.user)).order_by(FeedPost.created_at.desc())
    if category:
        query = query.filter(FeedPost.category == category)
    posts = query.all()

    user_likes = db.query(FeedLike).filter(FeedLike.user_id == user.id).all() if user else []
    liked_post_ids = {l.post_id for l in user_likes}

    res = []
    for p in posts:
        res.append({
            "id": p.id,
            "author_name": p.user.full_name if p.user else "Anonymous Engineer",
            "author_avatar": p.user.avatar_url if p.user else "https://api.dicebear.com/7.x/avataaars/svg?seed=eng",
            "content": p.content,
            "image_url": p.image_url,
            "category": p.category,
            "likes_count": p.likes_count,
            "comments_count": p.comments_count,
            "is_liked": p.id in liked_post_ids,
            "created_at": p.created_at.isoformat()
        })
    return res

@router.post("")
def create_feed_post(req: FeedPostCreate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    post = FeedPost(
        user_id=user.id,
        content=req.content,
        image_url=req.image_url,
        category=req.category or "meme",
        likes_count=0,
        comments_count=0
    )
    db.add(post)
    db.commit()
    db.refresh(post)

    return {
        "id": post.id,
        "author_name": user.full_name,
        "author_avatar": user.avatar_url,
        "content": post.content,
        "image_url": post.image_url,
        "category": post.category,
        "likes_count": 0,
        "comments_count": 0,
        "is_liked": False,
        "created_at": post.created_at.isoformat()
    }

@router.post("/{id}/like")
def toggle_like_post(id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    post = db.query(FeedPost).filter(FeedPost.id == id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    existing_like = db.query(FeedLike).filter(FeedLike.post_id == id, FeedLike.user_id == user.id).first()
    if existing_like:
        db.delete(existing_like)
        post.likes_count = max(0, post.likes_count - 1)
        is_liked = False
    else:
        like = FeedLike(post_id=id, user_id=user.id)
        db.add(like)
        post.likes_count += 1
        is_liked = True

    db.commit()
    return {"status": "success", "is_liked": is_liked, "likes_count": post.likes_count}
