import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import turboPlugin from "eslint-plugin-turbo";
import { defineConfig, globalIgnores } from "eslint/config";

/** @type {import("eslint").Linter.Config[]} */
export default defineConfig([
  globalIgnores(["dist/**"]),
  eslintConfigPrettier,
  {
    plugins: {
      turbo: turboPlugin,
    },
    rules: {
      "turbo/no-undeclared-env-vars": "warn",
    },
  },
]);
