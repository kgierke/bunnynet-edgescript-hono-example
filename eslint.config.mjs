import configHono from "@hono/eslint-config";
import configPrettier from "eslint-config-prettier";

export default [
  ...configHono,
  configPrettier,
  {
    ignores: ["node_modules", "dist", "_infrastructure"],
  },
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];
