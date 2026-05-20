import { Elysia, t } from "elysia";
import { tenantGuard } from "../../middleware/tenant-guard";
import {
  createProduct,
  deleteProduct,
  listProducts,
  updateProduct,
} from "./product.service";

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

export const productController = new Elysia({
  prefix: "/api/dashboard/products",
})
  .use(tenantGuard)
  .get(
    "/",
    async ({ tenantId }) => {
      return listProducts(tenantId);
    },
    { detail: { tags: ["Dashboard"], summary: "List products" } },
  )
  .post(
    "/",
    async ({ tenantId, body, set }) => {
      const created = await createProduct(tenantId, body);
      set.status = 201;
      return created;
    },
    {
      body: productBody,
      detail: { tags: ["Dashboard"], summary: "Create product" },
    },
  )
  .put(
    "/:id",
    async ({ tenantId, params, body, set }) => {
      const updated = await updateProduct(tenantId, params.id, body);
      if (!updated) {
        set.status = 404;
        return { error: "Product not found" };
      }
      return updated;
    },
    {
      body: productUpdateBody,
      detail: { tags: ["Dashboard"], summary: "Update product" },
    },
  )
  .delete(
    "/:id",
    async ({ tenantId, params, set }) => {
      const deleted = await deleteProduct(tenantId, params.id);
      if (!deleted) {
        set.status = 404;
        return { error: "Product not found" };
      }
      set.status = 204;
      return null;
    },
    { detail: { tags: ["Dashboard"], summary: "Delete product" } },
  );
