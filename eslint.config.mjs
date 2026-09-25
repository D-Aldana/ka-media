import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

/** eslint-config-next 16 ships flat configs, so no FlatCompat wrapper. */
const eslintConfig = [
  ...coreWebVitals,
  ...typescript,
  {
    rules: {
      // New in eslint-config-next 16. The three hits are the SSR-safe
      // `matchMedia` read after mount, plus a reset on index change — all
      // deliberate. Warn until they can be reworked on their own.
      "react-hooks/set-state-in-effect": "warn",
    },
  },
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
];

export default eslintConfig;
