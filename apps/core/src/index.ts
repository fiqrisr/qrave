import { openapi } from "@elysiajs/openapi";
import { Elysia } from "elysia";
import { categoriesController } from "./modules/dashboard/categories.controller";
import { productsController } from "./modules/dashboard/products.controller";
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
        ],
      },
      path: "/docs",
    }),
  )
  .use(publicController)
  .use(categoriesController)
  .use(productsController)
  .use(ordersWs)
  .listen(3000);

console.log(`Core service running at ${app.server?.hostname}:${app.server?.port}`);

export type App = typeof app;
