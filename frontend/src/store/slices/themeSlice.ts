import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type Theme = "blue" | "teal" | "violet";

interface ThemeState {
    theme: Theme;
}

const savedTheme = localStorage.getItem("theme") as Theme | null;

const initialState: ThemeState = {
    theme: savedTheme ?? "blue",
};

const themeSlice = createSlice({
    name: "theme",
    initialState,
    reducers: {
        setTheme: (state, action: PayloadAction<Theme>) => {
            state.theme = action.payload;
            localStorage.setItem("theme", action.payload);
        },
    },
});

export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer;