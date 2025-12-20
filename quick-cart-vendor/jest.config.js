/** @type {import('jest').Config} */
export default {
  // Use jsdom for DOM testing
  testEnvironment: "jsdom",

  // Setup files to run after jest is loaded
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],

  // Transform TypeScript files
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        useESM: true,
        // Use the app's tsconfig which includes vite-env.d.ts
        tsconfig: "<rootDir>/tsconfig.app.json",
      },
    ],
  },

  // Module file extensions
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],

  // Module name mapper for static assets and CSS
  moduleNameMapper: {
    // Handle CSS imports
    "\\.(css|scss|sass)$": "identity-obj-proxy",
    // Handle image imports
    "\\.(jpg|jpeg|png|gif|webp|svg)$": "<rootDir>/src/__mocks__/fileMock.ts",
  },

  // Test patterns
  testMatch: ["**/__tests__/**/*.test.[jt]s?(x)"],

  // Ignore patterns
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],

  // Coverage configuration
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/main.tsx",
    "!src/vite-env.d.ts",
    "!src/mocks/**",
    "!src/__mocks__/**",
    "!src/setupTests.ts",
  ],

  // Clear mocks between tests
  clearMocks: true,

  // ESM support
  extensionsToTreatAsEsm: [".ts", ".tsx"],

  // Inject jest globals for ESM compatibility
  injectGlobals: true,
};
