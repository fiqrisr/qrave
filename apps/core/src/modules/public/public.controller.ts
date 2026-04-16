import { categories, orderItems, orders, products } from "@qrave/db";
import { db } from "@qrave/db";
import { and, eq, inArray } from "drizzle-orm";
import { Elysia, t } from "elysia";
import { slugGuard } from "../../middleware/slug-guard";

const orderBody = t.Object({
  tableNumber: t.String({ minLength: 1 }),
  items: t.Array(
    t.Object({
      productId: t.String(),
      quantity: t.Integer({ minimum: 1 }),
    }),
    { minItems: 1 },
  ),
});

export const publicController = new Elysia({ prefix: "/api/m/:slug" })
  .use(slugGuard)
  .get("/menu", async ({ organizationId }) => {
    const cats = await db
      .select()
      .from(categories)
      .where(eq(categories.organizationId, organizationId));

    const prods = await db
      .select()
      .from(products)
      .where(
        and(
          eq(products.organizationId, organizationId),
          eq(products.isAvailable, true),
        ),
      );

    return cats.map((cat) => ({
      ...cat,
      products: prods.filter((p) => p.categoryId === cat.id),
    }));
  })
  .post(
    "/order",
    async ({ organizationId, body, set, server }) => {
      const productIds = body.items.map((item) => item.productId);

      const fetchedProducts = await db
        .select()
        .from(products)
        .where(
          and(
            inArray(products.id, productIds),
            eq(products.organizationId, organizationId),
            eq(products.isAvailable, true),
          ),
        );

      if (fetchedProducts.length !== productIds.length) {
        set.status = 400;
        return { error: "One or more products are invalid or unavailable" };
      }

      const priceMap = new Map(fetchedProducts.map((p) => [p.id, p.price]));

      const total = body.items.reduce((sum, item) => {
        const price = priceMap.get(item.productId) ?? 0;
        return sum + price * item.quantity;
      }, 0);

      const orderId = crypto.randomUUID();
      const now = new Date();

      const [newOrder] = await db
        .insert(orders)
        .values({
          id: orderId,
          organizationId,
          tableNumber: body.tableNumber,
          status: "pending",
          total,
          createdAt: now,
        })
        .returning();

      await db.insert(orderItems).values(
        body.items.map((item) => ({
          id: crypto.randomUUID(),
          orderId,
          productId: item.productId,
          quantity: item.quantity,
          price: priceMap.get(item.productId) ?? 0,
        })),
      );

      server?.publish(
        `room:org_${organizationId}:kitchen`,
        JSON.stringify({ event: "new_order", order: newOrder }),
      );

      set.status = 201;
      return newOrder;
    },
    { body: orderBody },
  );
