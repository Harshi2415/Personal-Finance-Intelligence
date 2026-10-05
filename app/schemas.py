from pydantic import BaseModel, EmailStr, Field
from datetime import date
from typing import Literal
from decimal import Decimal

#----------------------------- Auth Schemas -----------------------------
class LoginRequest(BaseModel):
    email: EmailStr
    password: str

#----------------------------- User Schemas -----------------------------
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    currency: str = "INR"

class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    currency: str

class UserUpdate(BaseModel):
    name: str | None = None
    email: EmailStr | None = None
    currency: str | None = None

#----------------------------- Transaction Schemas -----------------------------
class TransactionCreate(BaseModel):
    category_id: int
    amount: Decimal = Field(gt = 0)
    type: Literal["income", "expense"]
    description: str | None = None
    transaction_date: date
    payment_method: str

class TransactionResponse(BaseModel):
    id: int
    user_id: int
    category_id: int
    amount: Decimal
    type: str
    description: str | None = None
    transaction_date: date
    payment_method: str

class TransactionUpdate(BaseModel):
    category_id: int 
    amount: Decimal | None = Field(default = None, gt = 0)
    type: Literal["income", "expense"] | None = None
    description: str | None = None
    transaction_date: date | None = None
    payment_method: str | None = None

#----------------------------- Category Schemas -----------------------------
class CategoryCreate(BaseModel):
    name: str
    type: str

class CategoryResponse(BaseModel):
    id: int
    user_id: int
    name: str
    type: str

#----------------------------- Budget Schemas -----------------------------
class BudgetCreate(BaseModel):
    category_id: int
    amount: Decimal = Field(gt = 0)
    month: int = Field(ge = 1, le = 12)
    year: int = Field(ge = 2000)

class BudgetResponse(BaseModel):
    id: int
    user_id: int
    category_id: int
    amount: Decimal 
    month: int
    year: int

class BudgetUpdate(BaseModel):
    category_id: int 
    amount: Decimal | None = Field(default = None, gt = 0)
    month: int | None = Field(default = None, ge = 1, le = 12)
    year: int | None = Field(default= None, ge = 2000)

#----------------------------- Financial Goal Schemas -----------------------------
class FinancialGoalCreate(BaseModel):
    name: str
    target_amount: Decimal = Field(gt = 0)
    current_amount: Decimal = Field(ge = 0)
    target_date: date
    description: str | None = None

class FinancialGoalResponse(BaseModel):
    id: int
    user_id: int
    name: str
    target_amount: Decimal
    current_amount: Decimal
    target_date: date
    description: str | None = None

class FinancialGoalUpdate(BaseModel):
    name: str 
    target_amount: Decimal | None = Field(default = None, gt = 0)
    current_amount: Decimal | None = Field(default = None, ge = 0)
    target_date: date | None = None
    description: str | None = None  

#----------------------------- Recurring Expense Schemas -----------------------------
class RecurringExpenseCreate(BaseModel):
    category_id: int
    name: str
    amount: Decimal = Field(gt = 0)
    frequency: Literal["daily", "weekly", "monthly", "yearly"]
    next_due_date: date
    description: str | None = None

class RecurringExpenseResponse(BaseModel):
    id: int
    user_id: int
    category_id: int
    name: str
    amount: Decimal
    frequency: str
    next_due_date: date
    description: str | None = None
    is_active: bool

class RecurringExpenseUpdate(BaseModel):
    category_id: int 
    name: str | None = None
    amount: Decimal | None = Field(default=None, gt = 0)
    frequency: Literal["daily", "weekly", "monthly", "yearly"] | None = None
    next_due_date: date | None = None
    description: str | None = None
    is_active: bool | None = None