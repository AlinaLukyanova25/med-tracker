const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");
const prettierConfig = require("eslint-config-prettier");

module.exports = tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  prettierConfig,
  {
    files: ["**/*.ts"],
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": ["error", {
        varsIgnorePattern: "^_",
      }],
    },
  },
  {
    ignores: [
      "dist/**",
      "node_modules/**",
      "eslint.config.cjs",
      "vite.config.ts",
    ],
  }
);
