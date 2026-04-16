import { categories } from "@qrave/db";
import { db } from "@qrave/db";
import { and, eq } from "drizzle-orm";
import { Elysia, t } from "elysia";
import { tenantGuard } from "../../middleware/tenant-guard";

const categoryBody = t.Object({
  name: t.String({ minLength: 1 }),
});

export const categoriesController = new Elysia({
  prefix: "/api/dashboard/categories",
})
  .use(tenantGuard)
  .get("/", async ({ tenantId }) => {
    return db
      .select()
      .from(categories)
      .where(eq(categories.organizationId, tenantId));
  })
  .post(
    "/",
    async ({ tenantId, body, set }) => {
      const now = new Date();
      const [created] = await db
        .insert(categories)
        .values({
          id: crypto.randomUUID(),
          organizationId: tenantId,
          name: body.name,
          createdAt: now,
          updatedAt: now,
        })
        .returning();

      set.status = 201;
      return created;
    },
    { body: categoryBody },
  )
  .put(
    "/:id",
    async ({ tenantId, params, body, set }) => {
      const now = new Date();
      const [updated] = await db
        .update(categories)
        .set({ name: body.name, updatedAt: now })
        .where(
          and(
            eq(categories.id, params.id),
            eq(categories.organizationId, tenantId),
          ),
        )
        .returning();

      if (!updated) {
        set.status = 404;
        return { error: "Category not found" };
      }

      return updated;
    },
    { body: categoryBody },
  )
  .delete("/:id", async ({ tenantId, params, set }) => {
    const [deleted] = await db
      .delete(categories)
      .where(
        and(
          eq(categories.id, params.id),
          eq(categories.organizationId, tenantId),
        ),
      )
      .returning();

    if (!deleted) {
      set.status = 404;
      return { error: "Category not found" };
    }

    set.status = 204;
    return null;
  });
