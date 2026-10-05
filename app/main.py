from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import(
    auth, 
    users, 
    categories, 
    transactions, 
    budgets, 
    goals,
    recurring_expenses, 
    dashboard
)
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(categories.router)
app.include_router(transactions.router)
app.include_router(budgets.router)
app.include_router(goals.router)
app.include_router(recurring_expenses.router)
app.include_router(dashboard.router)

@app.get("/")
def home():
    return {"message": "Personal Finance Intelligence API"}

