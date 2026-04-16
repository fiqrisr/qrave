# Qrave Core

The backend API for Qrave — a multi-tenant QR code ordering SaaS for cafes.

## Overview

Built with [Elysia.js](https://elysiajs.com/) and TypeScript, providing:

- **Authentication**: Better Auth with organization-based multi-tenancy
- **Dashboard API**: Protected CRUD for categories and products
- **Public API**: Menu browsing and order placement via QR codes
- **Real-time**: WebSocket notifications for kitchen orders
- **Security**: IDOR prevention with tenant-scoped queries

## Project Structure

```
src/
├── lib/
│   └── auth.ts              # Better Auth configuration
├── middleware/
│   ├── tenant-guard.ts      # Session & tenant validation
│   └── slug-guard.ts        # Public cafe slug validation
├── modules/
│   ├── auth/
│   │   └── auth.controller.ts      # Auth endpoints
│   ├── public/
│   │   └── public.controller.ts    # Public menu & ordering
│   ├── dashboard/
│   │   ├── categories.controller.ts
│   │   └── products.controller.ts
│   └── ws/
│       └── orders.ws.ts            # Kitchen WebSocket
└── index.ts                 # App entry point
```

## API Endpoints

### Auth

- `ALL /api/auth/*` - Better Auth handler

### Public (No Auth)

- `GET /api/m/:slug/menu` - Get cafe menu by slug
- `POST /api/m/:slug/order` - Place an order

### Dashboard (Protected)

- `GET|POST|PUT|DELETE /api/dashboard/categories` - Category CRUD
- `GET|POST|PUT|DELETE /api/dashboard/products` - Product CRUD

### WebSocket

- `WS /ws/orders?tenantId=xxx` - Kitchen real-time updates

## Development

```bash
# Start dev server with hot reload
moon run core:dev

# Or directly
bun run --watch src/index.ts
```

Server runs at http://localhost:3000

## Environment Variables

```env
DATABASE_URL=local.db
BETTER_AUTH_SECRET=your-secret-key
BETTER_AUTH_URL=http://localhost:3000
```
