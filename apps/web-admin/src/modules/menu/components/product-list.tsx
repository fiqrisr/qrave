import {
  Alert,
  Badge,
  Card,
  Grid,
  Group,
  Loader,
  Stack,
  Text,
  Title,
} from "@qrave/ui";
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
    return <Loader />;
  }

  if (error) {
    return <Alert color="red">{error}</Alert>;
  }

  return (
    <Stack gap="xl">
      {categories.map((category) => {
        const categoryProducts = products.filter(
          (p) => p.categoryId === category.id,
        );
        return (
          <Stack key={category.id} gap="sm">
            <Group>
              <Title order={3}>{category.name}</Title>
              <Text size="sm" c="dimmed">
                ({categoryProducts.length} items)
              </Text>
            </Group>

            {categoryProducts.length === 0 ? (
              <Text size="sm" c="dimmed">
                No products yet
              </Text>
            ) : (
              <Grid gap="sm">
                {categoryProducts.map((product) => (
                  <Grid.Col key={product.id} span={{ base: 12, sm: 6, lg: 4 }}>
                    <Card withBorder>
                      <Group justify="space-between" align="flex-start">
                        <div>
                          <Text fw={500}>{product.name}</Text>
                          {product.description && (
                            <Text size="sm" c="dimmed" mt={4}>
                              {product.description}
                            </Text>
                          )}
                        </div>
                        <Badge
                          color={product.isAvailable ? "green" : "red"}
                          variant="light"
                        >
                          {product.isAvailable ? "Available" : "Unavailable"}
                        </Badge>
                      </Group>
                      <Text fw={600} size="lg" mt="sm">
                        ${(product.price / 100).toFixed(2)}
                      </Text>
                    </Card>
                  </Grid.Col>
                ))}
              </Grid>
            )}
          </Stack>
        );
      })}

      {(() => {
        const uncategorized = products.filter((p) => !p.categoryId);
        if (uncategorized.length === 0) return null;
        return (
          <Stack gap="sm">
            <Group>
              <Title order={3}>Uncategorized</Title>
              <Text size="sm" c="dimmed">
                ({uncategorized.length} items)
              </Text>
            </Group>
            <Grid gap="sm">
              {uncategorized.map((product) => (
                <Grid.Col key={product.id} span={{ base: 12, sm: 6, lg: 4 }}>
                  <Card withBorder>
                    <Text fw={500}>{product.name}</Text>
                    {product.description && (
                      <Text size="sm" c="dimmed" mt={4}>
                        {product.description}
                      </Text>
                    )}
                    <Text fw={600} size="lg" mt="sm">
                      ${(product.price / 100).toFixed(2)}
                    </Text>
                  </Card>
                </Grid.Col>
              ))}
            </Grid>
          </Stack>
        );
      })()}
    </Stack>
  );
}
