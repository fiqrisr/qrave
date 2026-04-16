import { Elysia } from "elysia";
import { authController } from "./modules/auth/auth.controller";
import { categoriesController } from "./modules/dashboard/categories.controller";
import { productsController } from "./modules/dashboard/products.controller";
import { publicController } from "./modules/public/public.controller";
import { ordersWs } from "./modules/ws/orders.ws";

const app = new Elysia()
  .use(authController)
  .use(publicController)
  .use(categoriesController)
  .use(productsController)
  .use(ordersWs)
  .listen(3000);

console.log(`Elysia is running at ${app.server?.hostname}:${app.server?.port}`);

export type App = typeof app;
