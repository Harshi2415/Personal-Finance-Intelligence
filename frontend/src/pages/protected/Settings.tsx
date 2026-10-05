import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Check,
  Globe,
  Lock,
  Palette,
  Shield,
  User,
} from "lucide-react";

import type { RootState, AppDispatch } from "../../store/store";
import {
  setTheme,
  type Theme,
} from "../../store/slices/themeSlice";

interface NotificationPreferences {
  budget: boolean;
  goal: boolean;
  recurring: boolean;
  summary: boolean;
}

const defaultNotificationPreferences: NotificationPreferences = {
  budget: true,
  goal: true,
  recurring: true,
  summary: true,
};

function Settings() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const currentTheme = useSelector(
    (state: RootState) => state.theme.theme
  );

  const [notificationPreferences, setNotificationPreferences] =
    useState<NotificationPreferences>(() => {
      const savedPreferences = localStorage.getItem(
        "notification_preferences"
      );

      if (!savedPreferences) {
        return defaultNotificationPreferences;
      }

      try {
        return JSON.parse(savedPreferences);
      } catch {
        return defaultNotificationPreferences;
      }
    });

  useEffect(() => {
    localStorage.setItem(
      "notification_preferences",
      JSON.stringify(notificationPreferences)
    );

    window.dispatchEvent(
      new Event("notification-preferences-changed")
    );
  }, [notificationPreferences]);

  const handleThemeChange = (theme: Theme) => {
    dispatch(setTheme(theme));
  };

  const handleNotificationChange = (
    type: keyof NotificationPreferences
  ) => {
    setNotificationPreferences((current) => ({
      ...current,
      [type]: !current[type],
    }));
  };

  const themes = [
    {
      id: "blue" as Theme,
      name: "Blue",
      description: "Professional blue finance theme",
      color: "bg-blue-600",
    },
    {
      id: "teal" as Theme,
      name: "Teal",
      description: "Calm teal finance theme",
      color: "bg-teal-600",
    },
    {
      id: "violet" as Theme,
      name: "Violet",
      description: "Modern violet finance theme",
      color: "bg-violet-600",
    },
  ];

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Settings
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage your preferences and customize your finance
            dashboard.
          </p>
        </div>

        {/* Appearance */}
        <section className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="app-primary-light app-primary-text flex h-10 w-10 items-center justify-center rounded-lg">
                <Palette size={20} />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900">
                  Appearance
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Customize how your application looks.
                </p>
              </div>
            </div>
          </div>

          <div className="px-5 py-6 sm:px-6">
            <p className="text-sm font-medium text-slate-700">
              Color Theme
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Select a primary color for your application.
            </p>

            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {themes.map((theme) => {
                const isSelected = currentTheme === theme.id;

                return (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => handleThemeChange(theme.id)}
                    className={`rounded-xl border-2 p-4 text-left transition hover:shadow-sm ${
                      isSelected
                        ? "app-primary-border"
                        : "border-slate-200"
                    }`}
                  >
                    <div
                      className={`h-10 rounded-lg ${theme.color}`}
                    />

                    <div className="mt-3 flex items-center justify-between">
                      <p className="font-semibold text-slate-900">
                        {theme.name}
                      </p>

                      {isSelected && (
                        <span className="app-primary flex h-6 w-6 items-center justify-center text-white">
                          <Check size={14} />
                        </span>
                      )}
                    </div>

                    <p className="mt-1 text-xs text-slate-500">
                      {theme.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="app-primary-light app-primary-text flex h-10 w-10 items-center justify-center rounded-lg">
                <Bell size={20} />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900">
                  Notifications
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Choose which financial updates you want to receive.
                </p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            <NotificationSetting
              title="Budget Alerts"
              description="Get notified when your spending approaches a budget limit."
              enabled={notificationPreferences.budget}
              onChange={() =>
                handleNotificationChange("budget")
              }
            />

            <NotificationSetting
              title="Goal Reminders"
              description="Receive reminders about your financial goals."
              enabled={notificationPreferences.goal}
              onChange={() =>
                handleNotificationChange("goal")
              }
            />

            <NotificationSetting
              title="Recurring Expense Reminders"
              description="Get notified when a recurring payment is approaching."
              enabled={notificationPreferences.recurring}
              onChange={() =>
                handleNotificationChange("recurring")
              }
            />

            <NotificationSetting
              title="Monthly Financial Summary"
              description="Receive a summary of your income, expenses and savings."
              enabled={notificationPreferences.summary}
              onChange={() =>
                handleNotificationChange("summary")
              }
            />
          </div>
        </section>

        {/* Regional Preferences */}
        <section className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="app-primary-light app-primary-text flex h-10 w-10 items-center justify-center rounded-lg">
                <Globe size={20} />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900">
                  Regional Preferences
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Manage currency and regional display preferences.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-5 px-5 py-6 sm:grid-cols-2 sm:px-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Currency
              </label>

              <select className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500">
                <option>INR — Indian Rupee</option>
                <option>USD — US Dollar</option>
                <option>EUR — Euro</option>
                <option>GBP — British Pound</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Date Format
              </label>

              <select className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500">
                <option>DD/MM/YYYY</option>
                <option>MM/DD/YYYY</option>
                <option>YYYY-MM-DD</option>
              </select>
            </div>
          </div>
        </section>

        {/* Account & Security */}
        <section className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="app-primary-light app-primary-text flex h-10 w-10 items-center justify-center rounded-lg">
                <Shield size={20} />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900">
                  Account & Security
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Manage your account security preferences.
                </p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            <SettingsRow
              icon={<User size={18} />}
              title="Profile"
              description="Update your personal information."
              onClick={() => navigate("/profile")}
            />

            <SettingsRow
              icon={<Lock size={18} />}
              title="Password & Security"
              description="Manage your account password and security."
              onClick={() => navigate("/password-security")}
            />
          </div>
        </section>
      </div>
    </div>
  );
}

interface NotificationSettingProps {
  title: string;
  description: string;
  enabled: boolean;
  onChange: () => void;
}

function NotificationSetting({
  title,
  description,
  enabled,
  onChange,
}: NotificationSettingProps) {
  return (
    <div className="flex items-center justify-between gap-5 px-5 py-4 sm:px-6">
      <div>
        <p className="text-sm font-medium text-slate-800">
          {title}
        </p>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          {description}
        </p>
      </div>

      <button
        type="button"
        onClick={onChange}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          enabled ? "app-primary" : "bg-slate-300"
        }`}
        aria-label={`Toggle ${title}`}
        aria-pressed={enabled}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-all ${
            enabled ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}

interface SettingsRowProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}

function SettingsRow({
  icon,
  title,
  description,
  onClick,
}: SettingsRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-4 px-5 py-4 text-left transition hover:bg-slate-50 sm:px-6"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
        {icon}
      </div>

      <div>
        <p className="text-sm font-medium text-slate-800">
          {title}
        </p>

        <p className="mt-1 text-xs text-slate-500">
          {description}
        </p>
      </div>
    </button>
  );
}

export default Settings;