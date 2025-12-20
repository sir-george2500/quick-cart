/** @type {import('jest').Config} */
module.exports = {
  // Use jsdom for DOM testing
  testEnvironment: "jsdom",

  // Setup files to run after jest is loaded
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],

  // Transform TypeScript and JSX files with babel
  transform: {
    "^.+\\.(ts|tsx|js|jsx)$": "babel-jest",
  },

  // Module file extensions
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],

  // Module name mapper for static assets and CSS
  moduleNameMapper: {
    // Handle CSS imports
    "\\.(css|scss|sass)$": "identity-obj-proxy",
    // Handle image imports
    "\\.(jpg|jpeg|png|gif|webp|svg)$": "<rootDir>/src/__mocks__/fileMock.ts",
    // Handle MSW node import
    "^msw/node$": "<rootDir>/node_modules/msw/lib/node/index.js",
  },

  // Test environment options for MSW
  testEnvironmentOptions: {
    customExportConditions: [""],
  },

  // Test patterns
  testMatch: ["**/__tests__/**/*.test.[jt]s?(x)"],

  // Ignore patterns
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],

  // Transform ESM packages from node_modules
  transformIgnorePatterns: [
    "/node_modules/(?!(@mui|@emotion|recharts|d3-.*|internmap|msw|@bundled-es-modules|@mswjs)/)",
  ],

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
};
