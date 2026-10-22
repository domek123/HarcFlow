# HarcApp

HarcApp is a scout troop management platform built for everyday work with
troops, patrols and their members. It combines a mobile application, a web
application and a NestJS API backed by PostgreSQL.

The platform supports:

- troop members, patrols and staff functions,
- events and attendance tracking,
- attendance statistics,
- scout degrees, degree templates and degree tasks,
- badges and troop inventory,
- member notes and parent information,
- Supabase authentication,
- role- and troop-based authorization.

The project is maintained as a pnpm workspace managed by Turborepo. Shared
TypeScript packages contain API clients, domain types, validation schemas and
utility functions used by the applications.

## Architecture

```text
                         ┌──────────────────────┐
                         │   React + Vite Web   │
                         │      apps/web        │
                         └──────────┬───────────┘
                                    │
                         shared API client/types
                                    │
┌──────────────────────┐            │            ┌────────────────────────┐
│ React Native + Expo  │────────────┼───────────▶│ NestJS REST API         │
│     apps/mobile      │            │            │        apps/api          │
└──────────┬───────────┘            │            └───────────┬────────────┘
           │                        │                        │
           │ Supabase Auth          │                        │ Prisma ORM
           ▼                        │                        ▼
┌──────────────────────┐            │            ┌────────────────────────┐
│ Supabase Auth        │◀───────────┘            │ PostgreSQL / Supabase  │
│ JWT access tokens    │                         │ RLS + relational data  │
└──────────────────────┘                         └────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│ Shared packages: api-client · types · validators · utils                 │
└──────────────────────────────────────────────────────────────────────────┘
```

### Application responsibilities

| Component             | Responsibility                                                            |
| --------------------- | ------------------------------------------------------------------------- |
| `apps/api`            | REST endpoints, validation, authorization, health check and Prisma access |
| `apps/web`            | Browser interface for troop management                                    |
| `apps/mobile`         | React Native/Expo interface for mobile users                              |
| `packages/api-client` | Shared API functions and React Query hooks                                |
| `packages/types`      | Shared DTOs and Prisma-derived enums/types                                |
| `packages/validators` | Shared Zod validation schemas                                             |
| `packages/utils`      | Shared date and formatting utilities                                      |
| `supabase/migrations` | PostgreSQL schema policies, functions and RLS configuration               |

The domain model is documented in
[`docs/database.md`](./docs/database.md).

## Technology stack

- TypeScript
- pnpm workspaces
- Turborepo
- React 19 and Vite
- React Native, Expo and Expo Router
- NestJS
- Prisma
- PostgreSQL
- Supabase Auth and Row-Level Security
- Jest and Supertest
- ESLint and Prettier

## Requirements

- Node.js 22 or newer
- pnpm 9
- PostgreSQL/Supabase project
- Supabase project for authentication
- Expo development tooling for the mobile application

The repository declares pnpm and the minimum Node.js version in the root
[`package.json`](./package.json).

## Installation

Clone the repository and install all workspace dependencies:

```bash
git clone https://github.com/domek123/harcApp.git
cd harc
pnpm install
```

Generate the Prisma client before running the API:

```bash
pnpm --filter @harcapp/api prisma:generate
```

## Environment variables

### API

Create an environment file used by the API and Prisma:

```dotenv
DATABASE_URL=postgresql://user:password@host:5432/database
DIRECT_URL=postgresql://user:password@host:5432/database
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
PORT=3000
```

`DIRECT_URL` is used by Prisma CLI when available. The API runtime uses
`DATABASE_URL`.

The API requires `DATABASE_URL` to connect to PostgreSQL and requires
`SUPABASE_URL` plus either `SUPABASE_ANON_KEY` or
`SUPABASE_PUBLISHABLE_KEY` to initialize authentication.

### Web

The web application reads Vite variables from its environment:

```dotenv
VITE_API_URL=http://localhost:3000
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
```

### Mobile

