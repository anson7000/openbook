# Cheat Sheet Generator

A full-stack web application for generating cheat sheets, built as a **pnpm + Turborepo monorepo** with a TypeScript Express API and a React (Vite + Tailwind CSS) frontend.

> ⚠️ **Status:** Early development — the project is currently scaffolded with a working API/frontend integration and shared tooling, ready for feature development.

## Tech Stack

| Layer    | Technology                                                        |
| -------- | ----------------------------------------------------------------- |
| Monorepo | [pnpm](https://pnpm.io) 11 · [Turborepo](https://turborepo.com) 2 |
| Frontend | [React](https://react.dev) 19 · [Vite](https://vite.dev) 8 · [Tailwind CSS](https://tailwindcss.com) 4 |
| Backend  | [Express](https://expressjs.com) 5 · [tsx](https://tsx.is) · [dotenv](https://github.com/motdotla/dotenv) |
| Language | TypeScript 6 (strict, ESM everywhere)                             |
| Quality  | ESLint 10 (flat config) · Prettier 3                              |

## Project Structure

```
cheat-sheet-generator/
├── apps/
│   ├── api/                        # Express REST API (@csg/api)
│   │   └── src/
│   │       ├── config/env.ts       # Environment variable loading
│   │       ├── middleware/         # CORS middleware
│   │       └── app.ts              # App entry point
│   └── web/                        # React frontend (@csg/web)
│       └── src/
│           ├── App.tsx             # Root component
│           └── main.tsx            # React entry point
├── packages/
│   ├── eslint-config/              # Shared ESLint presets (@csg/eslint-config)
│   │   ├── eslint.config.base.js
│   │   ├── eslint.config.express.js
│   │   └── eslint.config.react.js
│   └── typescript-config/          # Shared tsconfig presets (@csg/typescript-config)
│       ├── tsconfig.base.json
│       └── tsconfig.express.json
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

### Workspaces

| Package                    | Location                     | Description                                            |
| -------------------------- | ---------------------------- | ------------------------------------------------------ |
| `@csg/api`                 | `apps/api`                   | Express REST API (port 3000)                           |
| `@csg/web`                 | `apps/web`                   | React SPA served by Vite (port 5173)                   |
| `@csg/eslint-config`       | `packages/eslint-config`     | Shared ESLint flat configs: `base`, `express`, `react` |
| `@csg/typescript-config`   | `packages/typescript-config` | Shared `tsconfig` presets referenced by every app      |

## Getting Started

### Prerequisites

- **Node.js** ≥ 20.19 (22.13+ or 24+ also supported)
- **pnpm 11.10.0** — pinned via `devEngines` in the root `package.json`, so pnpm is downloaded automatically on first run

### 1. Install dependencies

```sh
pnpm install
```

### 2. Configure environment variables

Create the env files for the apps you plan to run:

**`apps/api/.env`**

```sh
PORT=3000
NODE_ENV=development
```

**`apps/web/.env`**

```sh
# Base URL of the API (no trailing slash)
VITE_API_URL=http://localhost:3000
```

### 3. Run the development servers

```sh
pnpm dev
```

This starts both apps concurrently via Turborepo:

- **Web:** http://localhost:5173
- **API:** http://localhost:3000

Open the web app and click **"Click me"** — it fetches `/api/data` from the API and displays the response.

## Available Scripts

All scripts are run from the repository root and are orchestrated by Turborepo:

| Script              | Description                                     |
| ------------------- | ----------------------------------------------- |
| `pnpm dev`          | Start all apps in watch/dev mode                |
| `pnpm build`        | Build all apps (outputs to each app's `dist/`)  |
| `pnpm lint`         | Lint all workspaces with ESLint                 |
| `pnpm check-types`  | Type-check all workspaces with `tsc --noEmit`   |
| `pnpm format`       | Format source files with Prettier               |
| `pnpm deploy-build` | Lint + build (used for deployment verification) |

Turborepo caches all of these tasks, so repeated runs only rebuild what changed.

## API Reference

Base URL: `http://localhost:3000` (development)

| Method | Endpoint    | Description          | Response                                   |
| ------ | ----------- | -------------------- | ------------------------------------------ |
| `GET`  | `/`         | Health check         | `"Hello World!"` (text)                    |
| `GET`  | `/api/data` | Sample data endpoint | `{ "message": "Hello from the API!" }`     |

### CORS

The API uses a CORS middleware that restricts allowed origins by environment (`NODE_ENV`):

| Environment   | Allowed origin                                 |
| ------------- | ---------------------------------------------- |
| `development` | `http://localhost:5173` (Vite dev server)      |
| `production`  | `https://cheat-sheet-generator-web.vercel.app` |

Allowed methods: `GET`, `POST`, `PUT`, `DELETE` · Allowed headers: `Content-Type`, `Authorization` · Credentials enabled.

## Environment Variables

### `@csg/api`

| Variable   | Required | Default       | Description                                                                            |
| ---------- | -------- | ------------- | -------------------------------------------------------------------------------------- |
| `PORT`     | No       | `3000`        | Port the API listens on                                                                |
| `NODE_ENV` | No       | `development` | Environment (`development` or `production`); also drives the CORS origin selection     |

Loaded automatically via `dotenv` from `apps/api/.env`.

### `@csg/web`

| Variable       | Required | Default | Description                                             |
| -------------- | -------- | ------- | ------------------------------------------------------- |
| `VITE_API_URL` | Yes      | —       | Base URL of the API, used by the frontend to fetch data |

Vite exposes variables prefixed with `VITE_` to client code via `import.meta.env`.

> ℹ️ Turborepo task hashing is configured to respect `PORT` and `NODE_ENV` (see `turbo.json`), so changing them correctly invalidates the cache.

## Code Style & Linting

- **ESLint flat config** is shared through `@csg/eslint-config`:
  - `@csg/eslint-config/base` — TypeScript + Prettier + Turbo env rules
  - `@csg/eslint-config/express` — base + Node globals (used by `apps/api`)
  - `@csg/eslint-config/react` — base + React plugin (used by `apps/web`)
- **TypeScript configs** are shared through `@csg/typescript-config` and extended in each app's `tsconfig.json`.
- **Prettier** handles formatting; `eslint-config-prettier` disables conflicting lint rules.

## Deployment

The frontend is deployed to **Vercel** at `https://cheat-sheet-generator-web.vercel.app`. Before deploying, verify the production build passes with:

```sh
pnpm deploy-build
```

When deploying the API to a new host, make sure to set `PORT` and `NODE_ENV=production`, and update the production CORS origin in `apps/api/src/middleware/cors.middleware.ts` if the frontend URL changes.