import * as schema from "@qrave/db";
import { db } from "@qrave/db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { openAPI, organization } from "better-auth/plugins";

if (!process.env.BETTER_AUTH_SECRET) {
  throw new Error("BETTER_AUTH_SECRET is missing in .env");
}

if (!process.env.BETTER_AUTH_URL) {
  throw new Error("BETTER_AUTH_URL is missing in .env");
}

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3001",
  secret: process.env.BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: true,
  },
  database: drizzleAdapter(db, {
    provider: "sqlite",
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

let _openAPISchema: ReturnType<typeof auth.api.generateOpenAPISchema>;
const getOpenAPISchema = async () =>
  (_openAPISchema ??= auth.api.generateOpenAPISchema());

export const AuthOpenAPI = {
  getPaths: (prefix = "/api/auth") =>
    getOpenAPISchema().then(({ paths }) => {
      const reference: typeof paths = Object.create(null);
      for (const path of Object.keys(paths)) {
        const key = prefix + path;
        reference[key] = paths[path];
        for (const method of Object.keys(paths[path])) {
          const operation = (reference[key] as Record<string, unknown>)[method] as {
            tags?: string[];
          };
          operation.tags = ["Better Auth"];
        }
      }
      return reference;
    }) as Promise<unknown>,
  components: getOpenAPISchema().then(
    ({ components }) => components,
  ) as Promise<unknown>,
} as const;
