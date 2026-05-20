import { useState } from "react";
import { api } from "@/lib/api-client";
import type { Category } from "@/modules/menu";

interface CategoryFormProps {
  category?: Category;
  onSuccess: () => void;
  onCancel: () => void;
}

export function CategoryForm({
  category,
  onSuccess,
  onCancel,
}: CategoryFormProps) {
  const [name, setName] = useState(category?.name ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const isEdit = !!category;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      if (isEdit) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const res = await (api as any).api.dashboard
          .categories({ id: category!.id })
          .put({ name });
        if (res.error) {
          setError(
            typeof res.error.value === "string"
              ? res.error.value
              : "Failed to update category",
          );
          return;
        }
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const res = await (api as any).api.dashboard.categories.post({ name });
        if (res.error) {
          setError(
            typeof res.error.value === "string"
              ? res.error.value
              : "Failed to create category",
          );
          return;
        }
      }
      onSuccess();
    } catch {
      setError("Failed to save category");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <h3 className="text-lg font-semibold">
        {isEdit ? "Edit Category" : "New Category"}
      </h3>

      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
          {error}
        </div>
      )}

      <div>
        <label
          htmlFor="cat-name"
          className="block text-sm font-medium text-gray-700"
        >
          Name
        </label>
        <input
          id="cat-name"
          type="text"
          required
          value={name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setName(e.target.value)
          }
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-indigo-600 px-4 py-2 text-white font-medium hover:bg-indigo-700 disabled:opacity-50"
        >
          {submitting ? "Saving..." : isEdit ? "Update" : "Create"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 font-medium hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
