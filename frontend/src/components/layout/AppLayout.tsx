import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { useDispatch } from "react-redux";
import {
    Outlet,
    useLocation,
    useNavigate,
} from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import {getCurrentUser,} from "../../services/authService";
import {logout, setUser,} from "../../store/slices/authSlice";
import type { AppDispatch } from "../../store/store";
import BotpressChat from "./BotpressChat";

function AppLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [
        isMobileSidebarOpen,
        setIsMobileSidebarOpen,
    ] = useState(false);
    
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const location = useLocation();
    
    const isDashboard = location.pathname === "/dashboard";
    useEffect(() => {
        const loadUser = async () => {
            try {
                const user = await getCurrentUser();
                dispatch(setUser(user));
            } catch (error) {
                console.error("Unable to load current user:",error);
                dispatch(logout());
                navigate("/login", {replace: true,});
            }
        };
        
        loadUser();
    }, [dispatch, navigate]);
    
    const handleDesktopToggle = () => {
        setIsSidebarOpen((current) => !current);
    };
    const handleMobileToggle = () => {
        setIsMobileSidebarOpen((current) => !current);
    };
    
    return (
    <div className="min-h-screen bg-slate-50">
        {/* Desktop Sidebar */}
        <Sidebar 
        isOpen={isSidebarOpen}
        onToggle={handleDesktopToggle}
        />
        
        {/* Mobile / Tablet Sidebar */}
        <Sidebar
        isOpen={isMobileSidebarOpen}
        onToggle={handleMobileToggle}
        isMobile
        />

        {/* Mobile Overlay */}
        {isMobileSidebarOpen && (
            <button
            type="button"
            onClick={handleMobileToggle}
            className="fixed inset-0 z-40 bg-slate-900/40 lg:hidden"
            aria-label="Close sidebar"
            />
        )}

        {/* Main Content */}
        <div
        className={`min-h-screen transition-[margin] duration-300 ${
            isSidebarOpen
            ? "lg:ml-[232px]"
            : "lg:ml-[20px]"}`
        }
        >
            {/* Dashboard Navbar only */}
            {isDashboard && (
                <Navbar
                onMenuClick={
                    handleMobileToggle
                }
                />
            )}

            {/* Mobile / Tablet Menu Button */}
            {!isDashboard && (
                <div className="flex h-16 items-center px-4 lg:hidden">
                    <button
                    type="button"
                    onClick={
                        handleMobileToggle
                    }
                    className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 shadow-sm transition hover:bg-slate-50"
                    aria-label="Open sidebar"
                    >
                        <Menu size={21} />
                    </button>
                </div>
            )}

            {/* Dashboard mobile menu is inside Navbar */}
            {isDashboard && (
                <div className="hidden" />
            )}
            
            <main>
                <Outlet />
            </main>

            <BotpressChat />
        </div>
    </div>
    );
}

export default AppLayout;