// import globals from "globals";
// import pluginJs from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";

// export default [
//   {languageOptions: { globals: globals.browser }},
//   pluginJs.configs.recommended,
//   eslintConfigPrettier,
//   {
//         rules: {
//             "no-unused-vars": "warn",
//             "no-undef": "warn"
//         }
//     }
// ];


export default [
  {
    files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
    plugins: {
      prettier: eslintConfigPrettier,
    },
    extends: ["eslint:recommended", "plugin:prettier/recommended"],
    rules: {
      "prettier/prettier": "error",
      // Other ESLint rules can go here
      "no-unused-vars": "warn",
      "no-undef": "warn",
    },
    env: {
      node: true,
      browser: true,
      es2021: true,
    },
    parserOptions: {
      ecmaVersion: 12,
      sourceType: "module",
    },
  },
];
