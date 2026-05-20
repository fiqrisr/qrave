import { openapi } from "@elysiajs/openapi";
import { Elysia } from "elysia";
import { authController } from "./modules/auth/auth.controller";
import { categoryController } from "./modules/category";
import { productController } from "./modules/product";
import { publicController } from "./modules/public/public.controller";
import { ordersWs } from "./modules/ws/orders.ws";

const app = new Elysia()
  .use(
    openapi({
      documentation: {
        info: {
          title: "Qrave API",
          version: "1.0.0",
          description: "Multi-tenant QR code ordering SaaS for cafes",
        },
        tags: [
          {
            name: "Public",
            description: "Public menu and ordering (no auth required)",
          },
          {
            name: "Dashboard",
            description: "Protected dashboard endpoints (requires auth)",
          },
          {
            name: "Auth",
            description: "Authentication endpoints (Better Auth)",
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
