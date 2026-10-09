from fastapi import APIRouter
from app.schemas import SandboxExecuteRequest
from app.services.sandbox_service import execute_code

router = APIRouter(prefix="/api/sandbox", tags=["Sandbox"])

@router.post("/execute")
def run_sandbox(req: SandboxExecuteRequest):
    res = execute_code(req.language, req.code, req.test_cases)
    return res
