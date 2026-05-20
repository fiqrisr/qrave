import { db, products } from "@qrave/db";
import { and, eq } from "drizzle-orm";

export async function listProducts(organizationId: string) {
  return db
    .select()
    .from(products)
    .where(eq(products.organizationId, organizationId));
}

export async function createProduct(
  organizationId: string,
  data: {
    name: string;
    description?: string | null;
    price: number;
    isAvailable?: boolean | null;
    categoryId?: string | null;
  },
) {
  const now = new Date();
  const [created] = await db
    .insert(products)
    .values({
      id: crypto.randomUUID(),
      organizationId,
      categoryId: data.categoryId ?? null,
      name: data.name,
      description: data.description ?? null,
      price: data.price,
      isAvailable: data.isAvailable ?? true,
      createdAt: now,
      updatedAt: now,
    })
    .returning();
  return created;
}

export async function updateProduct(
  organizationId: string,
  id: string,
  data: {
    name?: string;
    description?: string | null;
    price?: number;
    isAvailable?: boolean;
    categoryId?: string | null;
  },
) {
  const now = new Date();
  const [updated] = await db
    .update(products)
    .set({ ...data, updatedAt: now })
    .where(
      and(eq(products.id, id), eq(products.organizationId, organizationId)),
    )
    .returning();
  return updated ?? null;
}

export async function deleteProduct(organizationId: string, id: string) {
  const [deleted] = await db
    .delete(products)
    .where(
      and(eq(products.id, id), eq(products.organizationId, organizationId)),
    )
    .returning();
  return deleted ?? null;
}
