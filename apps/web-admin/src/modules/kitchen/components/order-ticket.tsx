import { Badge, Button, Card, Group, Stack, Text } from "@qrave/ui";
import type { Order } from "@/modules/kitchen";

interface OrderTicketProps {
  order: Order;
  onMarkReady: (orderId: string) => void;
}

const STATUS_COLORS: Record<
  string,
  { color: string; variant: "light" | "filled" | "outline" }
> = {
  pending: { color: "yellow", variant: "light" },
  preparing: { color: "blue", variant: "light" },
  ready: { color: "green", variant: "light" },
};

export function OrderTicket({ order, onMarkReady }: OrderTicketProps) {
  const statusConfig = STATUS_COLORS[order.status] ?? {
    color: "gray",
    variant: "light" as const,
  };

  return (
    <Card withBorder>
      <Card.Section>
        <Group justify="space-between" p="md" pb={0}>
          <Text fw={700}>Table {order.tableNumber}</Text>
          <Badge color={statusConfig.color} variant={statusConfig.variant}>
            {order.status}
          </Badge>
        </Group>
      </Card.Section>

      <Stack gap={4} mt="xs">
        <Text size="sm" c="dimmed">
          Order #{order.id.slice(0, 8)}
        </Text>
        <Text fw={600}>Total: ${(order.total / 100).toFixed(2)}</Text>
      </Stack>

      <Text size="xs" c="dimmed" mt="xs">
        {new Date(order.createdAt).toLocaleTimeString()}
      </Text>

      {order.status === "pending" && (
        <Button
          mt="sm"
          fullWidth
          size="compact-md"
          color="blue"
          onClick={() => onMarkReady(order.id)}
        >
          Start Preparing
        </Button>
      )}

      {order.status === "preparing" && (
        <Button
          mt="sm"
          fullWidth
          size="compact-md"
          color="green"
          onClick={() => onMarkReady(order.id)}
        >
          Mark Ready
        </Button>
      )}
    </Card>
  );
}
