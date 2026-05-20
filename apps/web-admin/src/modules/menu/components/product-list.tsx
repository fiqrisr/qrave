import { useState } from "react";
import { api } from "@/lib/api-client";
import { useSession } from "@/lib/auth-client";

interface Category {
  id: string;
  name: string;
  organizationId: string;
}

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  isAvailable: boolean;
  categoryId: string | null;
  organizationId: string;
}

export function ProductList() {
  const { data: session } = useSession();
  const tenantId = session?.session?.activeOrganizationId;

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchMenuData() {
    if (!tenantId) return;
    setLoading(true);
    setError("");

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const apiClient = api as any;
      const [catRes, prodRes] = await Promise.all([
        apiClient.api.dashboard.categories.get(),
        apiClient.api.dashboard.products.get(),
      ]);

      if (catRes.error) {
        setError(
          typeof catRes.error.value === "string"
            ? catRes.error.value
            : "Failed to load categories",
        );
        return;
      }
      if (prodRes.error) {
        setError(
          typeof prodRes.error.value === "string"
            ? prodRes.error.value
            : "Failed to load products",
        );
        return;
      }

      setCategories(catRes.data as Category[]);
      setProducts(prodRes.data as Product[]);
    } catch {
      setError("Failed to load menu data");
    } finally {
      setLoading(false);
    }
  }

  useState(() => {
    fetchMenuData();
  });

  if (loading) {
    return <div className="text-gray-500">Loading menu...</div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  return (
    <div className="space-y-8">
      {categories.map((category) => {
        const categoryProducts = products.filter(
          (p) => p.categoryId === category.id,
        );
        return (
          <div key={category.id} className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800">
              {category.name}
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({categoryProducts.length} items)
              </span>
            </h3>

            {categoryProducts.length === 0 ? (
              <p className="text-sm text-gray-400">No products yet</p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {categoryProducts.map((product) => (
                  <div
                    key={product.id}
                    className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {product.name}
                        </h4>
                        {product.description && (
                          <p className="text-sm text-gray-500 mt-1">
                            {product.description}
                          </p>
                        )}
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          product.isAvailable
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {product.isAvailable ? "Available" : "Unavailable"}
                      </span>
                    </div>
                    <p className="mt-2 text-lg font-semibold text-gray-900">
                      ${(product.price / 100).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* Uncategorized products */}
      {(() => {
        const uncategorized = products.filter((p) => !p.categoryId);
        if (uncategorized.length === 0) return null;
        return (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800">
              Uncategorized
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({uncategorized.length} items)
              </span>
            </h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {uncategorized.map((product) => (
                <div
                  key={product.id}
                  className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
                >
                  <h4 className="font-medium text-gray-900">{product.name}</h4>
                  {product.description && (
                    <p className="text-sm text-gray-500 mt-1">
                      {product.description}
                    </p>
                  )}
                  <p className="mt-2 text-lg font-semibold text-gray-900">
                    ${(product.price / 100).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
