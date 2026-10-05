from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Budget, User
from app.schemas import BudgetCreate, BudgetResponse, BudgetUpdate
from app.dependencies import get_current_user

router = APIRouter()

@router.post("/budgets", response_model=BudgetResponse)
def create_budget(
    budget: BudgetCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_budget = Budget(
        user_id=current_user.id,
        category_id=budget.category_id,
        amount=budget.amount,
        month=budget.month,
        year=budget.year
    )

    db.add(new_budget)
    db.commit()
    db.refresh(new_budget)

    return new_budget

@router.get("/budgets", response_model=list[BudgetResponse])
def get_budgets(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Budget).filter(
        Budget.user_id == current_user.id
    ).all()

@router.put("/budgets/{budget_id}", response_model=BudgetResponse)
def update_budget(
    budget_id: int,
    budget: BudgetUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    existing_budget = db.query(Budget).filter(
        Budget.id == budget_id,
        Budget.user_id == current_user.id
    ).first()

    if existing_budget is None:
        raise HTTPException(
            status_code=404,
            detail="Budget not found"
        )

    if budget.category_id is not None:
        existing_budget.category_id = budget.category_id

    if budget.amount is not None:
        existing_budget.amount = budget.amount

    if budget.month is not None:
        existing_budget.month = budget.month

    if budget.year is not None:
        existing_budget.year = budget.year

    db.commit()
    db.refresh(existing_budget)

    return existing_budget

@router.delete("/budgets/{budget_id}")
def delete_budget(
    budget_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    existing_budget = db.query(Budget).filter(
        Budget.id == budget_id,
        Budget.user_id == current_user.id
    ).first()

    if existing_budget is None:
        raise HTTPException(
            status_code=404,
            detail="Budget not found"
        )

    db.delete(existing_budget)
    db.commit()

    return {"message": "Budget deleted successfully"}