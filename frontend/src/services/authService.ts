import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

export interface RegisterData{
    name: string;
    email: string;
    password: string;
    currency: string;
}

export const registerUser = async(userData : RegisterData) => {
    const response = await axios.post(`${API_URL}/users`, userData);
    return response.data;
}

export interface LoginData{
    email : string;
    password : string;
}

export const loginUser = async(loginData : LoginData) => {
    const formData = new URLSearchParams();
    formData.append("username", loginData.email);
    formData.append("password", loginData.password);

    const response = await axios.post(
        `${API_URL}/login`, formData,
        {headers:{"Content-type" : "application/x-www-form-urlencoded"},}
    );
    return response.data;
}

export const getCurrentUser = async () => {
    const token = localStorage.getItem("access_token");
    const response = await axios.get(
        `${API_URL}/users/me`,
        {headers: {Authorization: `Bearer ${token}`},}
    );
    return response.data;
}
