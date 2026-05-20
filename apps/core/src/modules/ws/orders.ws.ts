import { Elysia, t } from "elysia";
import { auth } from "../auth";

export const ordersWs = new Elysia().ws("/ws/orders", {
  query: t.Object({
    tenantId: t.String(),
  }),
  async open(ws) {
    const session = await auth.api.getSession({
      headers: ws.data.headers,
    });

    if (!session) {
      ws.close(4001, "Unauthorized");
      return;
    }

    const { tenantId } = ws.data.query;

    if (session.session.activeOrganizationId !== tenantId) {
      ws.close(4003, "Forbidden: tenant mismatch");
      return;
    }

    ws.subscribe(`room:org_${tenantId}:kitchen`);
  },
  close(ws) {
    const { tenantId } = ws.data.query;
    ws.unsubscribe(`room:org_${tenantId}:kitchen`);
  },
  message(ws, message) {
    ws.send(message);
  },
});
