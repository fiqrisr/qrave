import { edenTreaty } from "@elysiajs/eden";
import type { App } from "@qrave/core";

export const api = edenTreaty<App>("http://localhost:3000", {
  fetch: {
    credentials: "include",
  },
});
