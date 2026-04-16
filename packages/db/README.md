# Qrave Database

Database schema and client for Qrave — shared across all applications.

## Overview

This package provides:

- **Drizzle ORM** schema definitions
- **Database client** configured with `bun:sqlite`
- **Type-safe exports** for all tables

## Schema

### Better Auth Tables
- `users` - User accounts
- `sessions` - Active sessions with `activeOrganizationId`
- `accounts` - OAuth/provider accounts
- `verifications` - Email verification tokens

### Organization Tables
- `organizations` - Cafes/shops (with unique `slug`)
- `members` - Organization memberships
- `invitations` - Organization invitations

### Business Tables
- `categories` - Product categories per organization
- `products` - Menu items with availability status
- `orders` - Customer orders with table numbers
- `orderItems` - Line items for each order

## Usage

```typescript
import { db, users, products } from "@qrave/db";
import { eq } from "drizzle-orm";

// Query users
const allUsers = await db.select().from(users);

// Query products for an organization
const orgProducts = await db
  .select()
  .from(products)
  .where(eq(products.organizationId, tenantId));
```

## Database Client

The client is configured to use `bun:sqlite`:

```typescript
// packages/db/src/index.ts
import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";

const sqlite = new Database(process.env.DATABASE_URL ?? "local.db");
export const db = drizzle(sqlite, { schema });
```

## Migrations

```bash
# Generate migrations from schema changes
moon run db:generate

# Push schema to database
moon run db:push
```

## Environment

```env
DATABASE_URL=local.db  # Defaults to local.db if not set
```
