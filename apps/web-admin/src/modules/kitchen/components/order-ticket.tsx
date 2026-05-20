import type { Order } from "@/modules/kitchen";

interface OrderTicketProps {
  order: Order;
  onMarkReady: (orderId: string) => void;
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
  preparing: "bg-blue-100 text-blue-800 border-blue-300",
  ready: "bg-green-100 text-green-800 border-green-300",
};

export function OrderTicket({ order, onMarkReady }: OrderTicketProps) {
  const colorClass =
    STATUS_COLORS[order.status] ?? "bg-gray-100 text-gray-800 border-gray-300";

  return (
    <div className={`rounded-lg border-2 p-4 ${colorClass}`}>
      <div className="flex items-center justify-between">
        <span className="font-bold">Table {order.tableNumber}</span>
        <span className="text-xs font-semibold uppercase">{order.status}</span>
      </div>

      <div className="mt-2 text-sm">
        <p className="text-gray-600">Order #{order.id.slice(0, 8)}</p>
        <p className="font-semibold text-gray-900">
          Total: ${(order.total / 100).toFixed(2)}
        </p>
      </div>

      <div className="mt-2 text-xs text-gray-500">
        {new Date(order.createdAt).toLocaleTimeString()}
      </div>

      {order.status === "pending" && (
        <button
          type="button"
          onClick={() => onMarkReady(order.id)}
          className="mt-3 w-full rounded-md bg-blue-600 px-3 py-1.5 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          Start Preparing
        </button>
      )}

      {order.status === "preparing" && (
        <button
          type="button"
          onClick={() => onMarkReady(order.id)}
          className="mt-3 w-full rounded-md bg-green-600 px-3 py-1.5 text-white text-sm font-medium hover:bg-green-700 transition-colors"
        >
          Mark Ready
        </button>
      )}
    </div>
  );
}
