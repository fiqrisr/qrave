# Qrave

A multi-tenant QR code ordering SaaS for cafes. Built with Bun, Elysia.js, and Drizzle ORM.

## Architecture

This is a monorepo managed by [Moonrepo](https://moonrepo.dev/).

```
qrave/
├── apps/
│   └── core/          # Elysia.js backend API
├── packages/
│   └── db/            # Drizzle ORM schema & database client
```

## Tech Stack

- **Runtime:** Bun v1.3+
- **Monorepo:** Moonrepo v2
- **Backend:** Elysia.js
- **Database:** Postgres (local via Docker Compose) + Drizzle ORM
- **Auth:** Better Auth with organization plugin
- **Real-time:** WebSockets

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) v1.3 or higher
- [Proto](https://moonrepo.dev/proto) (recommended for tool management)

### Install Dependencies

```bash
bun install
```

### Database Setup

Start a local Postgres instance with Docker Compose:

```bash
cd infra
docker compose up -d
```

Then generate and push migrations:

```bash
moon run db:generate
moon run db:push
```


### Run Development Server

```bash
# Start the API server
moon run core:dev
```

## Available Scripts

| Command                | Description                              |
| ---------------------- | ---------------------------------------- |
| `moon run core:dev`    | Start the API dev server with hot reload |
| `moon run db:generate` | Generate Drizzle migrations              |
| `moon run db:push`     | Push schema changes to database          |
| `bunx biome check`     | Run linter/formatter                     |
| `bunx biome format`    | Format code                              |

## Environment Variables

Create a `.env` file in the repo root or the apps that will run (for dev):

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/qrave
BETTER_AUTH_SECRET=your-secret-key
BETTER_AUTH_URL=http://localhost:3001
```

## License

MIT
