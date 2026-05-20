import { Alert, Button, Stack, Text, TextInput, Title } from "@qrave/ui";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/setup")({
  beforeLoad: async () => {
    const session = await authClient.getSession();
    if (!session.data) {
      throw redirect({ to: "/login" });
    }
    // Already has an active org — go to dashboard
    if (session.data.session.activeOrganizationId) {
      throw redirect({ to: "/" });
    }
  },
  component: SetupPage,
});

function SetupPage() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setCreating(true);

    try {
      const res = await authClient.organization.create({
        name,
        slug: slug || name.toLowerCase().replace(/\s+/g, "-"),
      });

      if (res.error) {
        setError(res.error.message ?? "Failed to create cafe");
        return;
      }

      // Activate the new org and redirect
      if (res.data?.id) {
        await authClient.organization.setActive({
          organizationId: res.data.id,
        });
      }

      globalThis.window.location.href = "/";
    } catch {
      setError("Failed to create cafe");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--mantine-color-gray-0)",
      }}
    >
      <form onSubmit={handleSubmit}>
        <Stack
          gap="md"
          w={400}
          p="xl"
          bg="var(--mantine-color-white)"
          style={{
            borderRadius: "var(--mantine-radius-md)",
            boxShadow: "var(--mantine-shadow-md)",
          }}
        >
          <Title order={2} ta="center">
            Create Your Cafe
          </Title>
          <Text size="sm" c="dimmed" ta="center">
            You need a cafe to get started. Create one now.
          </Text>

          {error && <Alert color="red">{error}</Alert>}

          <TextInput
            label="Cafe Name"
            required
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
          />

          <TextInput
            label="Slug"
            description="Auto-generated from name if left empty"
            placeholder={name.toLowerCase().replace(/\s+/g, "-")}
            value={slug}
            onChange={(e) => setSlug(e.currentTarget.value)}
          />

          <Button type="submit" fullWidth disabled={creating}>
            {creating ? "Creating..." : "Create Cafe"}
          </Button>
        </Stack>
      </form>
    </div>
  );
}
