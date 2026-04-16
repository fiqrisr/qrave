import { Elysia } from "elysia";
import { auth } from "../lib/auth";

export const tenantGuard = new Elysia({ name: "tenantGuard" }).derive(
  { as: "scoped" },
  async ({ request, set }) => {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session) {
      set.status = 401;
      throw new Error("Unauthorized");
    }

    const tenantId = session.session.activeOrganizationId;

    if (!tenantId) {
      set.status = 403;
      throw new Error("No active cafe selected");
    }

    return { user: session.user, tenantId };
  },
);
