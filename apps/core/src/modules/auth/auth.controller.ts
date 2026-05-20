import { Elysia } from "elysia";
import { auth } from "../../auth";

export const authController = new Elysia({ prefix: "/api/auth" }).all(
  "/*",
  async ({ request }) => {
    return auth.handler(request);
  },
);
