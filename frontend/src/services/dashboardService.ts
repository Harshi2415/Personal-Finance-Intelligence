import axios from "axios";
const API_URL = "http://127.0.0.1:8000";

const getAuthHeaders = () => {
    const token = localStorage.getItem("access_token");
    return {
        Authorization: `Bearer ${token}`,
    };
};

export interface DashboardSummary {
    total_income: number;
    total_expense: number;
    balance: number;
}

export interface SpendingByCategory {
    category: string;
    total: number;
}

export interface MonthlyTrend {
    month: number;
    income: number;
    expense: number;
}

export interface BudgetOverview {
    category: string;
    budget: number;
    spent: number;
}

export interface GoalProgress {
    name: string;
    target_amount: number;
    current_amount: number;
    progress: number;
}

export interface RecentTransaction {
    id: number;
    user_id: number;
    category_id: number;
    amount: number;
    type: "income" | "expense";
    description: string | null;
    transaction_date: string;
    payment_method: string;
}

export interface MonthlySavings {
    month: number;
    income: number;
    expense: number;
    savings: number;
}

export interface UpcomingExpense {
    id: number;
    user_id: number;
    category_id: number;
    name: string;
    amount: number;
    frequency: string;
    next_due_date: string;
    description: string | null;
    is_active: boolean;
}

export interface FinancialHealth {
    total_income: number;
    total_expense: number;
    savings: number;
    savings_rate: number;
}

// API Functions
export const getDashboardSummary = 
async (): Promise<DashboardSummary> => {
    const response = await axios.get(
        `${API_URL}/dashboard/summary`,
        {headers: getAuthHeaders(),}
    );
    return {
        total_income: Number(response.data.total_income),
        total_expense: Number(response.data.total_expense),
        balance: Number(response.data.balance),
    };
};

export const getSpendingByCategory =
async (): Promise<SpendingByCategory[]> => {
    const response = await axios.get(
        `${API_URL}/dashboard/spending-by-category`,
        {headers: getAuthHeaders(),}
    );
    return response.data.map(
        (item: SpendingByCategory) => ({
            ...item,
            total: Number(item.total),
        })
    );
};

export const getMonthlyTrends =
async (): Promise<MonthlyTrend[]> => {
    const response = await axios.get(
        `${API_URL}/dashboard/monthly-trends`,
        {headers: getAuthHeaders(),}
    );
    return response.data.map(
        (item: MonthlyTrend) => ({
            ...item,
            income: Number(item.income),
            expense: Number(item.expense),
        })
    );
};

export const getBudgetOverview =
async (): Promise<BudgetOverview[]> => {
    const response = await axios.get(
        `${API_URL}/dashboard/budget-overview`,
        {headers: getAuthHeaders(),}
    );
    return response.data.map(
        (item: BudgetOverview) => ({
            ...item,
            budget: Number(item.budget),
            spent: Number(item.spent),
        })
    );
};

export const getGoalProgress =
async (): Promise<GoalProgress[]> => {
    const response = await axios.get(
        `${API_URL}/dashboard/goal-progress`,
        {headers: getAuthHeaders(),}
    );
    return response.data.map(
        (item: GoalProgress) => ({
            ...item,
            target_amount: Number(item.target_amount),
            current_amount: Number(item.current_amount),
            progress: Number(item.progress),
        })
    );
};

export const getRecentTransactions =
async (): Promise<RecentTransaction[]> => {
    const response = await axios.get(
        `${API_URL}/dashboard/recent-transactions`,
        {headers: getAuthHeaders(),}
    );
    return response.data.map(
        (item: RecentTransaction) => ({
            ...item,
            amount: Number(item.amount),
        })
    );
};

export const getMonthlySavings =
async (): Promise<MonthlySavings[]> => {
    const response = await axios.get(
        `${API_URL}/dashboard/monthly-savings`,
        {headers: getAuthHeaders(),}
    );
    return response.data.map(
        (item: MonthlySavings) => ({
            ...item,
            income: Number(item.income),
            expense: Number(item.expense),
            savings: Number(item.savings),
        })
    );
};

export const getUpcomingExpenses =
async (): Promise<UpcomingExpense[]> => {
    const response = await axios.get(
        `${API_URL}/dashboard/upcoming-expenses`,
        {headers: getAuthHeaders(),}
    );
    return response.data.map(
        (item: UpcomingExpense) => ({
            ...item,
            amount: Number(item.amount),
        })
    );
};

export const getFinancialHealth =
async (): Promise<FinancialHealth> => {
    const response = await axios.get(
        `${API_URL}/dashboard/financial-health`,
        {headers: getAuthHeaders(),}
    );
    return {
        total_income: Number(response.data.total_income),
        total_expense: Number(response.data.total_expense),
        savings: Number(response.data.savings),
        savings_rate: Number(response.data.savings_rate),
    };
};