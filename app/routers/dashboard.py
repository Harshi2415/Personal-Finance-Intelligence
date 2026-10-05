from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, case
from app.database import get_db
from app.models import (
    User,
    Transaction,
    Category,
    Budget,
    FinancialGoal,
    RecurringExpense
)
from app.dependencies import get_current_user

router = APIRouter()

@router.get("/dashboard/summary")
def get_dashboard_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    total_income = db.query(
        func.coalesce(func.sum(Transaction.amount), 0)
    ).filter(
        Transaction.user_id == current_user.id,
        Transaction.type == "income"
    ).scalar()

    total_expense = db.query(
        func.coalesce(func.sum(Transaction.amount), 0)
    ).filter(
        Transaction.user_id == current_user.id,
        Transaction.type == "expense"
    ).scalar()

    balance = total_income - total_expense

    return{
        "total_income" : total_income,
        "total_expense" : total_expense,
        "balance" : balance
    }

@router.get("/dashboard/spending-by-category")
def get_spending_by_category(
    db:Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    spending = (
        db.query(
            Category.name,
            func.coalesce(func.sum(Transaction.amount), 0)
        ).join(
            Transaction,
            Transaction.category_id == Category.id
        ).filter(
            Transaction.user_id == current_user.id,
            Transaction.type == "expense"
        ).group_by(
            Category.name
        ).all()
    )
    return[
        {
            "category" : category_name,
            "total" : total_amount
        }
        for category_name, total_amount in spending
    ]

@router.get("/dashboard/monthly-trends")
def get_monthly_trends(
    db:Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    monthly_data = (
        db.query(
            func.extract(
                "month",
                Transaction.transaction_date
            ).label("month"),
            func.coalesce(
                func.sum(
                    case(
                        (Transaction.type == "income", Transaction.amount),
                        else_ = 0 
                    )
                ),0
            ).label("income"),
            func.coalesce(
                func.sum(
                    case(
                        (Transaction.type == "expense", Transaction.amount),
                        else_ = 0
                    )
                ),0
            ).label("expense")
        ).filter(
            Transaction.user_id == current_user.id
        ).group_by(
            func.extract(
                "month",
                Transaction.transaction_date
            )
        ).order_by(
            func.extract(
                "month",
                Transaction.transaction_date
            )
        ).all()
    )
    return[
        {
            "month" : int(month),
            "income": income,
            "expense": expense
        }
        for month, income, expense in monthly_data
    ]

@router.get("/dashboard/budget-overview")
def get_budget_overview(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    budget_data = (
        db.query(
            Category.name,
            func.sum(Budget.amount),
            func.coalesce(func.sum(Transaction.amount), 0)
        ).join(
            Budget,
            Budget.category_id == Category.id
        ).outerjoin(
            Transaction,
            (Transaction.category_id == Category.id)
            & (Transaction.user_id == current_user.id)
            & (Transaction.type == "expense")
        ).filter(
            Budget.user_id == current_user.id
        ).group_by(Category.name).all()
    )

    return [
        {
            "category": category_name,
            "budget": budget_amount,
            "spent": spent_amount
        }
        for category_name, budget_amount, spent_amount in budget_data
    ]

@router.get("/dashboard/goal-progress")
def get_goal_progress(
    db:Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    goals = db.query(FinancialGoal).filter(
        FinancialGoal.user_id == current_user.id
    ).all()

    return[
        {
            "name": goal.name,
            "target_amount": goal.target_amount,
            "current_amount": goal.current_amount,
            "progress" : round(
                (goal.current_amount/goal.target_amount)*100,
                2
            )
        }
        for goal in goals
    ]

@router.get("/dashboard/recent-transactions")
def get_recent_transactions(
    db:Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    transactions = (
        db.query(Transaction).filter(
            Transaction.user_id == current_user.id
        ).order_by(
            Transaction.transaction_date.desc()
        ).limit(5).all()
    )

    return transactions

@router.get("/dashboard/monthly-savings")
def get_monthly_savings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    monthly_data = (
        db.query(
            func.extract(
                "month",
                Transaction.transaction_date
            ).label("month"),
            func.coalesce(
                func.sum(
                    case(
                        (Transaction.type == "income", Transaction.amount),
                        else_=0
                    )
                ),0
            ).label("income"),
            func.coalesce(
                func.sum(
                    case(
                        (Transaction.type == "expense", Transaction.amount),
                        else_=0
                    )
                ),0
            ).label("expense")
        ).filter(
            Transaction.user_id == current_user.id
        ).group_by(
            func.extract(
                "month",
                Transaction.transaction_date
            )
        ).order_by(
            func.extract(
                "month",
                Transaction.transaction_date
            )
        ).all()
    )
    return [
        {
            "month": int(month),
            "income": income,
            "expense": expense,
            "savings": income - expense
        }
        for month, income, expense in monthly_data
    ]

@router.get("/dashboard/upcoming-expenses")
def get_upcoming_expenses(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    expenses = (
        db.query(RecurringExpense).filter(
            RecurringExpense.user_id == current_user.id,
            RecurringExpense.is_active == True
        ).order_by(
            RecurringExpense.next_due_date
        ).limit(5).all()
    )

    return expenses

@router.get("/dashboard/financial-health")
def get_financial_health(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    total_income = db.query(
        func.coalesce(func.sum(Transaction.amount), 0)
    ).filter(
        Transaction.user_id == current_user.id,
        Transaction.type == "income"
    ).scalar()

    total_expense = db.query(
        func.coalesce(func.sum(Transaction.amount), 0)
    ).filter(
        Transaction.user_id == current_user.id,
        Transaction.type == "expense"
    ).scalar()

    savings = total_income - total_expense
    if total_income == 0:
        savings_rate = 0
    else:
        savings_rate = round(
            (savings / total_income) * 100,
            2
        )

    return {
        "total_income": total_income,
        "total_expense": total_expense,
        "savings": savings,
        "savings_rate": savings_rate
    }