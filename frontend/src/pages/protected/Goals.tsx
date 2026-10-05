import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Pencil,
  Search,
  Target,
  Trash2,
  X,
} from "lucide-react";

import {
  createGoal,
  deleteGoal,
  getGoals,
  updateGoal,
  type FinancialGoal,
} from "../../services/goalService";

interface GoalFormData {
  name: string;
  target_amount: string;
  current_amount: string;
  target_date: string;
  description: string;
}

function Goals() {
  const [goals, setGoals] = useState<FinancialGoal[]>([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] =
    useState<FinancialGoal | null>(null);

  const [formData, setFormData] =
    useState<GoalFormData>({
      name: "",
      target_amount: "",
      current_amount: "0",
      target_date: "",
      description: "",
    });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadGoals = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getGoals();

      setGoals(data);
    } catch (error) {
      console.error(
        "Unable to load goals:",
        error
      );

      setError(
        "Unable to load goals. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGoals();
  }, []);

  const getGoalStatus = (
    goal: FinancialGoal
  ) => {
    const targetDate = new Date(
      goal.target_date
    );

    const today = new Date();

    today.setHours(0, 0, 0, 0);
    targetDate.setHours(0, 0, 0, 0);

    if (
      goal.current_amount >=
      goal.target_amount
    ) {
      return "completed";
    }

    if (targetDate < today) {
      return "overdue";
    }

    return "active";
  };

  const filteredGoals = useMemo(() => {
    return goals.filter((goal) => {
      const matchesSearch =
        goal.name
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const status =
        getGoalStatus(goal);

      const matchesStatus =
        statusFilter === "all" ||
        status === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [
    goals,
    search,
    statusFilter,
  ]);

  const totalTarget = goals.reduce(
    (total, goal) =>
      total + goal.target_amount,
    0
  );

  const totalSaved = goals.reduce(
    (total, goal) =>
      total + goal.current_amount,
    0
  );

  const completedGoals =
    goals.filter(
      (goal) =>
        getGoalStatus(goal) ===
        "completed"
    ).length;

  const formatCurrency = (
    amount: number
  ) => {
    return new Intl.NumberFormat(
      "en-IN",
      {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }
    ).format(amount);
  };

  const formatDate = (
    date: string
  ) => {
    return new Date(
      date
    ).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getProgress = (
    goal: FinancialGoal
  ) => {
    if (goal.target_amount <= 0) {
      return 0;
    }

    return Math.min(
      (goal.current_amount /
        goal.target_amount) *
        100,
      100
    );
  };

  const openCreateModal = () => {
    setEditingGoal(null);

    setFormData({
      name: "",
      target_amount: "",
      current_amount: "0",
      target_date: "",
      description: "",
    });

    setError("");
    setIsModalOpen(true);
  };

  const openEditModal = (
    goal: FinancialGoal
  ) => {
    setEditingGoal(goal);

    setFormData({
      name: goal.name,
      target_amount: String(
        goal.target_amount
      ),
      current_amount: String(
        goal.current_amount
      ),
      target_date:
        goal.target_date,
      description:
        goal.description || "",
    });

    setError("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (saving) {
      return;
    }

    setIsModalOpen(false);
    setEditingGoal(null);
    setError("");
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!formData.name.trim()) {
      setError(
        "Please enter a goal name."
      );
      return;
    }

    if (
      !formData.target_amount ||
      Number(
        formData.target_amount
      ) <= 0
    ) {
      setError(
        "Please enter a valid target amount."
      );
      return;
    }

    if (
      Number(
        formData.current_amount
      ) < 0
    ) {
      setError(
        "Current amount cannot be negative."
      );
      return;
    }

    if (!formData.target_date) {
      setError(
        "Please select a target date."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");

      const data = {
        name: formData.name.trim(),
        target_amount: Number(
          formData.target_amount
        ),
        current_amount: Number(
          formData.current_amount
        ),
        target_date:
          formData.target_date,
        description:
          formData.description.trim() ||
          undefined,
      };

      if (editingGoal) {
        const updatedGoal =
          await updateGoal(
            editingGoal.id,
            data
          );

        setGoals((current) =>
          current.map((goal) =>
            goal.id ===
            updatedGoal.id
              ? updatedGoal
              : goal
          )
        );
      } else {
        const newGoal =
          await createGoal(data);

        setGoals((current) => [
          ...current,
          newGoal,
        ]);
      }

      closeModal();
    } catch (error) {
      console.error(
        "Unable to save goal:",
        error
      );

      setError(
        "Unable to save goal. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (
    goal: FinancialGoal
  ) => {
    const confirmed =
      window.confirm(
        `Delete the goal "${goal.name}"?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteGoal(goal.id);

      setGoals((current) =>
        current.filter(
          (item) =>
            item.id !== goal.id
        )
      );
    } catch (error) {
      console.error(
        "Unable to delete goal:",
        error
      );

      setError(
        "Unable to delete goal. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Target
                size={25}
                className="app-primary-text"
              />

              <h1 className="text-2xl font-bold text-slate-900">
                Goals
              </h1>
            </div>

            <p className="mt-1 text-sm text-slate-500">
              Set financial goals and track your progress over time.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="app-primary inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition"
          >
           + Add Goal
          </button>
        </div>

        {/* Error */}
        {error && !isModalOpen && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Summary */}
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Total Goals
            </p>

            <p className="mt-2 text-2xl font-bold text-slate-900">
              {goals.length}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Total Target
            </p>

            <p className="mt-2 text-2xl font-bold text-slate-900">
              {formatCurrency(
                totalTarget
              )}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Total Saved
            </p>

            <p className="mt-2 text-2xl font-bold text-green-600">
              {formatCurrency(
                totalSaved
              )}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              {completedGoals} completed
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid gap-3 md:grid-cols-2">

            {/* Search */}
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search goals..."
                className="app-primary-focus w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:ring-2"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value
                )
              }
              className="app-primary-focus rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none focus:ring-2"
            >
              <option value="all">
                All Statuses
              </option>

              <option value="active">
                Active
              </option>

              <option value="completed">
                Completed
              </option>

              <option value="overdue">
                Overdue
              </option>
            </select>
          </div>
        </div>

        {/* Goals List */}
        <div className="mt-6 rounded-xl border border-slate-200 bg-white shadow-sm">

          {loading ? (
            <div className="space-y-4 p-6">
              {[1, 2, 3, 4].map(
                (item) => (
                  <div
                    key={item}
                    className="h-32 animate-pulse rounded-lg bg-slate-100"
                  />
                )
              )}
            </div>
          ) : filteredGoals.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <Target
                size={42}
                className="mx-auto text-slate-300"
              />

              <h3 className="mt-4 text-lg font-semibold text-slate-800">
                No goals found
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Create a goal or change your filters.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">

              {filteredGoals.map(
                (goal) => {
                  const progress =
                    getProgress(goal);

                  const status =
                    getGoalStatus(
                      goal
                    );

                  return (
                    <div
                      key={goal.id}
                      className="p-5 transition hover:bg-slate-50"
                    >

                      {/* Goal Header */}
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                        <div className="flex min-w-0 items-start gap-3">

                          <div className="app-primary-light app-primary-text flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                            <Target
                              size={19}
                            />
                          </div>

                          <div className="min-w-0">
                            <h3 className="truncate font-semibold text-slate-900">
                              {goal.name}
                            </h3>

                            <div className="mt-1 flex flex-wrap items-center gap-2">

                              <span
                                className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                                  status ===
                                  "completed"
                                    ? "bg-green-50 text-green-700"
                                    : status ===
                                      "overdue"
                                    ? "bg-red-50 text-red-700"
                                    : "app-primary-light app-primary-text"
                                }`}
                              >
                                {status}
                              </span>

                              <span className="flex items-center gap-1 text-xs text-slate-400">
                                <CalendarDays
                                  size={13}
                                />

                                {formatDate(
                                  goal.target_date
                                )}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 self-end sm:self-auto">

                          <button
                            type="button"
                            onClick={() =>
                              openEditModal(
                                goal
                              )
                            }
                            className="rounded-lg p-2 text-slate-500 transition hover:bg-[var(--app-primary-light)] hover:text-[var(--app-primary-text)]"
                            aria-label="Edit goal"
                          >
                            <Pencil
                              size={17}
                            />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                goal
                              )
                            }
                            className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                            aria-label="Delete goal"
                          >
                            <Trash2
                              size={17}
                            />
                          </button>
                        </div>
                      </div>

                      {/* Description */}
                      {goal.description && (
                        <p className="mt-4 text-sm text-slate-500">
                          {goal.description}
                        </p>
                      )}

                      {/* Amounts */}
                      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">

                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                            Progress
                          </p>

                          <p className="mt-1 text-sm font-semibold text-slate-800">
                            {formatCurrency(
                              goal.current_amount
                            )}{" "}
                            <span className="font-normal text-slate-400">
                              of{" "}
                              {formatCurrency(
                                goal.target_amount
                              )}
                            </span>
                          </p>
                        </div>

                        <p className="text-sm font-semibold app-primary-text">
                          {Math.round(
                            progress
                          )}
                          %
                        </p>
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="app-primary h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${progress}%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 p-4">

          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white shadow-xl">

            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">

              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  {editingGoal
                    ? "Edit Goal"
                    : "Add Goal"}
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Define a financial target and track your progress.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-4 p-5"
            >

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
                  {error}
                </div>
              )}

              {/* Goal Name */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Goal Name
                </label>

                <input
                  type="text"
                  value={formData.name}
                  onChange={(event) =>
                    setFormData(
                      (current) => ({
                        ...current,
                        name: event
                          .target
                          .value,
                      })
                    )
                  }
                  placeholder="e.g. Emergency Fund"
                  className="app-primary-focus w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2"
                  required
                />
              </div>

              {/* Target Amount */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Target Amount
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={
                    formData.target_amount
                  }
                  onChange={(event) =>
                    setFormData(
                      (current) => ({
                        ...current,
                        target_amount:
                          event.target
                            .value,
                      })
                    )
                  }
                  placeholder="e.g. 100000"
                  className="app-primary-focus w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2"
                  required
                />
              </div>

              {/* Current Amount */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Current Amount
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={
                    formData.current_amount
                  }
                  onChange={(event) =>
                    setFormData(
                      (current) => ({
                        ...current,
                        current_amount:
                          event.target
                            .value,
                      })
                    )
                  }
                  placeholder="e.g. 25000"
                  className="app-primary-focus w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2"
                />
              </div>

              {/* Target Date */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Target Date
                </label>

                <input
                  type="date"
                  value={
                    formData.target_date
                  }
                  onChange={(event) =>
                    setFormData(
                      (current) => ({
                        ...current,
                        target_date:
                          event.target
                            .value,
                      })
                    )
                  }
                  className="app-primary-focus w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Description
                </label>

                <textarea
                  value={
                    formData.description
                  }
                  onChange={(event) =>
                    setFormData(
                      (current) => ({
                        ...current,
                        description:
                          event.target
                            .value,
                      })
                    )
                  }
                  placeholder="Add a short description..."
                  rows={3}
                  className="app-primary-focus w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-2">

                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="app-primary rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingGoal
                    ? "Update Goal"
                    : "Add Goal"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Goals;