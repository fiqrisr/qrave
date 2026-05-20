import { Alert, Button, Group, Stack, TextInput, Title } from "@qrave/ui";
import { useState } from "react";
import { api } from "@/lib/api-client";
import type { Category } from "@/modules/menu";

interface CategoryFormProps {
  category?: Category;
  onSuccess: () => void;
  onCancel: () => void;
}

export function CategoryForm({
  category,
  onSuccess,
  onCancel,
}: CategoryFormProps) {
  const [name, setName] = useState(category?.name ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const isEdit = !!category;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      if (isEdit) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const res = await (api as any).api.dashboard
          .categories({ id: category!.id })
          .put({ name });
        if (res.error) {
          setError(
            typeof res.error.value === "string"
              ? res.error.value
              : "Failed to update category",
          );
          return;
        }
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const res = await (api as any).api.dashboard.categories.post({ name });
        if (res.error) {
          setError(
            typeof res.error.value === "string"
              ? res.error.value
              : "Failed to create category",
          );
          return;
        }
      }
      onSuccess();
    } catch {
      setError("Failed to save category");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="md" maw={400}>
        <Title order={3}>{isEdit ? "Edit Category" : "New Category"}</Title>

        {error && <Alert color="red">{error}</Alert>}

        <TextInput
          label="Name"
          required
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
        />

        <Group gap="xs">
          <Button type="submit" disabled={submitting}>
            {submitting ? "Saving..." : isEdit ? "Update" : "Create"}
          </Button>
          <Button variant="default" onClick={onCancel}>
            Cancel
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
