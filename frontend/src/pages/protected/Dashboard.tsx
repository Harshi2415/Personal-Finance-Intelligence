import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  ArrowDownLeft,
  ArrowRight,
  ArrowUpRight,
  PiggyBank,
  Wallet,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { RootState } from "../../store/store";

import {
  getDashboardSummary,
  getSpendingByCategory,
  getMonthlyTrends,
  getBudgetOverview,
  getGoalProgress,
  getRecentTransactions,
  getMonthlySavings,
  getUpcomingExpenses,
  getFinancialHealth,
  type DashboardSummary,
  type SpendingByCategory,
  type MonthlyTrend,
  type BudgetOverview,
  type GoalProgress,
  type RecentTransaction,
  type MonthlySavings,
  type UpcomingExpense,
  type FinancialHealth,
} from "../../services/dashboardService";

import {
  getCategories,
  type Category,
} from "../../services/categoryService";

function Dashboard() {
  const user = useSelector(
    (state: RootState) => state.auth.user
  );

  const navigate = useNavigate();

  const currency = user?.currency || "INR";

  const [summary, setSummary] =
    useState<DashboardSummary | null>(null);

  const [spendingByCategory, setSpendingByCategory] =
    useState<SpendingByCategory[]>([]);

  const [monthlyTrends, setMonthlyTrends] =
    useState<MonthlyTrend[]>([]);

  const [budgetOverview, setBudgetOverview] =
    useState<BudgetOverview[]>([]);

  const [goalProgress, setGoalProgress] =
    useState<GoalProgress[]>([]);

  const [recentTransactions, setRecentTransactions] =
    useState<RecentTransaction[]>([]);

  const [monthlySavings, setMonthlySavings] =
    useState<MonthlySavings[]>([]);

  const [upcomingExpenses, setUpcomingExpenses] =
    useState<UpcomingExpense[]>([]);

  const [financialHealth, setFinancialHealth] =
    useState<FinancialHealth | null>(null);

  const [categories, setCategories] =
    useState<Category[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        summaryData,
        spendingData,
        trendsData,
        budgetData,
        goalsData,
        recentData,
        savingsData,
        upcomingData,
        healthData,
        categoriesData,
      ] = await Promise.all([
        getDashboardSummary(),
        getSpendingByCategory(),
        getMonthlyTrends(),
        getBudgetOverview(),
        getGoalProgress(),
        getRecentTransactions(),
        getMonthlySavings(),
        getUpcomingExpenses(),
        getFinancialHealth(),
        getCategories(),
      ]);

      setSummary(summaryData);
      setSpendingByCategory(spendingData);
      setMonthlyTrends(trendsData);
      setBudgetOverview(budgetData);
      setGoalProgress(goalsData);
      setRecentTransactions(recentData);
      setMonthlySavings(savingsData);
      setUpcomingExpenses(upcomingData);
      setFinancialHealth(healthData);
      setCategories(categoriesData);
    } catch (err) {
      console.error("Unable to load dashboard:", err);

      setError(
        "Unable to load dashboard data. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  loadDashboard();
}, []);

  const formatCurrency = (
    value: number
  ) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getCategoryName = (
    categoryId: number
  ) => {
    const category = categories.find(
      (item) => item.id === categoryId
    );

    return category?.name || "Unknown category";
  };

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const monthlyChartData = useMemo(() => {
    return monthlyTrends.map((item) => ({
      month:
        monthNames[item.month - 1] ||
        item.month,
      income: item.income,
      expense: item.expense,
    }));
  }, [monthlyTrends]);

  const savingsChartData = useMemo(() => {
    return monthlySavings.map((item) => ({
      month:
        monthNames[item.month - 1] ||
        item.month,
      savings: item.savings,
    }));
  }, [monthlySavings]);

  const totalSpending = useMemo(() => {
    return spendingByCategory.reduce(
      (total, item) =>
        total + item.total,
      0
    );
  }, [spendingByCategory]);

  const spendingColors = [
    "#1d4ed8",
    "#0f766e",
    "#7c3aed",
    "#ea580c",
    "#db2777",
    "#0891b2",
    "#65a30d",
  ];

  if (loading) {
    return (
      <div className="p-4 sm:p-6">
        <div className="space-y-6 animate-pulse">
          <div className="h-8 w-64 rounded-lg bg-slate-200" />

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="h-32 rounded-xl bg-slate-200"
                />
              )
            )}
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <div className="h-80 rounded-xl bg-slate-200" />
            <div className="h-80 rounded-xl bg-slate-200" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6">
        <div className="rounded-xl border border-red-200 bg-red-50 p-5">
          <p className="text-sm text-red-700">
            {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">

      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Financial Overview
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Track your income, spending, savings and financial goals.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {/* Balance */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Balance
              </p>

              <h2 className="mt-2 text-2xl font-bold text-slate-900">
                {formatCurrency(
                  summary?.balance || 0
                )}
              </h2>
            </div>

            <div className="app-primary-text rounded-lg app-primary-light p-2.5">
              <Wallet size={21} />
            </div>
          </div>

          <p className="mt-3 text-xs text-slate-500">
            Income minus expenses
          </p>
        </div>

        {/* Income */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Income
              </p>

              <h2 className="mt-2 text-2xl font-bold text-slate-900">
                {formatCurrency(
                  summary?.total_income || 0
                )}
              </h2>
            </div>

            <div className="rounded-lg bg-emerald-50 p-2.5 text-emerald-600">
              <ArrowDownLeft size={21} />
            </div>
          </div>

          <p className="mt-3 text-xs text-emerald-600">
            Money received
          </p>
        </div>

        {/* Expenses */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Expenses
              </p>

              <h2 className="mt-2 text-2xl font-bold text-slate-900">
                {formatCurrency(
                  summary?.total_expense || 0
                )}
              </h2>
            </div>

            <div className="rounded-lg bg-red-50 p-2.5 text-red-600">
              <ArrowUpRight size={21} />
            </div>
          </div>

          <p className="mt-3 text-xs text-red-600">
            Money spent
          </p>
        </div>

        {/* Savings */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Savings Rate
              </p>

              <h2 className="mt-2 text-2xl font-bold text-slate-900">
                {financialHealth?.savings_rate || 0}%
              </h2>
            </div>

            <div className="rounded-lg bg-teal-50 p-2.5 text-teal-600">
              <PiggyBank size={21} />
            </div>
          </div>

          <p className="mt-3 text-xs text-teal-600">
            Current savings
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid gap-6 xl:grid-cols-2">

        {/* Monthly Income vs Expense */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5">
            <h2 className="font-semibold text-slate-900">
              Income vs Expenses
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Monthly financial activity
            </p>
          </div>

          <div className="h-72">
            {monthlyChartData.length > 0 ? (
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <BarChart
                  data={monthlyChartData}
                  margin={{
                    top: 5,
                    right: 5,
                    left: 0,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12 }}
                  />

                  <YAxis
                    tick={{ fontSize: 12 }}
                  />

                  <Tooltip />

                  <Bar
                    dataKey="income"
                    name="Income"
                    fill="#16a34a"
                    radius={[4, 4, 0, 0]}
                  />

                  <Bar
                    dataKey="expense"
                    name="Expense"
                    fill="#dc2626"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-slate-400">
                No monthly transaction data yet.
              </div>
            )}
          </div>
        </div>

        {/* Spending by Category */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5">
            <h2 className="font-semibold text-slate-900">
              Spending by Category
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Where your money is going
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="h-64">
              {spendingByCategory.length > 0 ? (
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <PieChart>
                    <Pie
                      data={spendingByCategory}
                      dataKey="total"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={3}
                    >
                      {spendingByCategory.map(
                        (_, index) => (
                          <Cell
                            key={index}
                            fill={
                              spendingColors[
                                index %
                                  spendingColors.length
                              ]
                            }
                          />
                        )
                      )}
                    </Pie>

                    <Tooltip
                      formatter={(value) =>
                        formatCurrency(
                          Number(value)
                        )
                      }
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-slate-400">
                  No expense data yet.
                </div>
              )}
            </div>

            <div className="flex flex-col justify-center gap-3">
              {spendingByCategory
                .slice(0, 6)
                .map((item, index) => {
                  const percentage =
                    totalSpending > 0
                      ? (item.total /
                          totalSpending) *
                        100
                      : 0;

                  return (
                    <div
                      key={item.category}
                      className="flex items-center justify-between gap-3"
                    >
                      <div className="flex min-w-0 items-center gap-2">
                        <span
                          className="h-2.5 w-2.5 shrink-0 rounded-full"
                          style={{
                            backgroundColor:
                              spendingColors[
                                index %
                                  spendingColors.length
                              ],
                          }}
                        />

                        <span className="truncate text-sm text-slate-600">
                          {item.category}
                        </span>
                      </div>

                      <span className="shrink-0 text-xs font-medium text-slate-500">
                        {percentage.toFixed(0)}%
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>

      {/* Budget + Goals */}
      <div className="grid gap-6 xl:grid-cols-2">

        {/* Budget Overview */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="font-semibold text-slate-900">
                Budget Overview
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Track spending against your budgets
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                navigate("/budgets")
              }
              className="app-primary-text inline-flex shrink-0 items-center gap-1 text-xs font-semibold transition hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-[var(--app-primary-soft)]"
            >
              View all
              <ArrowRight size={14} />
            </button>
          </div>

          {budgetOverview.length > 0 ? (
            <div className="space-y-5">
              {budgetOverview.map((item) => {
                const percentage =
                  item.budget > 0
                    ? (item.spent /
                        item.budget) *
                      100
                    : 0;

                const progress =
                  Math.min(
                    percentage,
                    100
                  );

                const progressColor =
                  percentage > 100
                    ? "bg-red-500"
                    : percentage >= 80
                      ? "bg-orange-500"
                      : "app-primary";

                return (
                  <button
                    type="button"
                    key={item.category}
                    onClick={() =>
                      navigate("/budgets")
                    }
                    className="group block w-full rounded-lg text-left transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[var(--app-primary-soft)]"
                  >
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">
                        {item.category}
                      </span>

                      <span className="text-xs text-slate-500">
                        {formatCurrency(
                          item.spent
                        )}{" "}
                        /{" "}
                        {formatCurrency(
                          item.budget
                        )}
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full ${progressColor}`}
                        style={{
                          width: `${progress}%`,
                        }}
                      />
                    </div>

                    <p className="mt-1 text-right text-xs text-slate-400">
                      {percentage.toFixed(0)}%
                    </p>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex min-h-40 items-center justify-center text-sm text-slate-400">
              No budgets available yet.
            </div>
          )}
        </div>

        {/* Goals */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="font-semibold text-slate-900">
                Financial Goals
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Your progress toward financial goals
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                navigate("/goals")
              }
              className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-teal-600 transition hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-teal-100"
            >
              View all
              <ArrowRight size={14} />
            </button>
          </div>

          {goalProgress.length > 0 ? (
            <div className="space-y-5">
              {goalProgress.map((goal) => {
                const progress = Math.min(
                  goal.progress,
                  100
                );

                return (
                  <button
                    type="button"
                    key={goal.name}
                    onClick={() =>
                      navigate("/goals")
                    }
                    className="group block w-full rounded-lg text-left transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-100"
                  >
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <span className="truncate text-sm font-medium text-slate-700 group-hover:text-slate-900">
                        {goal.name}
                      </span>

                      <span className="shrink-0 text-xs font-semibold text-teal-600">
                        {goal.progress}%
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-teal-600"
                        style={{
                          width: `${progress}%`,
                        }}
                      />
                    </div>

                    <div className="mt-2 flex justify-between text-xs text-slate-400">
                      <span>
                        {formatCurrency(
                          goal.current_amount
                        )}
                      </span>

                      <span>
                        {formatCurrency(
                          goal.target_amount
                        )}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex min-h-40 items-center justify-center text-sm text-slate-400">
              No financial goals available yet.
            </div>
          )}
        </div>
      </div>

      {/* Savings + Recent Transactions */}
      <div className="grid gap-6 xl:grid-cols-2">

        {/* Monthly Savings */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">
                Monthly Savings
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Savings generated each month
              </p>
            </div>

            <PiggyBank
              size={20}
              className="text-teal-600"
            />
          </div>

          <div className="h-64">
            {savingsChartData.length > 0 ? (
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <BarChart
                  data={savingsChartData}
                  margin={{
                    top: 5,
                    right: 5,
                    left: 0,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12 }}
                  />

                  <YAxis
                    tick={{ fontSize: 12 }}
                  />

                  <Tooltip
                    formatter={(value) =>
                      formatCurrency(
                        Number(value)
                      )
                    }
                  />

                  <Bar
                    dataKey="savings"
                    name="Savings"
                    fill="#0f766e"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-slate-400">
                No savings data yet.
              </div>
            )}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="font-semibold text-slate-900">
                Recent Transactions
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Your latest financial activity
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                navigate("/transactions")
              }
              className="app-primary-text inline-flex shrink-0 items-center gap-1 text-xs font-semibold transition hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-[var(--app-primary-soft)]"
            >
              View all
              <ArrowRight size={14} />
            </button>
          </div>

          {recentTransactions.length > 0 ? (
            <div className="space-y-2">
              {recentTransactions.map(
                (transaction) => (
                  <button
                    type="button"
                    key={transaction.id}
                    onClick={() =>
                      navigate("/transactions")
                    }
                    className="flex w-full items-center justify-between gap-3 rounded-lg p-2 text-left transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[var(--app-primary-soft)]"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                          transaction.type ===
                          "income"
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        {transaction.type ===
                        "income" ? (
                          <ArrowDownLeft
                            size={17}
                          />
                        ) : (
                          <ArrowUpRight
                            size={17}
                          />
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-slate-700">
                          {transaction.description ||
                            getCategoryName(
                              transaction.category_id
                            )}
                        </p>

                        <p className="mt-0.5 text-xs text-slate-400">
                          {getCategoryName(
                            transaction.category_id
                          )}{" "}
                          •{" "}
                          {transaction.transaction_date}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`shrink-0 text-sm font-semibold ${
                        transaction.type ===
                        "income"
                          ? "text-emerald-600"
                          : "text-red-600"
                      }`}
                    >
                      {transaction.type ===
                      "income"
                        ? "+"
                        : "-"}
                      {formatCurrency(
                        transaction.amount
                      )}
                    </span>
                  </button>
                )
              )}
            </div>
          ) : (
            <div className="flex min-h-40 items-center justify-center text-sm text-slate-400">
              No recent transactions.
            </div>
          )}
        </div>
      </div>

      {/* Upcoming Expenses */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h2 className="font-semibold text-slate-900">
              Upcoming Expenses
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Recurring expenses due soon
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate("/recurring")
            }
            className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-orange-600 transition hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-orange-100"
          >
            View all
            <ArrowRight size={14} />
          </button>
        </div>

        {upcomingExpenses.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {upcomingExpenses.map(
              (expense) => (
                <button
                  type="button"
                  key={expense.id}
                  onClick={() =>
                    navigate("/recurring")
                  }
                  className="rounded-lg border border-slate-100 bg-slate-50 p-4 text-left transition hover:border-slate-200 hover:bg-white hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-100"
                >
                  <p className="truncate text-sm font-semibold text-slate-800">
                    {expense.name}
                  </p>

                  <p className="mt-1 truncate text-xs text-slate-500">
                    {getCategoryName(
                      expense.category_id
                    )}
                  </p>

                  <p className="mt-3 text-lg font-bold text-slate-900">
                    {formatCurrency(
                      expense.amount
                    )}
                  </p>

                  <p className="mt-1 text-xs text-orange-600">
                    Due{" "}
                    {expense.next_due_date}
                  </p>
                </button>
              )
            )}
          </div>
        ) : (
          <div className="flex min-h-24 items-center justify-center text-sm text-slate-400">
            No upcoming recurring expenses.
          </div>
        )}
      </div>

      {/* Financial Health */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5">
          <h2 className="font-semibold text-slate-900">
            Financial Health
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Your overall financial position
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">

          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-xs font-medium text-slate-500">
              Income
            </p>

            <p className="mt-2 text-xl font-bold text-slate-900">
              {formatCurrency(
                financialHealth?.total_income ||
                  0
              )}
            </p>
          </div>

          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-xs font-medium text-slate-500">
              Expenses
            </p>

            <p className="mt-2 text-xl font-bold text-slate-900">
              {formatCurrency(
                financialHealth?.total_expense ||
                  0
              )}
            </p>
          </div>

          <div className="rounded-lg bg-teal-50 p-4">
            <p className="text-xs font-medium text-teal-700">
              Savings
            </p>

            <p className="mt-2 text-xl font-bold text-teal-800">
              {formatCurrency(
                financialHealth?.savings ||
                  0
              )}
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}

export default Dashboard;