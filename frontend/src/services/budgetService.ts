import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

const getAuthHeaders = () => {
    const token = localStorage.getItem("access_token");
    return {
        Authorization: `Bearer ${token}`,
    };
};

export interface Budget {
    id: number;
    user_id: number;
    category_id: number;
    amount: number;
    month: number;
    year: number;
}

export interface BudgetCreateData {
    category_id: number;
    amount: number;
    month: number;
    year: number;
}

export const getBudgets = async (): Promise<Budget[]> => {
    const response = await axios.get(
        `${API_URL}/budgets`,
        {headers: getAuthHeaders(),}
    );
    return response.data.map((budget: Budget) => ({
        ...budget, amount: Number(budget.amount),
    }));
};

export const createBudget = async (
    budgetData: BudgetCreateData
): Promise<Budget> => {
    const response = await axios.post(
        `${API_URL}/budgets`,
        budgetData,
        {headers: getAuthHeaders(),}
    );
    
    return {
        ...response.data,
        amount: Number(response.data.amount),
    };
};

export const updateBudget = async (
    budgetId: number,
    budgetData: BudgetCreateData
): Promise<Budget> => {
    const response = await axios.put(
        `${API_URL}/budgets/${budgetId}`,
        budgetData,
        {headers: getAuthHeaders(),}
    );
    
    return {
        ...response.data,
        amount: Number(response.data.amount),
    };
};

export const deleteBudget = async (
    budgetId: number
): Promise<void> => {
    await axios.delete(
        `${API_URL}/budgets/${budgetId}`,
        {headers: getAuthHeaders(),}
    );
};