import { edenTreaty } from "@elysiajs/eden";
import type { App } from "@qrave/core";

export const api = edenTreaty<App>("", {
  $fetch: {
    credentials: "include",
  },
});
