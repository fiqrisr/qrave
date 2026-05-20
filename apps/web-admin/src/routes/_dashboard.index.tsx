import { Card, Grid, Group, Stack, Text, Title } from "@qrave/ui";
import { createFileRoute } from "@tanstack/react-router";
import { LayoutDashboard, QrCode } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useSession } from "@/lib/auth-client";

export const Route = createFileRoute("/_dashboard/")({
  component: DashboardIndex,
});

function DashboardIndex() {
  const { data: session } = useSession();
  const activeOrg = session?.session?.activeOrganizationId;
  const menuUrl = activeOrg
    ? `http://localhost:3000/api/m/${activeOrg}/menu`
    : "";

  return (
    <Stack gap="xl">
      <Group gap="sm">
        <LayoutDashboard
          size={32}
          color="var(--mantine-color-qrave-primary-5)"
        />
        <Title order={2}>Dashboard</Title>
      </Group>

      <Grid gap="md">
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card withBorder p="xl">
            <Title order={4}>Welcome back</Title>
            <Text c="dimmed" mt={4}>
              Manage your cafe menu and kitchen orders from here.
            </Text>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card withBorder p="xl">
            <Group gap="sm" mb="md">
              <QrCode size={20} color="var(--mantine-color-qrave-primary-5)" />
              <Title order={4}>Menu QR Code</Title>
            </Group>

            {activeOrg ? (
              <Stack align="center" gap="md">
                <QRCodeSVG value={menuUrl} size={180} />
                <Text
                  size="xs"
                  c="dimmed"
                  ta="center"
                  style={{ wordBreak: "break-all" }}
                >
                  {menuUrl}
                </Text>
              </Stack>
            ) : (
              <Text c="dimmed">Select a cafe to generate a QR code.</Text>
            )}
          </Card>
        </Grid.Col>
      </Grid>
    </Stack>
  );
}
