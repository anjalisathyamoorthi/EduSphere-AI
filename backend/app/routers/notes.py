import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Note, User
from app.schemas import NoteCreate
from app.auth_utils import get_current_user
from app.services.ai_service import synthesize_note

router = APIRouter(prefix="/api/notes", tags=["Notes"])

@router.get("")
def list_notes(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    notes = db.query(Note).filter(Note.user_id == user.id).order_by(Note.created_at.desc()).all()
    res = []
    for n in notes:
        tags = []
        try:
            tags = json.loads(n.tags_json or "[]")
        except Exception:
            pass
        res.append({
            "id": n.id,
            "title": n.title,
            "subject": n.subject,
            "track_name": n.track_name,
            "content": n.content,
            "ai_summary": n.ai_summary,
            "tags": tags,
            "created_at": n.created_at.isoformat()
        })
    return res

@router.post("")
def create_note(req: NoteCreate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    ai_summary = synthesize_note(req.title, req.subject, req.content)
    
    note = Note(
        user_id=user.id,
        title=req.title,
        subject=req.subject,
        track_name=req.track_name or "Computer Science",
        content=req.content,
        ai_summary=ai_summary,
        tags_json=req.tags_json or "[]"
    )
    db.add(note)
    db.commit()
    db.refresh(note)

    tags = []
    try:
        tags = json.loads(note.tags_json or "[]")
    except Exception:
        pass

    return {
        "id": note.id,
        "title": note.title,
        "subject": note.subject,
        "track_name": note.track_name,
        "content": note.content,
        "ai_summary": note.ai_summary,
        "tags": tags,
        "created_at": note.created_at.isoformat()
    }

@router.delete("/{id}")
def delete_note(id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    note = db.query(Note).filter(Note.id == id, Note.user_id == user.id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    db.delete(note)
    db.commit()
    return {"status": "success", "message": "Note deleted"}
