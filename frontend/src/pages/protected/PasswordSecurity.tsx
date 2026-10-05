import { FormEvent, useState } from "react";
import { ArrowLeft, CheckCircle2, Lock, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

function PasswordSecurity() {
const navigate = useNavigate();

const [currentPassword, setCurrentPassword] = useState("");
const [newPassword, setNewPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");

const [message, setMessage] = useState("");
const [error, setError] = useState("");

const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
event.preventDefault();

setError("");
setMessage("");

if (!currentPassword || !newPassword || !confirmPassword) {
  setError("Please fill in all password fields.");
  return;
}

if (newPassword.length < 8) {
  setError("New password must contain at least 8 characters.");
  return;
}

if (newPassword !== confirmPassword) {
  setError("New password and confirmation password do not match.");
  return;
}

if (currentPassword === newPassword) {
  setError(
    "Your new password must be different from your current password."
  );
  return;
}

/*
  Frontend validation is complete.

  Actual password persistence will be connected to the
  FastAPI password endpoint when that backend endpoint exists.
*/
setMessage(
  "Password details are valid. Your password update is ready to be connected to the backend."
);

setCurrentPassword("");
setNewPassword("");
setConfirmPassword("");

};

return ( <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8"> <div className="mx-auto max-w-3xl">
{/* Header */} <div className="mb-6">
<button
type="button"
onClick={() => navigate("/settings")}
className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-800"
> <ArrowLeft size={17} />
Back to Settings </button>
      <h1 className="text-2xl font-bold text-slate-900">
        Password & Security
      </h1>

      <p className="mt-1 text-sm text-slate-500">
        Manage your password and account security.
      </p>
    </div>

    {/* Change Password */}
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="app-primary-light app-primary-text flex h-10 w-10 items-center justify-center rounded-lg">
            <Lock size={20} />
          </div>

          <div>
            <h2 className="font-semibold text-slate-900">
              Change Password
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Update your account password.
            </p>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 px-5 py-6 sm:px-6"
      >
        <div>
          <label
            htmlFor="current-password"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Current Password
          </label>

          <input
            id="current-password"
            type="password"
            value={currentPassword}
            onChange={(event) =>
              setCurrentPassword(event.target.value)
            }
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-[var(--app-primary)] focus:ring-2 focus:ring-[var(--app-primary-soft)]"
            placeholder="Enter your current password"
          />
        </div>

        <div>
          <label
            htmlFor="new-password"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            New Password
          </label>

          <input
            id="new-password"
            type="password"
            value={newPassword}
            onChange={(event) =>
              setNewPassword(event.target.value)
            }
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-[var(--app-primary)] focus:ring-2 focus:ring-[var(--app-primary-soft)]"
            placeholder="Enter a new password"
          />

          <p className="mt-1.5 text-xs text-slate-500">
            Use at least 8 characters.
          </p>
        </div>

        <div>
          <label
            htmlFor="confirm-password"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Confirm New Password
          </label>

          <input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(event) =>
              setConfirmPassword(event.target.value)
            }
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-[var(--app-primary)] focus:ring-2 focus:ring-[var(--app-primary-soft)]"
            placeholder="Confirm your new password"
          />
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {message && (
          <div className="flex gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            <CheckCircle2
              size={18}
              className="mt-0.5 shrink-0"
            />
            <span>{message}</span>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            className="app-primary rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Update Password
          </button>
        </div>
      </form>
    </section>

    {/* Security Information */}
    <section className="mt-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex gap-3">
        <div className="app-primary-light app-primary-text flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
          <ShieldCheck size={20} />
        </div>

        <div>
          <h2 className="font-semibold text-slate-900">
            Account Security
          </h2>

          <p className="mt-1 text-sm leading-6 text-slate-500">
            Keep your password private and use a unique password
            for your Finance Intelligence account.
          </p>
        </div>
      </div>
    </section>
  </div>
</div>

);
}

export default PasswordSecurity;
