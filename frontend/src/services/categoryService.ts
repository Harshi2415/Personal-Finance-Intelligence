import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

export interface Category {
    id: number;
    user_id: number;
    name: string;
    type: string;
}

export interface CategoryCreateData {
    name: string;
    type: "income" | "expense";
}

const getAuthHeaders = () => {
    const token = localStorage.getItem("access_token");
    return {
        Authorization: `Bearer ${token}`,
    };
};

export const getCategories = async (): Promise<Category[]> => {
    const response = await axios.get(
        `${API_URL}/categories`,
        {headers: getAuthHeaders(),}
    );
    return response.data;
};

export const createCategory = async (
    categoryData: CategoryCreateData
): Promise<Category> => {
    const response = await axios.post(
        `${API_URL}/categories`,
        categoryData,
        {headers: getAuthHeaders(),}
    );
    return response.data;
};

export const updateCategory = async (
    categoryId: number,
    categoryData: CategoryCreateData
): Promise<Category> => {
    const response = await axios.put(
        `${API_URL}/categories/${categoryId}`,
        categoryData,
        {headers: getAuthHeaders(),}
    );
    return response.data;
};

export const deleteCategory = async (
    categoryId: number
): Promise<void> => {
    await axios.delete(
        `${API_URL}/categories/${categoryId}`,
        {headers: getAuthHeaders(),}
    );
};
