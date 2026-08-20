module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "scope-enum": [
      2,
      "always",
      [
        "api", // apps/api
        "web", // apps/web / apps/web-react
        "mobile", // apps/mobile
        "types", // packages/types
        "validators", // packages/validators
        "deps", // Aktualizacje zależności
        "release",
      ],
    ],
    "scope-case": [2, "always", "kebab-case"],
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "chore",
        "docs",
        "style",
        "refactor",
        "perf",
        "test",
        "revert",
      ],
    ],
  },
};
