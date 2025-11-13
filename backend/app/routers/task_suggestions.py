from fastapi import APIRouter, HTTPException, Depends, status, Query
from sqlmodel import Session
from app.db import get_session
from app.schemas.task_suggestions import TaskInput, TaskSuggestion, Tip
from app.crud.task_suggestions import generate_task_suggestions, get_tips

router = APIRouter(prefix="/suggestions", tags=["AI Suggestions"])

@router.post("/", response_model=list[TaskSuggestion])
async def generate_task_suggestions_route(data: TaskInput, session: Session = Depends(get_session)):
    return await generate_task_suggestions(data, session)

@router.get("/tips/{barangay_id}", response_model=list[Tip])
async def get_tips_route(
    barangay_id: int,
    user_id: int | None = Query(None, description="Optional user id for personalization"),
    force: bool = Query(False, description="Force regenerate tips and ignore cache"),
    session: Session = Depends(get_session),
):
    return await get_tips(barangay_id, user_id, force, session)