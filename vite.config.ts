import { defineConfig, lazyPlugins } from "vite-plus"
import react from "@vitejs/plugin-react"
import { cloudflare } from "@cloudflare/vite-plugin"

export default defineConfig({
  fmt: {
    // Only src/ is formatted: ignore everything at the root except src
    ignorePatterns: ["/*", "!/src"],
    printWidth: 120,
    semi: false,
    sortImports: { newlinesBetween: false },
  },
  lint: {
    // Only src/ is linted: ignore everything at the root except src
    ignorePatterns: ["/*", "!/src"],
    plugins: ["typescript", "unicorn", "oxc", "react", "jsx-a11y"],
    categories: { correctness: "error" },
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
    rules: {
      "vite-plus/prefer-vite-plus-imports": "error",
      "typescript/no-explicit-any": "error", // suspicious/noExplicitAny
      "react/exhaustive-deps": "error", // correctness/useExhaustiveDependencies
      "react/rules-of-hooks": "error", // correctness/useHookAtTopLevel
      "jsx-a11y/no-noninteractive-tabindex": "error", // a11y/noNoninteractiveTabindex
      "typescript/no-non-null-assertion": "error", // style/noNonNullAssertion
      // Biome ignores unused variables and parameters prefixed with an underscore
      "no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      // The project uses the automatic JSX runtime
      "react/react-in-jsx-scope": "off",
      "jsx-a11y/control-has-associated-label": "off",
      "react/purity": "off",
      "react/set-state-in-effect": "off",
      "typescript/no-floating-promises": "off",
      "typescript/restrict-template-expressions": "off",
      "typescript/await-thenable": "off",
    },
    options: { typeAware: true, typeCheck: true },
  },
  test: {
    globals: true,
    environment: "node",
  },
  // The Cloudflare plugin rejects Vitest's Worker environment options, so skip
  // the app plugins when running tests.
  plugins: process.env.VITEST ? [] : lazyPlugins(() => [react(), cloudflare()]),
})
