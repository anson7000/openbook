# Openbook

A monorepo for an open book / reference web application, built with [Turborepo](https://turbo.build/repo) and [pnpm](https://pnpm.io/).

## Structure

```
apps/
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
