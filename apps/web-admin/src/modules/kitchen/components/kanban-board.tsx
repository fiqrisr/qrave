import { Grid, Group, Stack, Text, Title } from "@qrave/ui";
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
    return <Text c="dimmed">Loading orders...</Text>;
  }

  return (
    <Grid gap="md" style={{ height: "calc(100vh - 8rem)" }}>
      {COLUMNS.map(({ status, label }) => {
        const filtered = orders
          .filter((o) => o.status === status)
          .sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
          );

        return (
          <Grid.Col key={status} span={4}>
            <Stack gap="md">
              <Group justify="space-between">
                <Title order={3} size="lg">
                  {label}
                </Title>
                <Text size="sm" c="dimmed">
                  {filtered.length}
                </Text>
              </Group>

              {filtered.length === 0 ? (
                <Text size="sm" c="dimmed" ta="center" py="xl">
                  No {status} orders
                </Text>
              ) : (
                filtered.map((order) => (
                  <OrderTicket
                    key={order.id}
                    order={order}
                    onMarkReady={handleStatusUpdate}
                  />
                ))
              )}
            </Stack>
          </Grid.Col>
        );
      })}
    </Grid>
  );
}
