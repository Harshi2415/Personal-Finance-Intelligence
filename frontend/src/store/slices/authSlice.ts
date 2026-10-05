import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface User {
    id: number;
    name: string;
    email: string;
    currency: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
}

const initialState: AuthState = {
    user: null,
    isAuthenticated: Boolean(localStorage.getItem("access_token")),
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
            state.isAuthenticated = true;
        },
        
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            localStorage.removeItem("access_token");
        },
    },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;