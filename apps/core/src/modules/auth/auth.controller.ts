import { auth } from "@qrave/auth";
import { Elysia } from "elysia";

export const authController = new Elysia({ prefix: "/api/auth" }).all(
  "/*",
  async ({ request }) => {
    return auth.handler(request);
  },
);
