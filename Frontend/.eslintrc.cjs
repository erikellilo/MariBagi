module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parser: "@typescript-eslint/parser", // Use TS parser
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: ["./tsconfig.json"], // Point to your tsconfig
  },
  plugins: ["react-refresh", "@typescript-eslint"],
  rules: {
    // ✅ Core ESLint rules
    "prefer-const": "warn",
    "no-unused-vars": "off", // disabled in favor of TS version

    // ✅ TypeScript-specific rules
    "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    "@typescript-eslint/explicit-function-return-type": "error",
    "@typescript-eslint/explicit-module-boundary-types": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-non-null-assertion": "warn",
    "@typescript-eslint/no-inferrable-types": "off", // allow cleaner syntax
    "@typescript-eslint/no-var-requires": "error",
    "@typescript-eslint/ban-ts-comment": "warn",
    "@typescript-eslint/no-empty-function": "warn",
    "@typescript-eslint/no-unnecessary-type-assertion": "error",
    "@typescript-eslint/strict-boolean-expressions": "warn",
    "@typescript-eslint/prefer-nullish-coalescing": "error",
    "@typescript-eslint/prefer-optional-chain": "error",
    "@typescript-eslint/no-floating-promises": "error",
    "@typescript-eslint/consistent-type-imports": "warn", // 💡 enforces `import type`

    // ✅ React rules
    "react/react-in-jsx-scope": "off", // not needed in React 17+
    "react/jsx-uses-react": "off", // same as above
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
    "react/prop-types": "off", // not needed with TypeScript
    "react/jsx-pascal-case": "error",
    "react/jsx-no-undef": "error",
    "react/jsx-uses-vars": "error",
    "react/no-unused-state": "warn",
    "react/jsx-key": "error",
    "react/jsx-no-duplicate-props": "error",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
