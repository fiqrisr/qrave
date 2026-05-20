import { Elysia, t } from "elysia";
import { tenantGuard } from "../../middleware/tenant-guard";
import { listOrders, updateOrderStatus } from "./order.service";

export const orderController = new Elysia({
  prefix: "/api/dashboard/orders",
})
  .use(tenantGuard)
  .get(
    "/",
    async ({ tenantId }) => {
      return listOrders(tenantId);
    },
    { detail: { tags: ["Orders"], summary: "List orders" } },
  )
  .put(
    "/:id",
    async ({ tenantId, params, body, set }) => {
      const updated = await updateOrderStatus(tenantId, params.id, body);
      if (!updated) {
        set.status = 404;
        return { error: "Order not found" };
      }
      return updated;
    },
    {
      body: t.Object({
        status: t.String({ minLength: 1 }),
      }),
      detail: { tags: ["Orders"], summary: "Update order status" },
    },
  );
