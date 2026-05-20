import { and, eq } from "drizzle-orm";
import { db, orders } from "../../db";

export async function listOrders(organizationId: string) {
  return db
    .select()
    .from(orders)
    .where(eq(orders.organizationId, organizationId));
}

export async function updateOrderStatus(
  organizationId: string,
  id: string,
  data: { status: string },
) {
  const [updated] = await db
    .update(orders)
    .set({ status: data.status })
    .where(and(eq(orders.id, id), eq(orders.organizationId, organizationId)))
    .returning();
  return updated ?? null;
}
