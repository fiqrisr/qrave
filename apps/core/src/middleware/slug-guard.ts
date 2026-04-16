import { organizations } from "@qrave/db";
import { db } from "@qrave/db";
import { eq } from "drizzle-orm";
import { Elysia } from "elysia";

export const slugGuard = new Elysia({ name: "slugGuard" }).derive(
  { as: "scoped" },
  async ({ params, set }) => {
    const slug = (params as Record<string, string>).slug;

    if (!slug) {
      set.status = 400;
      throw new Error("Missing slug parameter");
    }

    const [org] = await db
      .select({ id: organizations.id })
      .from(organizations)
      .where(eq(organizations.slug, slug))
      .limit(1);

    if (!org) {
      set.status = 404;
      throw new Error("Cafe not found");
    }

    return { organizationId: org.id };
  },
);
