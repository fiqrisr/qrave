import { Button, Group, Title } from "@qrave/ui";
import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useState } from "react";
import { CategoryForm, ProductList } from "@/modules/menu";

export const Route = createFileRoute("/_dashboard/menu")({
  component: MenuPage,
});

function MenuPage() {
  const [showCategoryForm, setShowCategoryForm] = useState(false);

  return (
    <div>
      <Group justify="space-between" mb="md">
        <Title order={2}>Menu</Title>
        <Button
          leftSection={<Plus size={16} />}
          onClick={() => setShowCategoryForm(!showCategoryForm)}
        >
          New Category
        </Button>
      </Group>

      {showCategoryForm && (
        <CategoryForm
          onSuccess={() => setShowCategoryForm(false)}
          onCancel={() => setShowCategoryForm(false)}
        />
      )}

      <ProductList />
    </div>
  );
}
