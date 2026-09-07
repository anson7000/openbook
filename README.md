# Openbook

A monorepo for an open book / reference web application, built with [Turborepo](https://turbo.build/repo) and [pnpm](https://pnpm.io/).

## Structure

```
apps/
  api/    Express + TypeScript API server
  web/    React + Vite + Tailwind CSS web app
packages/
  eslint-config/      Shared ESLint configuration
  typescript-config/  Shared TypeScript configuration
```

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/)
- [pnpm](https://pnpm.io/installation) `11.10.0` (or higher)

### Install dependencies

```sh
pnpm install
```

### Run in development

```sh
pnpm dev
```

This starts both the API (http://localhost:3000) and the web app (http://localhost:5173) in watch mode.

## Available scripts

All scripts run across every workspace via Turborepo. Run them from the repo root.

| Script          | Description                        |
| --------------- | ---------------------------------- |
| `pnpm dev`      | Start the API and web dev servers  |
| `pnpm build`    | Build all packages and apps        |
| `pnpm lint`     | Lint all packages and apps         |
| `pnpm check-types` | Type-check all packages and apps |
| `pnpm format`   | Format source code with Prettier   |
| `pnpm deploy-build` | Run `lint` then `build`        |

## Environment variables

### API (`apps/api`)

| Variable    | Description                  | Default       |
| ----------- | ---------------------------- | ------------- |
| `PORT`      | Port the API listens on      | `3000`        |
| `NODE_ENV`  | Node environment             | `development` |

### Web (`apps/web`)

| Variable        | Description                          |
| --------------- | ------------------------------------ |
| `VITE_API_URL`  | Base URL of the API (e.g. `http://localhost:3000`) |

Web environment variables should be placed in an `apps/web/.env` file (for example: `VITE_API_URL=http://localhost:3000`).

## API

- `GET /` — returns `"Hello World!"`
- `GET /api/data` — returns a JSON message

The API enables CORS for the web app's development origin (`http://localhost:5173`).
