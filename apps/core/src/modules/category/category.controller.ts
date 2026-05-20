import { Elysia, t } from "elysia";
import { tenantGuard } from "../../middleware/tenant-guard";
import {
  createCategory,
  deleteCategory,
  listCategories,
  updateCategory,
} from "./category.service";

const categoryBody = t.Object({
  name: t.String({ minLength: 1 }),
});

export const categoryController = new Elysia({
  prefix: "/api/dashboard/categories",
})
  .use(tenantGuard)
  .get(
    "/",
    async ({ tenantId }) => {
      return listCategories(tenantId);
    },
    { detail: { tags: ["Categories"], summary: "List categories" } },
  )
  .post(
    "/",
    async ({ tenantId, body, set }) => {
      const created = await createCategory(tenantId, body);
      set.status = 201;
      return created;
    },
    {
      body: categoryBody,
      detail: { tags: ["Categories"], summary: "Create category" },
    },
  )
  .put(
    "/:id",
    async ({ tenantId, params, body, set }) => {
      const updated = await updateCategory(tenantId, params.id, body);
      if (!updated) {
        set.status = 404;
        return { error: "Category not found" };
      }
      return updated;
    },
    {
      body: categoryBody,
      detail: { tags: ["Categories"], summary: "Update category" },
    },
  )
  .delete(
    "/:id",
    async ({ tenantId, params, set }) => {
      const deleted = await deleteCategory(tenantId, params.id);
      if (!deleted) {
        set.status = 404;
        return { error: "Category not found" };
      }
      set.status = 204;
      return null;
    },
    { detail: { tags: ["Categories"], summary: "Delete category" } },
  );
