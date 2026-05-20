import { openapi } from "@elysiajs/openapi";
import { Elysia } from "elysia";
import { authController, getAuthOpenAPISchema } from "./modules/auth";
import { categoryController } from "./modules/category";
import { productController } from "./modules/product";
import { publicController } from "./modules/public";
import { ordersWs } from "./modules/ws";

// ─── Merge Better Auth OpenAPI spec into Elysia documentation ───────────────
const authSchema = await getAuthOpenAPISchema();

const app = new Elysia()
  .use(
    openapi({
      documentation: {
        openapi: "3.1.0",
        info: {
          title: "Qrave API",
          version: "1.0.0",
          description:
            "Multi-tenant QR code ordering SaaS for cafes. Manage menus, categories, products, and receive real-time kitchen orders.",
          contact: {
            name: "Qrave Support",
            email: "support@qrave.com",
          },
        },
        servers: [
          {
            url: "http://localhost:3000",
            description: "Local development",
          },
        ],
        tags: [
          {
            name: "Auth",
            description:
              "Authentication & multi-tenant organization management (Better Auth). All endpoints operate under `/api/auth`.",
          },
          {
            name: "Public",
            description:
              "Public-facing menu browsing and ordering. Accessible via cafe slug (e.g. `/api/m/{slug}/menu`). No authentication required.",
          },
          {
            name: "Categories",
            description:
              "Manage menu categories (CRUD). Requires an authenticated session with a valid tenant (organization).",
          },
          {
            name: "Products",
            description:
              "Manage menu products (CRUD). Requires an authenticated session with a valid tenant (organization).",
          },
        ],
        // Merge Better Auth paths and components
        paths: authSchema.paths as unknown as Record<
          string,
          Record<string, unknown>
        >,
        components: {
          ...((authSchema.components ?? {}) as Record<string, unknown>),
          securitySchemes: {
            ...((authSchema.components?.securitySchemes ?? {}) as Record<
              string,
              unknown
            >),
            cookieAuth: {
              type: "apiKey",
              in: "cookie",
              name: "better-auth.session_token",
              description:
                "Session cookie set automatically by Better Auth after login.",
            },
          },
        },
        security: [
          { cookieAuth: [] },
          {
            ...(authSchema.security?.[0] ?? {}),
          },
        ],
      },
      path: "/docs",
    }),
  )
  .use(authController)
  .use(publicController)
  .use(categoryController)
  .use(productController)
  .use(ordersWs)
  .listen(3000);

console.log(`Qrave API running at ${app.server?.hostname}:${app.server?.port}`);

export type App = typeof app;
