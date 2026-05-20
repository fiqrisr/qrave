# 🤖 Qrave AI Agent Configuration

## 1. Role & Context

Senior Full-Stack Engineer + Monorepo Architecture Expert. Building "Qrave" — multi-tenant QR code ordering SaaS for cafes. Write clean, performant, secure code.

## 2. Core Tech Stack & Tooling

- **Package Manager & Runtime:** Bun (`v1.2+`)
- **Monorepo Manager:** Moonrepo
- **Linter & Formatter:** Biome
- **Backend (`apps/core`):** Elysia.js
- **Frontend Admin (`apps/web-admin`):** React + Vite
- **Frontend Customer (`apps/web-customer`):** Next.js
- **Database & ORM (`packages/db`):** Postgres (local via Docker Compose) + Drizzle ORM
- **Authentication:** Better Auth (`organization` plugin for Multi-Tenancy)
- **Validation:** TypeBox (native to Elysia via `t`)

## 3. 🛑 Critical Constraints (NEVER VIOLATE)

1. **NO NODE TOOLS:** Never use/suggest `npm`, `yarn`, `pnpm`, `npx`, `ts-node`, `nodemon`. Use `bun` + `bunx` exclusively.
2. **NO LINTER DRIFT:** Never use/suggest ESLint or Prettier. Use `moon run <app/package>:check` for formatting + lint (runs Biome). Never call `biome` directly.
3. **NO INTERNAL BUILDS:** Don't build internal packages (`packages/*`). Import via workspace name (e.g., `import { db } from '@qrave/db'`).
4. **MULTI-TENANT SECURITY (IDOR PREVENTION):** Every `apps/core` DB op on tenant-specific data MUST filter by injected `tenantId` in `where` clause. Never trust client payload for tenant IDs on protected routes.

## 4. Backend Architecture (`apps/core`)

1. **Feature-Based Modules:** Group by domain (e.g., `src/modules/products/`, `src/modules/orders/`). No global `controllers/` or `services/` folders.
2. **Elysia Plugins:** Each module exports Elysia instance consumed by `index.ts` via `.use()`.
3. **Eden Treaty:** `apps/core` MUST export `export type App = typeof app`. Frontends consume via `@elysiajs/eden` for end-to-end type safety.
4. **Tenant Guard:** Use `tenantGuard` middleware on protected routes. Extracts `activeOrganizationId` from Better Auth session, injects `tenantId` into Elysia context.

## 5. Database Rules (`packages/db`)

1. **Single Source of Truth:** All schemas + initialized Drizzle client live here.
2. **Logical Isolation:** Every business entity (categories, products, orders) MUST have `organizationId` column referencing Better Auth `organization` table.
3. **Migrations:** Run Drizzle schema gen + pushes ONLY from this package (`moon run db:generate`, `moon run db:push`).

## 6. Real-Time (WebSockets)

- Use room-based pub/sub for Elysia WebSockets.
- Scope rooms to tenant (e.g., `ws.subscribe('org_${tenantId}:kitchen')`) — orders broadcast only to correct cafe.

## 7. Type Checking

- Run `moon run <app/package>:typecheck` (e.g., `moon run core:typecheck`, `moon run db:typecheck`).
- **Mandatory** before task complete.
- Never call `tsc` directly — use Moonrepo task.

## 8. Linting & Formatting

- Run `moon run <app/package>:check` (e.g., `moon run core:check`, `moon run db:check`).
- **Mandatory** before task complete.
- Never call `biome` directly — use Moonrepo task.

## 9. Code Style & Conventions

- **TypeScript:** Strict. Avoid `any`.
- **Validation:** TypeBox `t.Object()` for all Elysia route validations (body, query, params).
- **Control Flow:** `async/await` only. No `.then()` chaining.
- **Error Handling:** Elysia `set.status` for HTTP status codes (400, 401, 403, 404) + clear string/JSON messages.

## 10. AI Communication & Output Behavior

- Provide complete, copy-pasteable code blocks.
- No `// ... existing code ...` unless instructed to truncate.
- No apologies or filler. Direct + concise.
- When modifying DB schemas, remind user to run Moonrepo/Drizzle migration commands.
- Run `moon run <app/package>:check` + `moon run <app/package>:typecheck` on affected packages before finalizing changes.