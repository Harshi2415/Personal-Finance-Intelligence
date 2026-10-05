import { useEffect, useMemo, useState } from "react";
import {
  Pencil,
  Search,
  Tags,
  Trash2,
  X,
} from "lucide-react";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
  type Category,
} from "../../services/categoryService";

function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<Category | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    type: "expense" as "income" | "expense",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getCategories();

      setCategories(data);
    } catch (error) {
      console.error(error);
      setError("Unable to load categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const filteredCategories = useMemo(() => {
    return categories.filter((category) => {
      const matchesSearch = category.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesType =
        typeFilter === "all" || category.type === typeFilter;

      return matchesSearch && matchesType;
    });
  }, [categories, search, typeFilter]);

  const incomeCount = categories.filter(
    (category) => category.type === "income"
  ).length;

  const expenseCount = categories.filter(
    (category) => category.type === "expense"
  ).length;

  const openCreateModal = () => {
    setEditingCategory(null);

    setFormData({
      name: "",
      type: "expense",
    });

    setIsModalOpen(true);
  };

  const openEditModal = (category: Category) => {
    setEditingCategory(category);

    setFormData({
      name: category.name,
      type: category.type as "income" | "expense",
    });

    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;

    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!formData.name.trim()) {
      return;
    }

    try {
      setSaving(true);
      setError("");

      if (editingCategory) {
        const updatedCategory = await updateCategory(
          editingCategory.id,
          {
            name: formData.name.trim(),
            type: formData.type,
          }
        );

        setCategories((current) =>
          current.map((category) =>
            category.id === updatedCategory.id
              ? updatedCategory
              : category
          )
        );
      } else {
        const newCategory = await createCategory({
          name: formData.name.trim(),
          type: formData.type,
        });

        setCategories((current) => [
          newCategory,
          ...current,
        ]);
      }

      closeModal();
    } catch (error) {
      console.error(error);
      setError("Unable to save category.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (categoryId: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteCategory(categoryId);

      setCategories((current) =>
        current.filter((category) => category.id !== categoryId)
      );
    } catch (error) {
      console.error(error);
      setError(
        "Unable to delete this category. It may already be used by another record."
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
              <Tags
                size={25}
                className="app-primary-text"
              />

              <h1 className="text-2xl font-bold text-slate-900">
                Categories
              </h1>
            </div>

            <p className="mt-1 text-sm text-slate-500">
              Organize your income and expenses with custom categories.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 rounded-lg app-primary px-4 py-2.5 text-sm font-semibold text-white transition"
          >
           + Add Category
          </button>
        </div>

        {/* Summary */}
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Total Categories
            </p>

            <p className="mt-2 text-2xl font-bold text-slate-900">
              {categories.length}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Income Categories
            </p>

            <p className="mt-2 text-2xl font-bold text-green-600">
              {incomeCount}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Expense Categories
            </p>

            <p className="mt-2 text-2xl font-bold text-red-600">
              {expenseCount}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search categories..."
                className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:app-primary-border focus:ring-2 focus:ring-[var(--app-primary-soft)]"
              />
            </div>

            <select
              value={typeFilter}
              onChange={(event) =>
                setTypeFilter(event.target.value)
              }
              className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:app-primary-border focus:ring-2 focus:ring-[var(--app-primary-soft)]"
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Categories */}
        <div className="mt-6 rounded-xl border border-slate-200 bg-white shadow-sm">
          {loading ? (
            <div className="space-y-4 p-6">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-16 animate-pulse rounded-lg bg-slate-100"
                />
              ))}
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <Tags
                size={42}
                className="mx-auto text-slate-300"
              />

              <h3 className="mt-4 text-lg font-semibold text-slate-800">
                No categories found
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Create a category to organize your finances.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredCategories.map((category) => (
                <div
                  key={category.id}
                  className="flex flex-col gap-4 p-5 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                        category.type === "income"
                          ? "bg-green-50 text-green-600"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      <Tags size={19} />
                    </div>

                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {category.name}
                      </h3>

                      <span
                        className={`mt-1 inline-block rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                          category.type === "income"
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {category.type}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() =>
                        openEditModal(category)
                      }
                      className="app-primary-hover rounded-lg p-2 text-slate-500 transition"
                      aria-label="Edit category"
                    >
                      <Pencil size={17} />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(category.id)
                      }
                      className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                      aria-label="Delete category"
                    >
                      <Trash2 size={17} />
                    </button>
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
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  {editingCategory
                    ? "Edit Category"
                    : "Add Category"}
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Create a category for your financial records.
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

            <form
              onSubmit={handleSubmit}
              className="space-y-4 p-5"
            >
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Category Name
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
                  placeholder="e.g. Food"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:app-primary-border focus:ring-2 focus:ring-[var(--app-primary-soft)]"
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Category Type
                </label>

                <select
                  value={formData.type}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      type: event.target.value as
                        | "income"
                        | "expense",
                    })
                  }
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm capitalize outline-none focus:app-primary-border focus:ring-2 focus:ring-[var(--app-primary-soft)]"
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
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
                  className="rounded-lg app-primary px-4 py-2.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingCategory
                      ? "Update Category"
                      : "Add Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Categories;