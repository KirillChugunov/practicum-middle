import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import googleConfig from "eslint-config-google";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  {
    ignores: ["node_modules", "dist", "build", "src/assets", "src/shared/core/eventBus",  "src/shared/core/block"],
  },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ...googleConfig,
    rules: {
      "valid-jsdoc": "off", // Отключаем устаревшее правило
    },
  },
];
