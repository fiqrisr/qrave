import { AuthOpenAPI } from "@qrave/auth";
import { openapi } from "@elysiajs/openapi";
import { Elysia } from "elysia";
import { authController } from "./modules/auth/auth.controller";

const app = new Elysia()
  .use(
    openapi({
      documentation: {
        info: {
          title: "Qrave Auth Service",
          version: "1.0.0",
          description: "Authentication microservice for Qrave",
        },
        tags: [
          { name: "Better Auth", description: "Authentication endpoints" },
        ],
        components: await AuthOpenAPI.components,
        paths: await AuthOpenAPI.getPaths(),
      },
      path: "/docs",
    }),
  )
  .use(authController)
  .listen(3001);

console.log(
  `Auth service running at ${app.server?.hostname}:${app.server?.port}`,
);

export type AuthApp = typeof app;
