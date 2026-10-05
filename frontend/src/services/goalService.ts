import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

const getAuthHeaders = () => {
    const token = localStorage.getItem("access_token");
    return {
        Authorization: `Bearer ${token}`,
    };
};

export interface FinancialGoal {
    id: number;
    user_id: number;
    name: string;
    target_amount: number;
    current_amount: number;
    target_date: string;
    description: string | null;
}

export interface GoalCreateData {
    name: string;
    target_amount: number;
    current_amount: number;
    target_date: string;
    description?: string;
}

export const getGoals = async (): Promise<FinancialGoal[]> => {
    const response = await axios.get(
        `${API_URL}/goals`,
        {headers: getAuthHeaders(),}
    );
    
    return response.data.map(
        (goal: FinancialGoal) => ({
            ...goal,
            target_amount: Number(
                goal.target_amount
            ),
            current_amount: Number(
                goal.current_amount
            ),
        })
    );
};

export const createGoal = async (
    goalData: GoalCreateData
): Promise<FinancialGoal> => {
    const response = await axios.post(
        `${API_URL}/goals`,
        goalData,
        {headers: getAuthHeaders(),}
    );
    
    return {
        ...response.data,
        target_amount: Number(
            response.data.target_amount
        ),
        current_amount: Number(
            response.data.current_amount
        ),
    };
};

export const updateGoal = async (
    goalId: number,
    goalData: GoalCreateData
): Promise<FinancialGoal> => {
    const response = await axios.put(
        `${API_URL}/goals/${goalId}`,
        goalData,
        {headers: getAuthHeaders(),}
    );
    
    return {
        ...response.data,
        target_amount: Number(
            response.data.target_amount
        ),
        current_amount: Number(
            response.data.current_amount
        ),
    };
};

export const deleteGoal = async (
    goalId: number
): Promise<void> => {
    await axios.delete(
        `${API_URL}/goals/${goalId}`,
        {headers: getAuthHeaders(),}
    );
};