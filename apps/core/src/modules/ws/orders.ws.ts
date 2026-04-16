import { Elysia, t } from "elysia";

export const ordersWs = new Elysia().ws("/ws/orders", {
  query: t.Object({
    tenantId: t.String(),
  }),
  open(ws) {
    const { tenantId } = ws.data.query;
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
