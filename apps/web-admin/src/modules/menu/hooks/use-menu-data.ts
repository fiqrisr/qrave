import { useEffect, useState } from "react";
import { api } from "@/lib/api-client";
import { useSession } from "@/lib/auth-client";

export interface Category {
  id: string;
  name: string;
  organizationId: string;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  isAvailable: boolean;
  categoryId: string | null;
  organizationId: string;
}

export function useMenuData() {
  const { data: session } = useSession();
  const tenantId = session?.session?.activeOrganizationId;

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function refetch() {
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

      if (catRes.error || prodRes.error) {
        setError("Failed to load menu data");
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

  // biome-ignore lint/correctness/useExhaustiveDependencies: refetch is stable
  useEffect(() => {
    refetch();
  }, [tenantId]);

  return { categories, products, loading, error, refetch };
}
