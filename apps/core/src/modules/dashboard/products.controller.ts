import { db, products } from "@qrave/db";
import { and, eq } from "drizzle-orm";
import { Elysia, t } from "elysia";
import { tenantGuard } from "../../middleware/tenant-guard";

const productBody = t.Object({
  name: t.String({ minLength: 1 }),
  description: t.Optional(t.String()),
  price: t.Number({ minimum: 0 }),
  isAvailable: t.Optional(t.Boolean()),
  categoryId: t.Optional(t.String()),
});

const productUpdateBody = t.Object({
  name: t.Optional(t.String({ minLength: 1 })),
  description: t.Optional(t.String()),
  price: t.Optional(t.Number({ minimum: 0 })),
  isAvailable: t.Optional(t.Boolean()),
  categoryId: t.Optional(t.String()),
});

export const productsController = new Elysia({
  prefix: "/api/dashboard/products",
})
  .use(tenantGuard)
  .get("/", async ({ tenantId }) => {
    return db
      .select()
      .from(products)
      .where(eq(products.organizationId, tenantId));
  })
  .post(
    "/",
    async ({ tenantId, body, set }) => {
      const now = new Date();
      const [created] = await db
        .insert(products)
        .values({
          id: crypto.randomUUID(),
          organizationId: tenantId,
          categoryId: body.categoryId ?? null,
          name: body.name,
          description: body.description ?? null,
          price: body.price,
          isAvailable: body.isAvailable ?? true,
          createdAt: now,
          updatedAt: now,
        })
        .returning();

      set.status = 201;
      return created;
    },
    { body: productBody },
  )
  .put(
    "/:id",
    async ({ tenantId, params, body, set }) => {
      const now = new Date();
      const [updated] = await db
        .update(products)
        .set({ ...body, updatedAt: now })
        .where(
          and(
            eq(products.id, params.id),
            eq(products.organizationId, tenantId),
          ),
        )
        .returning();

      if (!updated) {
        set.status = 404;
        return { error: "Product not found" };
      }

      return updated;
    },
    { body: productUpdateBody },
  )
  .delete("/:id", async ({ tenantId, params, set }) => {
    const [deleted] = await db
      .delete(products)
      .where(
        and(eq(products.id, params.id), eq(products.organizationId, tenantId)),
      )
      .returning();

    if (!deleted) {
      set.status = 404;
      return { error: "Product not found" };
    }

    set.status = 204;
    return null;
  });
