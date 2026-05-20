import { createFileRoute, redirect } from "@tanstack/react-router";
import { authClient } from "@/lib/auth-client";
import { DashboardLayout } from "@/modules/dashboard";

export const Route = createFileRoute("/_dashboard")({
  beforeLoad: async () => {
    const session = await authClient.getSession();

    if (!session.data) {
      throw redirect({ to: "/login" });
    }

    // No active org — try to set one or redirect to setup
    if (!session.data.session.activeOrganizationId) {
      const orgs = await authClient.organization.list();
      if (!orgs.data || orgs.data.length === 0) {
        throw redirect({ to: "/setup" });
      }
      await authClient.organization.setActive({
        organizationId: orgs.data[0].id,
      });
    }
  },
  component: DashboardLayout,
});
