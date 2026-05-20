export { KanbanBoard } from "./components/kanban-board";
export { OrderTicket } from "./components/order-ticket";
export { useKitchenWs } from "./hooks/use-kitchen-ws";

export interface Order {
  id: string;
  organizationId: string;
  tableNumber: string;
  status: string;
  total: number;
  createdAt: string;
}
