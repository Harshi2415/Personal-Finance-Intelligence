import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Dashboard from "../pages/protected/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import AppLayout from "../components/layout/AppLayout";
import Transactions from "../pages/protected/Transactions";
import Categories from "../pages/protected/Categories";
import Budgets from "../pages/protected/Budgets";
import Goals from "../pages/protected/Goals";
import RecurringExpenses from "../pages/protected/RecurringExpenses";
import Profile from "../pages/protected/Profile";
import Settings from "../pages/protected/Settings";
import PasswordSecurity from "../pages/protected/PasswordSecurity";
import BotpressChat from "../components/layout/BotpressChat";

function AppRoutes() {
    return (
    <BrowserRouter>
    <BotpressChat />
    <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/transactions" element={<Transactions />}/>
                <Route path="/categories" element={<Categories />}/>
                <Route path="/budgets" element={<Budgets />}/>
                <Route path="/goals" element={<Goals />}/>
                <Route path="/recurring" element={<RecurringExpenses />}/>
                <Route path="/profile" element={<Profile />}/>
                <Route path="/settings" element={<Settings />}/>
                <Route path="/password-security" element={<PasswordSecurity />}/>
            </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />}/>
    </Routes>
    </BrowserRouter>
    );
}

export default AppRoutes;