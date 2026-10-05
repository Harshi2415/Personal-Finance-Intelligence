from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import RecurringExpense, User
from app.schemas import (
    RecurringExpenseCreate,
    RecurringExpenseResponse,
    RecurringExpenseUpdate
)
from app.dependencies import get_current_user

router = APIRouter()

@router.post(
    "/recurring-expenses",
    response_model=RecurringExpenseResponse
)
def create_recurring_expense(
    expense: RecurringExpenseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_expense = RecurringExpense(
        user_id=current_user.id,
        category_id=expense.category_id,
        name=expense.name,
        amount=expense.amount,
        frequency=expense.frequency,
        next_due_date=expense.next_due_date,
        description=expense.description
    )

    db.add(new_expense)
    db.commit()
    db.refresh(new_expense)

    return new_expense

@router.get(
    "/recurring-expenses",
    response_model=list[RecurringExpenseResponse]
)
def get_recurring_expenses(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(RecurringExpense).filter(
        RecurringExpense.user_id == current_user.id
    ).all()

@router.put(
    "/recurring-expenses/{expense_id}",
    response_model=RecurringExpenseResponse
)
def update_recurring_expense(
    expense_id: int,
    expense: RecurringExpenseUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    existing_expense = db.query(RecurringExpense).filter(
        RecurringExpense.id == expense_id,
        RecurringExpense.user_id == current_user.id
    ).first()

    if existing_expense is None:
        raise HTTPException(
            status_code=404,
            detail="Recurring expense not found"
        )

    if expense.category_id is not None:
        existing_expense.category_id = expense.category_id
    if expense.name is not None:
        existing_expense.name = expense.name
    if expense.amount is not None:
        existing_expense.amount = expense.amount
    if expense.frequency is not None:
        existing_expense.frequency = expense.frequency
    if expense.next_due_date is not None:
        existing_expense.next_due_date = expense.next_due_date
    if expense.description is not None:
        existing_expense.description = expense.description
    if expense.is_active is not None:
        existing_expense.is_active = expense.is_active

    db.commit()
    db.refresh(existing_expense)

    return existing_expense

@router.delete("/recurring-expenses/{expense_id}")
def delete_recurring_expense(
    expense_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    existing_expense = db.query(RecurringExpense).filter(
        RecurringExpense.id == expense_id,
        RecurringExpense.user_id == current_user.id
    ).first()

    if existing_expense is None:
        raise HTTPException(
            status_code=404,
            detail="Recurring expense not found"
        )

    db.delete(existing_expense)
    db.commit()

    return {"message": "Recurring expense deleted successfully"}