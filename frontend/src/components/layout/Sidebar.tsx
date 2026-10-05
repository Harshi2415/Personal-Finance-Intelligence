import {
  BarChart3,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  FolderTree,
  Goal,
  LayoutDashboard,
  LogOut,
  Menu,
  Repeat2,
  Settings,
  WalletCards,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { logout } from "../../store/slices/authSlice";
import type { AppDispatch } from "../../store/store";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  isMobile?: boolean;
}

function Sidebar({
  isOpen,
  onToggle,
  isMobile = false,
}: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const menuItems = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Transactions",
      path: "/transactions",
      icon: CircleDollarSign,
    },
    {
      label: "Budgets",
      path: "/budgets",
      icon: WalletCards,
    },
    {
      label: "Goals",
      path: "/goals",
      icon: Goal,
    },
    {
      label: "Recurring Expenses",
      path: "/recurring",
      icon: Repeat2,
    },
    {
      label: "Categories",
      path: "/categories",
      icon: FolderTree,
    },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleNavigation = (path: string) => {
    navigate(path);

    if (isMobile) {
      onToggle();
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = "/login";
  };

  if (isMobile) {
    return (
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white shadow-xl transition-transform duration-300 lg:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex h-20 items-center justify-between border-b border-slate-200 px-5">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-3"
          >
            <div className="app-primary flex h-10 w-10 items-center justify-center rounded-xl text-white">
              <BarChart3 size={21} strokeWidth={2.3} />
            </div>

            <div className="text-left">
              <p className="text-sm font-bold text-slate-900">
                Finance
              </p>
              <p className="text-xs text-slate-500">
                Intelligence
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={onToggle}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close sidebar"
          >
            <Menu size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-5">
          <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Overview
          </p>

          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => handleNavigation(item.path)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                    active
                      ? "app-primary-light app-primary-text"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon size={18} />

                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <p className="mb-3 mt-8 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Account
          </p>

          <div className="space-y-1">
            <button
              type="button"
              onClick={() => handleNavigation("/profile")}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                isActive("/profile")
                  ? "app-primary-light app-primary-text"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <CircleDollarSign size={18} />
              <span>Profile</span>
            </button>

            <button
              type="button"
              onClick={() => handleNavigation("/settings")}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                isActive("/settings")
                  ? "app-primary-light app-primary-text"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Settings size={18} />
              <span>Settings</span>
            </button>
          </div>
        </nav>

        {/* Logout */}
        <div className="border-t border-slate-200 p-3">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-600"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    );
  }

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 hidden flex-col border-r border-slate-200 bg-white transition-all duration-300 lg:flex ${
        isOpen ? "w-[232px]" : "w-[20px]"
      }`}
    >
      {isOpen ? (
        <>
          {/* Logo */}
          <div className="flex h-20 items-center justify-between border-b border-slate-200 px-5">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-3"
            >
              <div className="app-primary flex h-10 w-10 items-center justify-center rounded-xl text-white">
                <BarChart3 size={21} strokeWidth={2.3} />
              </div>

              <div className="text-left">
                <p className="text-sm font-bold text-slate-900">
                  Finance
                </p>
                <p className="text-xs text-slate-500">
                  Intelligence
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={onToggle}
              className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              aria-label="Collapse sidebar"
            >
              <ChevronLeft size={18} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-3 py-5">
            <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Overview
            </p>

            <div className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);

                return (
                  <button
                    key={item.path}
                    type="button"
                    onClick={() => handleNavigation(item.path)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                      active
                        ? "app-primary-light app-primary-text"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <Icon size={18} />

                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            <p className="mb-3 mt-8 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Account
            </p>

            <div className="space-y-1">
              <button
                type="button"
                onClick={() => navigate("/profile")}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  isActive("/profile")
                    ? "app-primary-light app-primary-text"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <CircleDollarSign size={18} />
                <span>Profile</span>
              </button>

              <button
                type="button"
                onClick={() => navigate("/settings")}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  isActive("/settings")
                    ? "app-primary-light app-primary-text"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Settings size={18} />
                <span>Settings</span>
              </button>
            </div>
          </nav>

          {/* Logout */}
          <div className="border-t border-slate-200 p-3">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-600"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </>
      ) : (
        /* Collapsed desktop sidebar */
        <div className="flex h-full items-center justify-center">
          <button
            type="button"
            onClick={onToggle}
            className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            aria-label="Expand sidebar"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </aside>
  );
}

export default Sidebar;