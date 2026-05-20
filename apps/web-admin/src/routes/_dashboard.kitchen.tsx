import { Title } from "@qrave/ui";
import { createFileRoute } from "@tanstack/react-router";
import { KanbanBoard } from "@/modules/kitchen";

export const Route = createFileRoute("/_dashboard/kitchen")({
  component: KitchenPage,
});

function KitchenPage() {
  return (
    <div>
      <Title order={2} mb="md">
        Kitchen Display
      </Title>
      <KanbanBoard />
    </div>
  );
}
