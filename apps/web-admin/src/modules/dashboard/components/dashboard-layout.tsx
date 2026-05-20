import { AppShell, Button, NavLink, Text } from "@qrave/ui";
import { Link, Outlet } from "@tanstack/react-router";
import {
  ChefHat,
  LayoutDashboard,
  LogOut,
  UtensilsCrossed,
} from "lucide-react";
import { signOut } from "@/lib/auth-client";
import { OrgSwitcher } from "./org-switcher";

export function DashboardLayout() {
  async function handleSignOut() {
    await signOut();
    globalThis.window.location.reload();
  }

  return (
    <AppShell navbar={{ width: 256, breakpoint: "sm" }} padding="md">
      <AppShell.Navbar p="md">
        <Text fw={700} size="xl" c="qrave-primary.5">
          Qrave
        </Text>

        <AppShell.Section mt="md">
          <OrgSwitcher />
        </AppShell.Section>

        <AppShell.Section grow mt="md">
          <NavLink
            label="Overview"
            leftSection={<LayoutDashboard size={16} />}
            component={Link}
            to="/"
          />
          <NavLink
            label="Menu"
            leftSection={<UtensilsCrossed size={16} />}
            component={Link}
            to="/menu"
          />
          <NavLink
            label="Kitchen"
            leftSection={<ChefHat size={16} />}
            component={Link}
            to="/kitchen"
          />
        </AppShell.Section>

        <AppShell.Section>
          <Button
            variant="subtle"
            fullWidth
            leftSection={<LogOut size={16} />}
            onClick={handleSignOut}
          >
            Sign Out
          </Button>
        </AppShell.Section>
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
