import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

export interface TransactionCreateData {
    category_id: number;
    amount: number;
    type: "income" | "expense";
    description?: string;
    transaction_date: string;
    payment_method: string;
}

export interface TransactionResponse {
    id: number;
    user_id: number;
    category_id: number;
    amount: number;
    type: "income" | "expense";
    description: string | null;
    transaction_date: string;
    payment_method: string;
}

const getAuthHeaders = () => {
    const token = localStorage.getItem("access_token");
    return {
        Authorization: `Bearer ${token}`,
    };
};

export const getTransactions = async (): Promise<
    TransactionResponse[]
> => {
    const response = await axios.get(
        `${API_URL}/transactions`,
        {headers: getAuthHeaders(),}
    );
    return response.data;
};

export const createTransaction = async (
    transactionData: TransactionCreateData
): Promise<TransactionResponse> => {
    const response = await axios.post(
        `${API_URL}/transactions`,
        transactionData,
        {headers: getAuthHeaders(),}
    );
    return response.data;
};

export const updateTransaction = async (
    transactionId: number,
    transactionData: TransactionCreateData
): Promise<TransactionResponse> => {
    const response = await axios.put(
        `${API_URL}/transactions/${transactionId}`,
        transactionData,
        {headers: getAuthHeaders(),}
    );
    return response.data;
};

export const deleteTransaction = async (
    transactionId: number
): Promise<void> => {
    await axios.delete(
        `${API_URL}/transactions/${transactionId}`,
        {headers: getAuthHeaders(),}
    );
};