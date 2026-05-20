import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useState } from "react";
import { CategoryForm, ProductList } from "@/modules/menu";

export const Route = createFileRoute("/_dashboard/menu")({
  component: MenuPage,
});

function MenuPage() {
  const [showCategoryForm, setShowCategoryForm] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Menu</h1>
        <button
          type="button"
          onClick={() => setShowCategoryForm(!showCategoryForm)}
          className="flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-white font-medium hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" />
          New Category
        </button>
      </div>

      {showCategoryForm && (
        <CategoryForm
          onSuccess={() => setShowCategoryForm(false)}
          onCancel={() => setShowCategoryForm(false)}
        />
      )}

      <ProductList />
    </div>
  );
}
