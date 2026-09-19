import baseConfig from "./eslint.config.base.js";
import js from "@eslint/js";
import globals from "globals";
import eslintReact from "@eslint-react/eslint-plugin";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

/** @type {import("eslint").Linter.Config[]} */
export default defineConfig([
  ...baseConfig,
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    ignores: ["routeTree.gen.ts"],
    plugins: { js },
    extends: [js.configs.recommended, tseslint.configs.recommended],
    languageOptions: { globals: { ...globals.browser } },
  },
  eslintReact.configs.recommended,
]);
