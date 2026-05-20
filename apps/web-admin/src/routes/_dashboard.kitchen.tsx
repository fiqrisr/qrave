import { createFileRoute } from "@tanstack/react-router";
import { KanbanBoard } from "@/modules/kitchen";

export const Route = createFileRoute("/_dashboard/kitchen")({
  component: KitchenPage,
});

function KitchenPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Kitchen Display</h1>
      <KanbanBoard />
    </div>
  );
}
