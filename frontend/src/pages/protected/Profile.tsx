import { useState } from "react";
import {
  AlertTriangle,
  LogOut,
  Pencil,
  Save,
  Trash2,
  UserCircle,
  X,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import type { RootState, AppDispatch } from "../../store/store";
import { logout, setUser } from "../../store/slices/authSlice";
import { getCurrentUser } from "../../services/authService";

const API_URL = "http://127.0.0.1:8000";

function Profile() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const user = useSelector((state: RootState) => state.auth.user);

  const [isEditing, setIsEditing] = useState(false);

  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [currency, setCurrency] = useState(user?.currency ?? "INR");

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const getInitial = (username: string) => {
    return username.trim().charAt(0).toUpperCase();
  };

  const handleEdit = () => {
    if (!user) return;

    setName(user.name);
    setEmail(user.email);
    setCurrency(user.currency);

    setError("");
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (!user) return;

    setName(user.name);
    setEmail(user.email);
    setCurrency(user.currency);

    setError("");
    setIsEditing(false);
  };

  const handleSave = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!user) return;

    if (!name.trim() || !email.trim() || !currency) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const token = localStorage.getItem("access_token");

      const response = await axios.put(
        `${API_URL}/users/${user.id}`,
        {
          name: name.trim(),
          email: email.trim(),
          currency,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      dispatch(setUser(response.data));

      setIsEditing(false);
    } catch (error) {
      console.error(error);

      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.detail ??
            "Unable to update your profile."
        );
      } else {
        setError("Unable to update your profile.");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());

    navigate("/login", {
      replace: true,
    });
  };

  const handleDeleteAccount = async () => {
    if (!user) return;

    try {
      setDeleting(true);
      setError("");

      const token = localStorage.getItem("access_token");

      await axios.delete(`${API_URL}/users/${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch(logout());

      navigate("/login", {
        replace: true,
      });
    } catch (error) {
      console.error(error);

      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.detail ??
            "Unable to delete your account."
        );
      } else {
        setError("Unable to delete your account.");
      }

      setShowDeleteModal(false);
    } finally {
      setDeleting(false);
    }
  };

  const handleRefreshUser = async () => {
    try {
      setError("");

      const currentUser = await getCurrentUser();

      dispatch(setUser(currentUser));

      setName(currentUser.name);
      setEmail(currentUser.email);
      setCurrency(currentUser.currency);
    } catch (error) {
      console.error(error);
      setError("Unable to refresh profile information.");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <UserCircle
            size={48}
            className="mx-auto text-slate-300"
          />

          <h1 className="mt-4 text-lg font-semibold text-slate-900">
            Profile information unavailable
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Please refresh the page and try again.
          </p>

          <button
            type="button"
            onClick={handleRefreshUser}
            className="app-primary mt-5 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition"
          >
            Refresh Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Profile
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage your personal information and account.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Profile card */}
        <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

          {/* Profile header */}
          <div className="border-b border-slate-200 px-5 py-6 sm:px-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-center gap-4">

                {/* User initial */}
                <div className="app-primary-soft app-primary-text flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-xl font-bold">
                  {getInitial(user.name)}
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    {user.name}
                  </h2>

                  <p className="text-sm text-slate-500">
                    {user.email}
                  </p>
                </div>
              </div>

              {!isEditing && (
                <button
                  type="button"
                  onClick={handleEdit}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  <Pencil size={17} />
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* Profile fields */}
          <form
            onSubmit={handleSave}
            className="px-5 py-6 sm:px-6"
          >
            <div className="w-full space-y-5">

              {/* Name */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Full Name
                </label>

                <input
                  type="text"
                  value={name}
                  disabled={!isEditing}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition ${
                    isEditing
                      ? "app-primary-focus border-slate-200 focus:ring-2"
                      : "border-transparent bg-slate-50"
                  }`}
                />
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Email Address
                </label>

                <input
                  type="email"
                  value={email}
                  disabled={!isEditing}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition ${
                    isEditing
                      ? "app-primary-focus border-slate-200 focus:ring-2"
                      : "border-transparent bg-slate-50"
                  }`}
                />
              </div>

              {/* Currency */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Currency
                </label>

                <select
                  value={currency}
                  disabled={!isEditing}
                  onChange={(event) =>
                    setCurrency(event.target.value)
                  }
                  className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition ${
                    isEditing
                      ? "app-primary-focus border-slate-200 focus:ring-2"
                      : "border-transparent bg-slate-50"
                  }`}
                >
                  <option value="INR">
                    INR — Indian Rupee
                  </option>

                  <option value="USD">
                    USD — US Dollar
                  </option>

                  <option value="EUR">
                    EUR — Euro
                  </option>

                  <option value="GBP">
                    GBP — British Pound
                  </option>
                </select>
              </div>
            </div>

            {/* Edit actions */}
            {isEditing && (
              <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
                >
                  <X size={17} />
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="app-primary inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Save size={17} />
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Account actions */}
        <div className="mt-6 rounded-xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
            <div className="flex items-center gap-3">

              <div className="app-primary-light app-primary-text flex h-10 w-10 items-center justify-center rounded-lg">
                <UserCircle size={20} />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900">
                  Account
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Manage your current session.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">

            <div>
              <p className="font-medium text-slate-800">
                Sign Out
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Sign out of your Finance Intelligence account.
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <LogOut size={17} />
              Logout
            </button>
          </div>
        </div>

        {/* Danger zone */}
        <div className="mt-6 rounded-xl border border-red-200 bg-white shadow-sm">

          <div className="border-b border-red-100 px-5 py-5 sm:px-6">
            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-600">
                <AlertTriangle size={20} />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900">
                  Danger Zone
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Permanently remove your account and associated data.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">

            <div>
              <p className="font-medium text-slate-800">
                Delete Account
              </p>

              <p className="mt-1 text-sm text-slate-500">
                This action cannot be undone.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
            >
              <Trash2 size={17} />
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 p-4">

          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">

            <div className="p-6">

              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-red-600">
                <AlertTriangle size={22} />
              </div>

              <h2 className="mt-4 text-lg font-semibold text-slate-900">
                Delete your account?
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                This will permanently delete your account and its
                associated financial data. This action cannot be
                undone.
              </p>

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={deleting}
                  className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  disabled={deleting}
                  className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {deleting
                    ? "Deleting..."
                    : "Yes, Delete Account"}
                </button>

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;