The Expo application reads public variables prefixed with
`EXPO_PUBLIC_`:

```dotenv
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_KEY=your-supabase-publishable-key
```

Do not commit environment files or private keys. Public Supabase client keys
are intended for client applications, but database access must still be
protected by RLS policies.

## Running the applications

### API

Start the NestJS API in watch mode:

```bash
pnpm --filter @harcapp/api dev
```

The default API URL is `http://localhost:3000`.

The public health endpoint does not require authentication:

```bash
curl http://localhost:3000/health
```

Expected response when the API and database are available:

```json
{
  "status": "ok",
  "checks": {
    "database": "up"
  }
}
```

### Web

Start the Vite development server:

```bash
pnpm --filter @harcapp/web dev
```

The web application is typically available at `http://localhost:5173`.
This is also the origin currently allowed by the API CORS configuration.

### Mobile

Start Expo with the development client:

```bash
pnpm --filter @harcapp/mobile dev
```

For native platforms:

```bash
pnpm --filter @harcapp/mobile android
pnpm --filter @harcapp/mobile ios
```

The native Android and iOS toolchains must be installed separately.

### Run all development tasks

Turborepo can start all configured development tasks:

```bash
pnpm dev
```

For local development, running the API and the web/mobile application
separately is often easier because each application has different environment
variables and platform requirements.

## Quality checks

The root scripts provide the standard development commands:

```bash
pnpm lint
pnpm check-types
pnpm test
pnpm build
```

The current CI gate checks:

1. lint for the applications,
2. Prisma client generation,
3. type checking for the API and its dependencies,
4. API unit tests,
5. API build.

The API test suite can be run directly:

```bash
pnpm --filter @harcapp/api exec jest --runInBand
```

The suite includes unit tests for authorization guards, controllers,
services and the health check.

## Database and migrations

Prisma schema and migrations are located in
[`apps/api/prisma`](./apps/api/prisma). Supabase SQL migrations, including RLS
policies, are located in [`supabase/migrations`](./supabase/migrations).

Generate the Prisma client:

```bash
pnpm --filter @harcapp/api prisma:generate
```

Inspect the current database migration status:

```bash
pnpm --filter @harcapp/api exec prisma migrate status \
  --config prisma.config.ts
```

Read the full model description in
[`docs/database.md`](./docs/database.md) before changing relationships,
constraints or delete strategies.

## Error handling and authorization

The API uses:

- a global validation pipe with whitelisting and transformation,
- a global exception filter returning a consistent error shape,
- `requestId` values for correlating client responses with server logs,
- a global JWT guard backed by Supabase Auth,
- troop-level guards for member, staff and leader permissions,
- database-level RLS policies in Supabase.

Errors returned by the API include the HTTP status, timestamp, request path and
request ID. Internal exception details are logged by the API but are not
exposed in responses to clients.

## Continuous integration

The workflow in
[`.github/workflows/ci.yml`](./.github/workflows/ci.yml) runs on pushes to
`main`/`master` and on pull requests. It installs dependencies with the
frozen lockfile, generates Prisma Client, and runs lint, typecheck, tests and
the API build.

## Repository structure

```text
apps/
  api/                 NestJS API, Prisma schema and API tests
  mobile/              React Native + Expo application
  web/                 React + Vite application
packages/
  api-client/          Shared API client and query hooks
  eslint-config/       Shared ESLint configurations
  types/               Shared domain types and enums
  typescript-config/   Shared TypeScript configurations
  utils/               Shared utility functions
  validators/          Shared validation schemas
docs/
  database.md          Database model documentation
supabase/
  migrations/          Database functions and RLS policies
```

## Useful commands

```bash
# Install dependencies
pnpm install

# Start one application
pnpm --filter @harcapp/api dev
pnpm --filter @harcapp/web dev
pnpm --filter @harcapp/mobile dev

# Run quality checks
pnpm lint
pnpm check-types
pnpm test
pnpm build

# Format TypeScript and Markdown files
pnpm format
```
