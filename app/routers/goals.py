from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import FinancialGoal, User
from app.schemas import (
    FinancialGoalCreate,
    FinancialGoalResponse,
    FinancialGoalUpdate
)
from app.dependencies import get_current_user

router = APIRouter()

@router.post("/goals", response_model=FinancialGoalResponse)
def create_goal(
    goal: FinancialGoalCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_goal = FinancialGoal(
        user_id=current_user.id,
        name=goal.name,
        target_amount=goal.target_amount,
        current_amount=goal.current_amount,
        target_date=goal.target_date,
        description=goal.description
    )

    db.add(new_goal)
    db.commit()
    db.refresh(new_goal)

    return new_goal

@router.get("/goals", response_model=list[FinancialGoalResponse])
def get_goals(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(FinancialGoal).filter(
        FinancialGoal.user_id == current_user.id
    ).all()

@router.put("/goals/{goal_id}", response_model=FinancialGoalResponse)
def update_goal(
    goal_id: int,
    goal: FinancialGoalUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    existing_goal = db.query(FinancialGoal).filter(
        FinancialGoal.id == goal_id,
        FinancialGoal.user_id == current_user.id
    ).first()

    if existing_goal is None:
        raise HTTPException(
            status_code=404,
            detail="Goal not found"
        )

    if goal.name is not None:
        existing_goal.name = goal.name
    if goal.target_amount is not None:
        existing_goal.target_amount = goal.target_amount
    if goal.current_amount is not None:
        existing_goal.current_amount = goal.current_amount
    if goal.target_date is not None:
        existing_goal.target_date = goal.target_date
    if goal.description is not None:
        existing_goal.description = goal.description
    db.commit()
    db.refresh(existing_goal)

    return existing_goal

@router.delete("/goals/{goal_id}")
def delete_goal(
    goal_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    existing_goal = db.query(FinancialGoal).filter(
        FinancialGoal.id == goal_id,
        FinancialGoal.user_id == current_user.id
    ).first()

    if existing_goal is None:
        raise HTTPException(
            status_code=404,
            detail="Goal not found"
        )

    db.delete(existing_goal)
    db.commit()
    return {"message": "Goal deleted successfully"}