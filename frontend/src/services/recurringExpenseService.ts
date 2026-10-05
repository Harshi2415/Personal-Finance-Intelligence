import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

const getAuthHeaders = () => {
    const token = localStorage.getItem("access_token");
    return {
        Authorization: `Bearer ${token}`,
    };
};

export interface RecurringExpense {
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

export interface RecurringExpenseCreateData {
    category_id: number;
    name: string;
    amount: number;
    frequency: string;
    next_due_date: string;
    description?: string;
}

export interface RecurringExpenseUpdateData {
    category_id?: number;
    name?: string;
    amount?: number;
    frequency?: string;
    next_due_date?: string;
    description?: string;
    is_active?: boolean;
}

export const getRecurringExpenses = async (): Promise<RecurringExpense[]> => {
    const response = await axios.get(`${API_URL}/recurring-expenses`, {
        headers: getAuthHeaders(),
    });
    return response.data.map((expense: RecurringExpense) => ({
        ...expense,
        amount: Number(expense.amount),
    }));
};

export const createRecurringExpense = async (
    expenseData: RecurringExpenseCreateData
): Promise<RecurringExpense> => {
    const response = await axios.post(
        `${API_URL}/recurring-expenses`,
        expenseData,
        {headers: getAuthHeaders(),}
    );
    return {
        ...response.data,
        amount: Number(response.data.amount),
    };
};

export const updateRecurringExpense = async (
    expenseId: number,
    expenseData: RecurringExpenseUpdateData
): Promise<RecurringExpense> => {
    const response = await axios.put(
        `${API_URL}/recurring-expenses/${expenseId}`,
        expenseData,
        {headers: getAuthHeaders(),}
    );
    return {
        ...response.data,
        amount: Number(response.data.amount)
    };
};

export const deleteRecurringExpense = async (
    expenseId: number
): Promise<void> => {
    await axios.delete(`${API_URL}/recurring-expenses/${expenseId}`, {
        headers: getAuthHeaders(),
    });
};