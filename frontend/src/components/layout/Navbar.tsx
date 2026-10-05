import { ChartNoAxesCombined, Menu } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../../store/store";
import Notifications from "./Notifications";

interface NavbarProps {
    onMenuClick: () => void;
}

function Navbar({ onMenuClick }: NavbarProps) {
    const user = useSelector((state: RootState) =>
        state.auth.user
    );
    
    const navigate = useNavigate();
    
    return ( 
    <header className="flex h-[76px] items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8">
        {/* Left */} 
        <div className="flex items-center gap-2">
            {/* Mobile Menu */} 
            <button
            type="button"
            onClick={onMenuClick}
            className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 shadow-sm transition hover:bg-slate-50 lg:hidden"
            aria-label="Open sidebar"
            > 
                <Menu size={20} /> 
            </button>
            
            {/* Greeting */}
            <div className="flex items-center gap-1">
                <div className="app-primary-text flex h-9 w-9 items-center justify-center rounded-xl">
                    <ChartNoAxesCombined
                    size={21}
                    strokeWidth={2.3}
                    />
                </div>
                <p className="text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">
                    Welcome back{" "}
                    <span className="app-primary-text">
                        {user?.name || "User"}
                    </span>
                </p>
            </div>
        </div>
        
        {/* Right */}
        <div className="flex items-center gap-3">
            {/* Notifications */}
            <Notifications />
            
            {/* Profile */}
            <button
            type="button"
            onClick={() => navigate("/profile")}
            className="app-primary-soft app-primary-text flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-[var(--app-primary-soft)]"
            aria-label="Open profile"
            >
                {user?.name?.charAt(0).toUpperCase() || "U"}
            </button>
        </div>
    </header>
    );
}

export default Navbar;
