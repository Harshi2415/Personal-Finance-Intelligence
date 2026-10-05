import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Pencil,
  Repeat2,
  Search,
  Trash2,
  X,
} from "lucide-react";
import {
  createRecurringExpense,
  deleteRecurringExpense,
  getRecurringExpenses,
  updateRecurringExpense,
  type RecurringExpense,
} from "../../services/recurringExpenseService";
import {
  getCategories,
  type Category,
} from "../../services/categoryService";

function RecurringExpenses() {
  const [expenses, setExpenses] = useState<RecurringExpense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [search, setSearch] = useState("");
  const [frequencyFilter, setFrequencyFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] =
    useState<RecurringExpense | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    category_id: "",
    name: "",
    amount: "",
    frequency: "monthly",
    next_due_date: "",
    description: "",
  });

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [expenseData, categoryData] = await Promise.all([
        getRecurringExpenses(),
        getCategories(),
      ]);

      setExpenses(expenseData);
      setCategories(categoryData);
    } catch (error) {
      console.error(error);
      setError("Unable to load recurring expenses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      const matchesSearch =
        expense.name.toLowerCase().includes(search.toLowerCase()) ||
        (expense.description ?? "")
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesFrequency =
        frequencyFilter === "all" ||
        expense.frequency === frequencyFilter;

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && expense.is_active) ||
        (statusFilter === "inactive" && !expense.is_active);

      return matchesSearch && matchesFrequency && matchesStatus;
    });
  }, [expenses, search, frequencyFilter, statusFilter]);

  const totalMonthlyAmount = expenses
    .filter(
      (expense) =>
        expense.is_active && expense.frequency.toLowerCase() === "monthly"
    )
    .reduce((total, expense) => total + expense.amount, 0);

  const openCreateModal = () => {
    setEditingExpense(null);

    setFormData({
      category_id: "",
      name: "",
      amount: "",
      frequency: "monthly",
      next_due_date: "",
      description: "",
    });

    setIsModalOpen(true);
  };

  const openEditModal = (expense: RecurringExpense) => {
    setEditingExpense(expense);

    setFormData({
      category_id: String(expense.category_id),
      name: expense.name,
      amount: String(expense.amount),
      frequency: expense.frequency,
      next_due_date: expense.next_due_date,
      description: expense.description ?? "",
    });

    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;

    setIsModalOpen(false);
    setEditingExpense(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      !formData.category_id ||
      !formData.name.trim() ||
      !formData.amount ||
      !formData.next_due_date
    ) {
      return;
    }

    try {
      setSaving(true);
      setError("");

      if (editingExpense) {
        const updatedExpense = await updateRecurringExpense(
          editingExpense.id,
          {
            category_id: Number(formData.category_id),
            name: formData.name.trim(),
            amount: Number(formData.amount),
            frequency: formData.frequency,
            next_due_date: formData.next_due_date,
            description: formData.description.trim() || undefined,
          }
        );

        setExpenses((current) =>
          current.map((expense) =>
            expense.id === updatedExpense.id
              ? updatedExpense
              : expense
          )
        );
      } else {
        const newExpense = await createRecurringExpense({
          category_id: Number(formData.category_id),
          name: formData.name.trim(),
          amount: Number(formData.amount),
          frequency: formData.frequency,
          next_due_date: formData.next_due_date,
          description: formData.description.trim() || undefined,
        });

        setExpenses((current) => [newExpense, ...current]);
      }

      closeModal();
    } catch (error) {
      console.error(error);
      setError("Unable to save recurring expense.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (expenseId: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this recurring expense?"
    );

    if (!confirmed) return;

    try {
      setError("");

      await deleteRecurringExpense(expenseId);

      setExpenses((current) =>
        current.filter((expense) => expense.id !== expenseId)
      );
    } catch (error) {
      console.error(error);
      setError("Unable to delete recurring expense.");
    }
  };

  const handleToggleStatus = async (expense: RecurringExpense) => {
    try {
      setError("");

      const updatedExpense = await updateRecurringExpense(
        expense.id,
        {
          is_active: !expense.is_active,
        }
      );

      setExpenses((current) =>
        current.map((item) =>
          item.id === updatedExpense.id ? updatedExpense : item
        )
      );
    } catch (error) {
      console.error(error);
      setError("Unable to update expense status.");
    }
  };

  const getCategoryName = (categoryId: number) => {
    return (
      categories.find((category) => category.id === categoryId)?.name ??
      "Unknown"
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Repeat2
                className="app-primary-text"
                size={25}
              />

              <h1 className="text-2xl font-bold text-slate-900">
                Recurring Expenses
              </h1>
            </div>

            <p className="mt-1 text-sm text-slate-500">
              Manage your regular and repeating expenses.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="app-primary inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition"
          >
           + Add Recurring Expense
          </button>
        </div>

        {/* Summary */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Active Recurring Expenses
            </p>

            <p className="mt-2 text-2xl font-bold text-slate-900">
              {expenses.filter((expense) => expense.is_active).length}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Active Monthly Expenses
            </p>

            <p className="mt-2 text-2xl font-bold text-slate-900">
              {formatCurrency(totalMonthlyAmount)}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid gap-3 md:grid-cols-3">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search recurring expenses..."
                className="app-primary-focus w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:ring-2"
              />
            </div>

            <select
              value={frequencyFilter}
              onChange={(event) => setFrequencyFilter(event.target.value)}
              className="app-primary-focus rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2"
            >
              <option value="all">All Frequencies</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="app-primary-focus rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Content */}
        <div className="mt-6 rounded-xl border border-slate-200 bg-white shadow-sm">
          {loading ? (
            <div className="space-y-4 p-6">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-16 animate-pulse rounded-lg bg-slate-100"
                />
              ))}
            </div>
          ) : filteredExpenses.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <Repeat2
                size={42}
                className="mx-auto text-slate-300"
              />

              <h3 className="mt-4 text-lg font-semibold text-slate-800">
                No recurring expenses found
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Add a recurring expense to start tracking regular payments.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex flex-col gap-4 p-5 transition hover:bg-slate-50 lg:flex-row lg:items-center lg:justify-between"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-slate-900">
                        {expense.name}
                      </h3>

                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          expense.is_active
                            ? "bg-green-50 text-green-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {expense.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
                      <span>
                        Category: {getCategoryName(expense.category_id)}
                      </span>

                      <span className="capitalize">
                        Frequency: {expense.frequency}
                      </span>

                      <span className="flex items-center gap-1">
                        <CalendarDays size={14} />
                        Next: {formatDate(expense.next_due_date)}
                      </span>
                    </div>

                    {expense.description && (
                      <p className="mt-2 text-sm text-slate-500">
                        {expense.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-4 lg:justify-end">
                    <p className="text-lg font-bold text-slate-900">
                      {formatCurrency(expense.amount)}
                    </p>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(expense)}
                        className="rounded-lg px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-100"
                      >
                        {expense.is_active ? "Pause" : "Activate"}
                      </button>

                      <button
                        type="button"
                        onClick={() => openEditModal(expense)}
                        className="rounded-lg p-2 text-slate-500 transition hover:bg-[var(--app-primary-light)] hover:text-[var(--app-primary-text)]"
                        aria-label="Edit recurring expense"
                      >
                        <Pencil size={17} />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(expense.id)}
                        className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                        aria-label="Delete recurring expense"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  {editingExpense
                    ? "Edit Recurring Expense"
                    : "Add Recurring Expense"}
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Keep your regular payments organized.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 p-5">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Expense Name
                </label>

                <input
                  type="text"
                  value={formData.name}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      name: event.target.value,
                    })
                  }
                  placeholder="e.g. Netflix subscription"
                  className="app-primary-focus w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2"
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Category
                </label>

                <select
                  value={formData.category_id}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      category_id: event.target.value,
                    })
                  }
                  className="app-primary-focus w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2"
                  required
                >
                  <option value="">Select category</option>

                  {categories
                    .filter((category) => category.type === "expense")
                    .map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                </select>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Amount
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.amount}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        amount: event.target.value,
                      })
                    }
                    placeholder="0.00"
                    className="app-primary-focus w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Frequency
                  </label>

                  <select
                    value={formData.frequency}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        frequency: event.target.value,
                      })
                    }
                    className="app-primary-focus w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm capitalize outline-none focus:ring-2"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Next Due Date
                </label>

                <input
                  type="date"
                  value={formData.next_due_date}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      next_due_date: event.target.value,
                    })
                  }
                  className="app-primary-focus w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2"
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Description
                </label>

                <textarea
                  value={formData.description}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      description: event.target.value,
                    })
                  }
                  placeholder="Optional description"
                  rows={3}
                  className="app-primary-focus w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
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
                    : editingExpense
                      ? "Update Expense"
                      : "Add Expense"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default RecurringExpenses;