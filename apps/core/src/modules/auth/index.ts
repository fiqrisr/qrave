export { authController } from "./auth.controller";

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { openAPI, organization } from "better-auth/plugins";
import * as schema from "../../db";
import { db } from "../../db";

if (!process.env.BETTER_AUTH_SECRET) {
  throw new Error("BETTER_AUTH_SECRET is missing in .env");
}

if (!process.env.BETTER_AUTH_URL) {
  throw new Error("BETTER_AUTH_URL is missing in .env");
}

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3001",
  trustedOrigins: ["http://localhost:3001"],
  secret: process.env.BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: true,
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.users,
      session: schema.sessions,
      account: schema.accounts,
      verification: schema.verifications,
      organization: schema.organizations,
      member: schema.members,
      invitation: schema.invitations,
    },
  }),
  plugins: [organization(), openAPI()],
});

let _openAPISchema: Awaited<ReturnType<typeof auth.api.generateOpenAPISchema>>;

/**
 * Generate the Better Auth OpenAPI schema with paths prefixed to /api/auth.
 * Cached after first call.
 */
export async function getAuthOpenAPISchema() {
  if (!_openAPISchema) {
    _openAPISchema = await auth.api.generateOpenAPISchema();
  }

  const { paths, components } = _openAPISchema;
  const prefix = "/api/auth";
  const prefixedPaths: typeof paths = Object.create(null);

  for (const [path, methods] of Object.entries(paths)) {
    const key = prefix + path;
    prefixedPaths[key] = methods;
    for (const method of Object.keys(methods)) {
      const operation = (prefixedPaths[key] as Record<string, unknown>)[
        method
      ] as {
        tags?: string[];
      };
      operation.tags = ["Auth"];
    }
  }

  return {
    paths: prefixedPaths,
    components: components ?? {},
    tags: _openAPISchema.tags,
    security: _openAPISchema.security,
    servers: _openAPISchema.servers,
  };
}
