import { useEffect, useMemo, useState } from "react";
import {
  Edit,
  Search,
  Trash2,
  WalletCards,
  X,
} from "lucide-react";

import {
  getCategories,
  type Category,
} from "../../services/categoryService";

import {
  createBudget,
  deleteBudget,
  getBudgets,
  updateBudget,
  type Budget,
} from "../../services/budgetService";

interface BudgetFormData {
  category_id: number;
  amount: string;
  month: number;
  year: number;
}

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function Budgets() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [search, setSearch] = useState("");
  const [monthFilter, setMonthFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] =
    useState<Budget | null>(null);

  const [formData, setFormData] =
    useState<BudgetFormData>({
      category_id: 0,
      amount: "",
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
    });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [budgetData, categoryData] =
        await Promise.all([
          getBudgets(),
          getCategories(),
        ]);

      setBudgets(budgetData);
      setCategories(categoryData);
    } catch (error) {
      console.error(
        "Unable to load budgets:",
        error
      );

      setError(
        "Unable to load budgets. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getCategoryName = (
    categoryId: number
  ) => {
    return (
      categories.find(
        (category) =>
          category.id === categoryId
      )?.name || "Unknown"
    );
  };

  const expenseCategories = categories.filter(
    (category) =>
      category.type === "expense"
  );

  const filteredBudgets = useMemo(() => {
    return budgets.filter((budget) => {
      const categoryName =
        getCategoryName(
          budget.category_id
        );

      const matchesSearch =
        categoryName
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesMonth =
        monthFilter === "all" ||
        budget.month === Number(monthFilter);

      const matchesYear =
        yearFilter === "all" ||
        budget.year === Number(yearFilter);

      return (
        matchesSearch &&
        matchesMonth &&
        matchesYear
      );
    });
  }, [
    budgets,
    categories,
    search,
    monthFilter,
    yearFilter,
  ]);

  const years = useMemo(() => {
    const uniqueYears = [
      ...new Set(
        budgets.map(
          (budget) => budget.year
        )
      ),
    ];

    const currentYear =
      new Date().getFullYear();

    if (!uniqueYears.includes(currentYear)) {
      uniqueYears.push(currentYear);
    }

    return uniqueYears.sort(
      (a, b) => b - a
    );
  }, [budgets]);

  const totalBudget = filteredBudgets.reduce(
    (total, budget) =>
      total + budget.amount,
    0
  );

  const openAddModal = () => {
    setEditingBudget(null);

    setFormData({
      category_id:
        expenseCategories[0]?.id || 0,
      amount: "",
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
    });

    setError("");
    setIsModalOpen(true);
  };

  const openEditModal = (
    budget: Budget
  ) => {
    setEditingBudget(budget);

    setFormData({
      category_id: budget.category_id,
      amount: String(budget.amount),
      month: budget.month,
      year: budget.year,
    });

    setError("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (saving) {
      return;
    }

    setIsModalOpen(false);
    setEditingBudget(null);
    setError("");
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!formData.category_id) {
      setError(
        "Please select a category."
      );
      return;
    }

    if (
      !formData.amount ||
      Number(formData.amount) <= 0
    ) {
      setError(
        "Please enter a valid budget amount."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");

      const data = {
        category_id: formData.category_id,
        amount: Number(formData.amount),
        month: formData.month,
        year: formData.year,
      };

      if (editingBudget) {
        const updatedBudget =
          await updateBudget(
            editingBudget.id,
            data
          );

        setBudgets((current) =>
          current.map((budget) =>
            budget.id ===
            updatedBudget.id
              ? updatedBudget
              : budget
          )
        );
      } else {
        const newBudget =
          await createBudget(data);

        setBudgets((current) => [
          ...current,
          newBudget,
        ]);
      }

      closeModal();
    } catch (error) {
      console.error(
        "Unable to save budget:",
        error
      );

      setError(
        "Unable to save budget. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (
    budget: Budget
  ) => {
    const confirmed = window.confirm(
      `Delete the budget for ${getCategoryName(
        budget.category_id
      )}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteBudget(budget.id);

      setBudgets((current) =>
        current.filter(
          (item) =>
            item.id !== budget.id
        )
      );
    } catch (error) {
      console.error(
        "Unable to delete budget:",
        error
      );

      setError(
        "Unable to delete budget. Please try again."
      );
    }
  };

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

  return (
    <div className="space-y-6 p-4 sm:p-6">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Budgets
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Set spending limits and keep your finances on track.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 rounded-lg app-primary px-4 py-2.5 text-sm font-medium text-white transition"
        >
         + Add Budget
        </button>
      </div>

      {/* Error */}
      {error && !isModalOpen && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Summary */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg app-primary-light app-primary-text">
            <WalletCards size={20} />
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Total Budget
            </p>

            <p className="mt-0.5 text-xl font-bold text-slate-900">
              {formatCurrency(totalBudget)}
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-3">

          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search categories..."
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:app-primary-border focus:ring-2 focus:ring-[var(--app-primary-soft)]"
            />
          </div>

          <select
            value={monthFilter}
            onChange={(event) =>
              setMonthFilter(
                event.target.value
              )
            }
            className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none focus:app-primary-border"
          >
            <option value="all">
              All Months
            </option>

            {months.map(
              (month, index) => (
                <option
                  key={month}
                  value={index + 1}
                >
                  {month}
                </option>
              )
            )}
          </select>

          <select
            value={yearFilter}
            onChange={(event) =>
              setYearFilter(
                event.target.value
              )
            }
            className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none focus:app-primary-border"
          >
            <option value="all">
              All Years
            </option>

            {years.map((year) => (
              <option
                key={year}
                value={year}
              >
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Budget List */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-200 px-5 py-4">
          <div className="flex items-center gap-2">
            <WalletCards
              size={19}
              className="app-primary-text"
            />

            <h2 className="font-semibold text-slate-900">
              Your Budgets
            </h2>

            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
              {filteredBudgets.length}
            </span>
          </div>
        </div>

        {loading ? (
          <div className="space-y-3 p-5">
            {Array.from({
              length: 4,
            }).map((_, index) => (
              <div
                key={index}
                className="h-24 animate-pulse rounded-lg bg-slate-100"
              />
            ))}
          </div>
        ) : filteredBudgets.length === 0 ? (
          <div className="flex min-h-56 flex-col items-center justify-center px-5 text-center">
            <div className="rounded-full bg-slate-100 p-3">
              <WalletCards
                size={24}
                className="text-slate-400"
              />
            </div>

            <h3 className="mt-3 text-sm font-semibold text-slate-700">
              No budgets found
            </h3>

            <p className="mt-1 text-xs text-slate-400">
              Create a budget or change your filters.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredBudgets.map(
              (budget) => (
                <div
                  key={budget.id}
                  className="flex flex-col gap-4 px-5 py-5 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg app-primary-light app-primary-text">
                      <WalletCards
                        size={18}
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-800">
                        {getCategoryName(
                          budget.category_id
                        )}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {months[
                          budget.month - 1
                        ]}{" "}
                        {budget.year}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-5 sm:justify-end">

                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-900">
                        {formatCurrency(
                          budget.amount
                        )}
                      </p>

                      <p className="text-xs text-slate-400">
                        Monthly limit
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() =>
                          openEditModal(
                            budget
                          )
                        }
                        className="app-primary-hover rounded-lg p-2 text-slate-500 transition"
                        aria-label="Edit budget"
                      >
                        <Edit size={17} />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(
                            budget
                          )
                        }
                        className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                        aria-label="Delete budget"
                      >
                        <Trash2
                          size={17}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white shadow-xl">

            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  {editingBudget
                    ? "Edit Budget"
                    : "Add Budget"}
                </h2>

                <p className="mt-0.5 text-xs text-slate-500">
                  Set a spending limit for a category.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={19} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-5"
            >
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
                  {error}
                </div>
              )}

              {/* Category */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Expense Category
                </label>

                <select
                  value={
                    formData.category_id
                  }
                  onChange={(event) =>
                    setFormData(
                      (current) => ({
                        ...current,
                        category_id:
                          Number(
                            event.target
                              .value
                          ),
                      })
                    )
                  }
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none focus:app-primary-border focus:ring-2 focus:ring-[var(--app-primary-soft)]"
                >
                  <option value={0}>
                    Select category
                  </option>

                  {expenseCategories.map(
                    (category) => (
                      <option
                        key={category.id}
                        value={category.id}
                      >
                        {category.name}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* Amount */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Budget Amount
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.amount}
                  onChange={(event) =>
                    setFormData(
                      (current) => ({
                        ...current,
                        amount:
                          event.target
                            .value,
                      })
                    )
                  }
                  placeholder="e.g. 10000"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none placeholder:text-slate-400 focus:app-primary-border focus:ring-2 focus:ring-[var(--app-primary-soft)]"
                />
              </div>

              {/* Month + Year */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Month
                  </label>

                  <select
                    value={formData.month}
                    onChange={(event) =>
                      setFormData(
                        (current) => ({
                          ...current,
                          month: Number(
                            event.target
                              .value
                          ),
                        })
                      )
                    }
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none focus:app-primary-border focus:ring-2 focus:ring-[var(--app-primary-soft)]"
                  >
                    {months.map(
                      (
                        month,
                        index
                      ) => (
                        <option
                          key={month}
                          value={
                            index + 1
                          }
                        >
                          {month}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Year
                  </label>

                  <input
                    type="number"
                    min="2000"
                    value={formData.year}
                    onChange={(event) =>
                      setFormData(
                        (current) => ({
                          ...current,
                          year: Number(
                            event.target
                              .value
                          ),
                        })
                      )
                    }
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:app-primary-border focus:ring-2 focus:ring-[var(--app-primary-soft)]"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg app-primary px-4 py-2.5 text-sm font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingBudget
                      ? "Update Budget"
                      : "Add Budget"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Budgets;