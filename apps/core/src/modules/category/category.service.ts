import { categories, db } from "@qrave/db";
import { and, eq } from "drizzle-orm";

export async function listCategories(organizationId: string) {
  return db
    .select()
    .from(categories)
    .where(eq(categories.organizationId, organizationId));
}

export async function createCategory(
  organizationId: string,
  data: { name: string },
) {
  const now = new Date();
  const [created] = await db
    .insert(categories)
    .values({
      id: crypto.randomUUID(),
      organizationId,
      name: data.name,
      createdAt: now,
      updatedAt: now,
    })
    .returning();
  return created;
}

export async function updateCategory(
  organizationId: string,
  id: string,
  data: { name: string },
) {
  const now = new Date();
  const [updated] = await db
    .update(categories)
    .set({ name: data.name, updatedAt: now })
    .where(
      and(eq(categories.id, id), eq(categories.organizationId, organizationId)),
    )
    .returning();
  return updated ?? null;
}

export async function deleteCategory(organizationId: string, id: string) {
  const [deleted] = await db
    .delete(categories)
    .where(
      and(eq(categories.id, id), eq(categories.organizationId, organizationId)),
    )
    .returning();
  return deleted ?? null;
}
