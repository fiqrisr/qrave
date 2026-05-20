# Qrave Database

Database schema and client for Qrave — shared across all applications.

## Overview

This package provides:

- **Drizzle ORM** schema definitions
- **Database client** configured with Postgres (via `postgres` + Drizzle)
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

The client is configured to use Postgres via the `postgres` package and Drizzle's Postgres adapter:

```/dev/null/example.ts#L1-8
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from './schema';

const sql = postgres(process.env.DATABASE_URL ?? 'postgresql://postgres:postgres@localhost:5432/qrave');
export const db = drizzle(sql, { schema });
```

For local development a Postgres instance is provided in `infra/docker-compose.yml`.

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
