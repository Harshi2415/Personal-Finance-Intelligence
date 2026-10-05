import {
  ArrowDownLeft,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Search,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  createTransaction,
  deleteTransaction,
  getTransactions,
  updateTransaction,
  type TransactionResponse,
} from "../../services/transactionService";
import {
  getCategories,
  type Category,
} from "../../services/categoryService";

interface Transaction {
  id: number;
  title: string;
  categoryId: number;
  categoryName: string;
  type: "income" | "expense";
  amount: number;
  date: string;
  paymentMethod: string;
}

const ITEMS_PER_PAGE = 10;

function Transactions() {
  const [transactionList, setTransactionList] = useState<
    Transaction[]
  >([]);

  const [categories, setCategories] = useState<Category[]>([]);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [type, setType] = useState("all");
  const [category, setCategory] = useState("all");
  const [period, setPeriod] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransactionId, setEditingTransactionId] =
    useState<number | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    type: "expense",
    categoryId: "",
    amount: "",
    date: "",
    paymentMethod: "Cash",
  });

  /*
    Load categories and transactions when the page opens.
  */
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError("");

        const [categoryData, transactionData] =
          await Promise.all([
            getCategories(),
            getTransactions(),
          ]);

        setCategories(categoryData);

        const formattedTransactions: Transaction[] =
          transactionData.map(
            (transaction: TransactionResponse) => {
              const transactionCategory =
                categoryData.find(
                  (categoryItem) =>
                    categoryItem.id ===
                    transaction.category_id
                );

              return {
                id: transaction.id,
                title:
                  transaction.description ||
                  transactionCategory?.name ||
                  "Transaction",
                categoryId:
                  transaction.category_id,
                categoryName:
                  transactionCategory?.name ||
                  "Unknown",
                type: transaction.type,
                amount: Number(transaction.amount),
                date: transaction.transaction_date,
                paymentMethod:
                  transaction.payment_method,
              };
            }
          );

        setTransactionList(formattedTransactions);
      } catch (error) {
        console.error(
          "Unable to load transaction data:",
          error
        );

        setError(
          "Unable to load transactions. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  /*
    Debounced search.

    Filtering starts 400ms after the user
    stops typing.
  */
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => {
      clearTimeout(timer);
    };
  }, [search]);

  /*
    Check whether a transaction belongs
    to the selected time period.
  */
  const matchesPeriod = (
    transactionDate: string
  ) => {
    if (period === "all") {
      return true;
    }

    const date = new Date(transactionDate);
    const today = new Date();

    /*
      This Week

      Week starts on Monday.
    */
    if (period === "week") {
      const currentDay = today.getDay();

      const daysFromMonday =
        currentDay === 0 ? 6 : currentDay - 1;

      const startOfWeek = new Date(today);

      startOfWeek.setDate(
        today.getDate() - daysFromMonday
      );

      startOfWeek.setHours(0, 0, 0, 0);

      const endOfWeek = new Date(startOfWeek);

      endOfWeek.setDate(
        startOfWeek.getDate() + 7
      );

      return (
        date >= startOfWeek &&
        date < endOfWeek
      );
    }

    /*
      This Month
    */
    if (period === "month") {
      return (
        date.getFullYear() ===
          today.getFullYear() &&
        date.getMonth() === today.getMonth()
      );
    }

    /*
      This Year
    */
    if (period === "year") {
      return (
        date.getFullYear() ===
        today.getFullYear()
      );
    }

    return true;
  };

  /*
    Filter transactions based on:

    1. Search
    2. Type
    3. Category
    4. Time period
  */
  const filteredTransactions = useMemo(() => {
    const searchValue =
      debouncedSearch.trim().toLowerCase();

    return transactionList.filter((transaction) => {
      const matchesSearch =
        !searchValue ||
        transaction.title
          .toLowerCase()
          .includes(searchValue) ||
        transaction.categoryName
          .toLowerCase()
          .includes(searchValue);

      const matchesType =
        type === "all" ||
        transaction.type === type;

      const matchesCategory =
        category === "all" ||
        transaction.categoryName === category;

      const matchesSelectedPeriod =
        matchesPeriod(transaction.date);

      return (
        matchesSearch &&
        matchesType &&
        matchesCategory &&
        matchesSelectedPeriod
      );
    });
  }, [
    debouncedSearch,
    type,
    category,
    period,
    transactionList,
  ]);

  /*
    Calculate total number of pages.
  */
  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredTransactions.length /
        ITEMS_PER_PAGE
    )
  );

  /*
    Display only 10 transactions
    on the current page.
  */
  const paginatedTransactions = useMemo(() => {
    const startIndex =
      (currentPage - 1) *
      ITEMS_PER_PAGE;

    return filteredTransactions.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE
    );
  }, [
    filteredTransactions,
    currentPage,
  ]);

  /*
    Reset pagination whenever
    a filter or search changes.
  */
  useEffect(() => {
    setCurrentPage(1);
  }, [
    debouncedSearch,
    type,
    category,
    period,
  ]);

  /*
    Keep the current page valid
    after deleting/filtering transactions.
  */
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [
    currentPage,
    totalPages,
  ]);

  /*
    Reset form.
  */
  const resetForm = () => {
    setFormData({
      title: "",
      type: "expense",
      categoryId: "",
      amount: "",
      date: "",
      paymentMethod: "Cash",
    });

    setEditingTransactionId(null);
  };

  /*
    Open Add Transaction modal.
  */
  const handleOpenAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  /*
    Open Edit Transaction modal.
  */
  const handleEditTransaction = (
    transaction: Transaction
  ) => {
    setEditingTransactionId(transaction.id);

    setFormData({
      title: transaction.title,
      type: transaction.type,
      categoryId: String(
        transaction.categoryId
      ),
      amount: String(transaction.amount),
      date: transaction.date,
      paymentMethod:
        transaction.paymentMethod,
    });

    setIsModalOpen(true);
  };

  /*
    Add OR update transaction.
  */
  const handleSaveTransaction = async () => {
    if (!formData.title.trim()) {
      alert(
        "Please enter a transaction title."
      );
      return;
    }

    if (!formData.categoryId) {
      alert("Please select a category.");
      return;
    }

    if (
      !formData.amount ||
      Number(formData.amount) <= 0
    ) {
      alert("Please enter a valid amount.");
      return;
    }

    if (!formData.date) {
      alert("Please select a date.");
      return;
    }

    if (!formData.paymentMethod) {
      alert(
        "Please select a payment method."
      );
      return;
    }

    try {
      setIsSubmitting(true);

      const transactionData = {
        category_id: Number(
          formData.categoryId
        ),
        amount: Number(formData.amount),
        type: formData.type as
          | "income"
          | "expense",
        description:
          formData.title.trim(),
        transaction_date:
          formData.date,
        payment_method:
          formData.paymentMethod,
      };

      /*
        UPDATE
      */
      if (
        editingTransactionId !== null
      ) {
        const updatedTransaction =
          await updateTransaction(
            editingTransactionId,
            transactionData
          );

        const selectedCategory =
          categories.find(
            (categoryItem) =>
              categoryItem.id ===
              updatedTransaction.category_id
          );

        const updatedTransactionData: Transaction =
          {
            id:
              updatedTransaction.id,
            title:
              updatedTransaction.description ||
              selectedCategory?.name ||
              "Transaction",
            categoryId:
              updatedTransaction.category_id,
            categoryName:
              selectedCategory?.name ||
              "Unknown",
            type:
              updatedTransaction.type,
            amount: Number(
              updatedTransaction.amount
            ),
            date:
              updatedTransaction.transaction_date,
            paymentMethod:
              updatedTransaction.payment_method,
          };

        setTransactionList(
          (currentTransactions) =>
            currentTransactions.map(
              (transaction) =>
                transaction.id ===
                editingTransactionId
                  ? updatedTransactionData
                  : transaction
            )
        );
      }

      /*
        CREATE
      */
      else {
        const createdTransaction =
          await createTransaction(
            transactionData
          );

        const selectedCategory =
          categories.find(
            (categoryItem) =>
              categoryItem.id ===
              createdTransaction.category_id
          );

        const newTransaction: Transaction =
          {
            id:
              createdTransaction.id,
            title:
              createdTransaction.description ||
              selectedCategory?.name ||
              "Transaction",
            categoryId:
              createdTransaction.category_id,
            categoryName:
              selectedCategory?.name ||
              "Unknown",
            type:
              createdTransaction.type,
            amount: Number(
              createdTransaction.amount
            ),
            date:
              createdTransaction.transaction_date,
            paymentMethod:
              createdTransaction.payment_method,
          };

        setTransactionList(
          (currentTransactions) => [
            newTransaction,
            ...currentTransactions,
          ]
        );
      }

      resetForm();
      setIsModalOpen(false);
    } catch (error) {
      console.error(
        "Unable to save transaction:",
        error
      );

      alert(
        editingTransactionId !== null
          ? "Unable to update transaction. Please try again."
          : "Unable to create transaction. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /*
    Delete transaction.
  */
  const handleDeleteTransaction =
    async (transactionId: number) => {
      const shouldDelete =
        window.confirm(
          "Are you sure you want to delete this transaction?"
        );

      if (!shouldDelete) {
        return;
      }

      try {
        await deleteTransaction(
          transactionId
        );

        setTransactionList(
          (currentTransactions) =>
            currentTransactions.filter(
              (transaction) =>
                transaction.id !==
                transactionId
            )
        );
      } catch (error) {
        console.error(
          "Unable to delete transaction:",
          error
        );

        alert(
          "Unable to delete transaction. Please try again."
        );
      }
    };

  /*
    Pagination controls.
  */
  const handlePreviousPage = () => {
    setCurrentPage((page) =>
      Math.max(page - 1, 1)
    );
  };

  const handleNextPage = () => {
    setCurrentPage((page) =>
      Math.min(
        page + 1,
        totalPages
      )
    );
  };

  /*
    Displayed transaction range.
  */
  const firstDisplayedTransaction =
    filteredTransactions.length === 0
      ? 0
      : (currentPage - 1) *
          ITEMS_PER_PAGE +
        1;

  const lastDisplayedTransaction =
    Math.min(
      currentPage * ITEMS_PER_PAGE,
      filteredTransactions.length
    );

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Transactions
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              View and manage your financial transactions.
            </p>
          </div>

          <button
            type="button"
            onClick={
              handleOpenAddModal
            }
            className="rounded-lg app-primary px-4 py-2.5 text-sm font-semibold text-white transition"
          >
            + Add Transaction
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="grid gap-3 md:grid-cols-5">

                {/* Search */}
                <div className="relative md:col-span-2">
                <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                    type="text"
                    placeholder="Search transactions..."
                    value={search}
                    onChange={(event) =>
                    setSearch(
                        event.target.value
                    )
                    }
                    className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:app-primary-border focus:ring-2 focus:ring-[var(--app-primary-soft)]"
                />
                </div>

                {/* Type */}
                <select
                value={type}
                onChange={(event) =>
                    setType(
                    event.target.value
                    )
                }
                className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none focus:app-primary-border"
                >
                <option value="all">
                    All Types
                </option>

                <option value="income">
                    Income
                </option>

                <option value="expense">
                    Expense
                </option>
                </select>

                {/* Category */}
                <select
                value={category}
                onChange={(event) =>
                    setCategory(
                    event.target.value
                    )
                }
                className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none focus:app-primary-border"
                >
                <option value="all">
                    All Categories
                </option>

                {categories.map(
                    (categoryItem) => (
                    <option
                        key={categoryItem.id}
                        value={
                        categoryItem.name
                        }
                    >
                        {categoryItem.name}
                    </option>
                    )
                )}
                </select>

                {/* Time Period Filter */}
                <select
                value={period}
                onChange={(event) =>
                    setPeriod(
                    event.target.value
                    )
                }
                className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none focus:app-primary-border"
                >
                <option value="all">
                    All Time
                </option>

                <option value="week">
                    This Week
                </option>

                <option value="month">
                    This Month
                </option>

                <option value="year">
                    This Year
                </option>
                </select>
            </div>
        </div>

        {/* Table */}
        <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">

            <table className="w-full min-w-[850px]">

              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">

                  <th className="px-5 py-4 text-left text-xs font-semibold text-slate-500">
                    Transaction
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold text-slate-500">
                    Category
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold text-slate-500">
                    Type
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold text-slate-500">
                    Date
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-semibold text-slate-500">
                    Amount
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-semibold text-slate-500">
                    Actions
                  </th>

                </tr>
              </thead>

              <tbody>

                {isLoading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-12 text-center text-sm text-slate-500"
                    >
                      Loading transactions...
                    </td>
                  </tr>
                ) : (
                  <>
                    {paginatedTransactions.map(
                      (transaction) => {
                        const isIncome =
                          transaction.type ===
                          "income";

                        return (
                          <tr
                            key={
                              transaction.id
                            }
                            className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                          >

                            {/* Transaction */}
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">

                                <div
                                  className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                                    isIncome
                                      ? "bg-green-50 text-green-600"
                                      : "bg-red-50 text-red-600"
                                  }`}
                                >
                                  {isIncome ? (
                                    <ArrowDownLeft
                                      size={18}
                                    />
                                  ) : (
                                    <ArrowUpRight
                                      size={18}
                                    />
                                  )}
                                </div>

                                <span className="text-sm font-semibold text-slate-800">
                                  {
                                    transaction.title
                                  }
                                </span>

                              </div>
                            </td>

                            {/* Category */}
                            <td className="px-5 py-4 text-sm text-slate-500">
                              {
                                transaction.categoryName
                              }
                            </td>

                            {/* Type */}
                            <td className="px-5 py-4">
                              <span
                                className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                                  isIncome
                                    ? "bg-green-50 text-green-700"
                                    : "bg-red-50 text-red-700"
                                }`}
                              >
                                {isIncome
                                  ? "Income"
                                  : "Expense"}
                              </span>
                            </td>

                            {/* Date */}
                            <td className="px-5 py-4 text-sm text-slate-500">
                              {new Date(
                                transaction.date
                              ).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "2-digit",
                                  month:
                                    "short",
                                  year: "numeric",
                                }
                              )}
                            </td>

                            {/* Amount */}
                            <td
                              className={`px-5 py-4 text-right text-sm font-semibold ${
                                isIncome
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {isIncome
                                ? "+"
                                : "-"}
                              ₹
                              {transaction.amount.toLocaleString(
                                "en-IN"
                              )}
                            </td>

                            {/* Actions */}
                            <td className="px-5 py-4">
                              <div className="flex justify-end gap-2">

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleEditTransaction(
                                      transaction
                                    )
                                  }
                                  className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-50"
                                  aria-label="Edit transaction"
                                  title="Edit transaction"
                                >
                                  <Pencil
                                    size={16}
                                  />
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleDeleteTransaction(
                                      transaction.id
                                    )
                                  }
                                  className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                                  aria-label="Delete transaction"
                                  title="Delete transaction"
                                >
                                  <Trash2
                                    size={16}
                                  />
                                </button>

                              </div>
                            </td>

                          </tr>
                        );
                      }
                    )}

                    {paginatedTransactions.length ===
                      0 && (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-5 py-12 text-center text-sm text-slate-500"
                        >
                          No transactions found.
                        </td>
                      </tr>
                    )}

                  </>
                )}

              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

            <p className="text-xs text-slate-500">
              {filteredTransactions.length ===
              0
                ? "Showing 0 transactions"
                : `Showing ${firstDisplayedTransaction}-${lastDisplayedTransaction} of ${filteredTransactions.length} transactions`}
            </p>

            <div className="flex items-center gap-2">

              <button
                type="button"
                onClick={
                  handlePreviousPage
                }
                disabled={
                  currentPage === 1
                }
                className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Previous page"
              >
                <ChevronLeft
                  size={16}
                />
              </button>

              <div className="flex items-center gap-1">

                {Array.from(
                  {
                    length: totalPages,
                  },
                  (_, index) =>
                    index + 1
                ).map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() =>
                      setCurrentPage(
                        page
                      )
                    }
                    className={`flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-xs font-semibold transition ${
                      currentPage ===
                      page
                        ? "app-primary text-white"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {page}
                  </button>
                ))}

              </div>

              <button
                type="button"
                onClick={
                  handleNextPage
                }
                disabled={
                  currentPage ===
                  totalPages
                }
                className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Next page"
              >
                <ChevronRight
                  size={16}
                />
              </button>

            </div>
          </div>
        </div>

        {/* Add/Edit Transaction Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 px-4">

            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">

              {/* Modal Header */}
              <div className="flex items-start justify-between">

                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {editingTransactionId !==
                    null
                      ? "Edit Transaction"
                      : "Add Transaction"}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {editingTransactionId !==
                    null
                      ? "Update your transaction details."
                      : "Record a new income or expense."}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(
                      false
                    );
                    resetForm();
                  }}
                  className="text-2xl leading-none text-slate-400 hover:text-slate-600"
                  aria-label="Close"
                >
                  ×
                </button>

              </div>

              {/* Form */}
              <div className="mt-6 space-y-4">

                {/* Title */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Transaction title
                  </label>

                  <input
                    type="text"
                    placeholder="e.g. Grocery Shopping"
                    value={
                      formData.title
                    }
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        title:
                          event.target
                            .value,
                      })
                    }
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:app-primary-border focus:ring-2 focus:ring-[var(--app-primary-soft)]"
                  />
                </div>

                {/* Type + Category */}
                <div className="grid gap-4 sm:grid-cols-2">

                  {/* Type */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Type
                    </label>

                    <select
                      value={
                        formData.type
                      }
                      onChange={(event) =>
                        setFormData({
                          ...formData,
                          type:
                            event.target
                              .value,
                          categoryId:
                            "",
                        })
                      }
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:app-primary-border"
                    >
                      <option value="expense">
                        Expense
                      </option>

                      <option value="income">
                        Income
                      </option>
                    </select>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Category
                    </label>

                    <select
                      value={
                        formData.categoryId
                      }
                      onChange={(event) =>
                        setFormData({
                          ...formData,
                          categoryId:
                            event.target
                              .value,
                        })
                      }
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:app-primary-border"
                    >
                      <option value="">
                        Select category
                      </option>

                      {categories
                        .filter(
                          (
                            categoryItem
                          ) =>
                            categoryItem.type ===
                            formData.type
                        )
                        .map(
                          (
                            categoryItem
                          ) => (
                            <option
                              key={
                                categoryItem.id
                              }
                              value={
                                categoryItem.id
                              }
                            >
                              {
                                categoryItem.name
                              }
                            </option>
                          )
                        )}
                    </select>
                  </div>
                </div>

                {/* Amount + Date */}
                <div className="grid gap-4 sm:grid-cols-2">

                  {/* Amount */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Amount
                    </label>

                    <input
                      type="number"
                      placeholder="0.00"
                      min="0"
                      value={
                        formData.amount
                      }
                      onChange={(event) =>
                        setFormData({
                          ...formData,
                          amount:
                            event.target
                              .value,
                        })
                      }
                      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:app-primary-border focus:ring-2 focus:ring-[var(--app-primary-soft)]"
                    />
                  </div>

                  {/* Date */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Date
                    </label>

                    <input
                      type="date"
                      value={
                        formData.date
                      }
                      onChange={(event) =>
                        setFormData({
                          ...formData,
                          date:
                            event.target
                              .value,
                        })
                      }
                      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:app-primary-border focus:ring-2 focus:ring-[var(--app-primary-soft)]"
                    />
                  </div>

                </div>

                {/* Payment Method */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Payment Method
                  </label>

                  <select
                    value={
                      formData.paymentMethod
                    }
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        paymentMethod:
                          event.target
                            .value,
                      })
                    }
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:app-primary-border"
                  >
                    <option value="Cash">
                      Cash
                    </option>

                    <option value="UPI">
                      UPI
                    </option>

                    <option value="Debit Card">
                      Debit Card
                    </option>

                    <option value="Credit Card">
                      Credit Card
                    </option>

                    <option value="Bank Transfer">
                      Bank Transfer
                    </option>
                  </select>
                </div>

              </div>

              {/* Modal Actions */}
              <div className="mt-6 flex justify-end gap-3">

                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(
                      false
                    );
                    resetForm();
                  }}
                  disabled={
                    isSubmitting
                  }
                  className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={
                    handleSaveTransaction
                  }
                  disabled={
                    isSubmitting
                  }
                  className="rounded-lg app-primary px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting
                    ? editingTransactionId !==
                      null
                      ? "Updating..."
                      : "Adding..."
                    : editingTransactionId !==
                        null
                      ? "Update Transaction"
                      : "Add Transaction"}
                </button>

              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default Transactions;
