import json
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Opportunity

router = APIRouter(prefix="/api/opportunities", tags=["Opportunities"])

@router.get("")
def list_opportunities(type: str = None, db: Session = Depends(get_db)):
    query = db.query(Opportunity)
    if type:
        query = query.filter(Opportunity.type == type)
    opps = query.order_by(Opportunity.created_at.desc()).all()

    res = []
    for o in opps:
        tags = []
        try:
            tags = json.loads(o.tags_json or "[]")
        except Exception:
            pass
        res.append({
            "id": o.id,
            "title": o.title,
            "company": o.company,
            "location": o.location,
            "type": o.type,
            "stipend_salary": o.stipend_salary,
            "description": o.description,
            "apply_url": o.apply_url,
            "tags": tags,
            "deadline": o.deadline,
            "created_at": o.created_at.isoformat()
        })
    return res
