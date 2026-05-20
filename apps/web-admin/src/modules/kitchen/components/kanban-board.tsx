import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api-client";
import { useSession } from "@/lib/auth-client";
import type { Order } from "@/modules/kitchen";
import { useKitchenWs } from "@/modules/kitchen";
import { OrderTicket } from "./order-ticket";

type OrderStatus = "pending" | "preparing" | "ready";

const COLUMNS: { status: OrderStatus; label: string }[] = [
  { status: "pending", label: "Pending" },
  { status: "preparing", label: "Preparing" },
  { status: "ready", label: "Ready" },
];

const NEXT_STATUS: Record<string, OrderStatus> = {
  pending: "preparing",
  preparing: "ready",
};

export function KanbanBoard() {
  const { data: session } = useSession();
  const tenantId = session?.session?.activeOrganizationId;
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const apiClient = api as any;

  // biome-ignore lint/correctness/useExhaustiveDependencies: apiClient is a stable ref
  const fetchOrders = useCallback(async () => {
    if (!tenantId) return;
    setLoading(true);
    const res = await apiClient.api.dashboard.orders.get();
    if (!res.error && res.data) {
      setOrders(res.data as Order[]);
    }
    setLoading(false);
  }, [tenantId]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useKitchenWs((msg) => {
    if (msg.event === "new_order" && msg.order) {
      setOrders((prev) => [msg.order as Order, ...prev]);
    }
  });

  async function handleStatusUpdate(orderId: string) {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    const nextStatus = NEXT_STATUS[order.status];
    if (!nextStatus) return;

    const res = await apiClient.api.dashboard.orders({ id: orderId }).put({
      status: nextStatus,
    });

    if (!res.error) {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: nextStatus } : o)),
      );
    }
  }

  if (loading) {
    return <div className="text-gray-500">Loading orders...</div>;
  }

  return (
    <div className="grid grid-cols-3 gap-6 h-[calc(100vh-8rem)]">
      {COLUMNS.map(({ status, label }) => (
        <div key={status} className="flex flex-col">
          <h3 className="text-lg font-semibold mb-4 flex items-center justify-between">
            {label}
            <span className="text-sm font-normal text-gray-500">
              {orders.filter((o) => o.status === status).length}
            </span>
          </h3>
          <div className="flex-1 overflow-auto space-y-3">
            {orders
              .filter((o) => o.status === status)
              .sort(
                (a, b) =>
                  new Date(a.createdAt).getTime() -
                  new Date(b.createdAt).getTime(),
              )
              .map((order) => (
                <OrderTicket
                  key={order.id}
                  order={order}
                  onMarkReady={handleStatusUpdate}
                />
              ))}
            {orders.filter((o) => o.status === status).length === 0 && (
              <div className="text-sm text-gray-400 text-center py-8">
                No {status} orders
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
