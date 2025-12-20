import "@testing-library/jest-dom";

// Mock ResizeObserver for Recharts ResponsiveContainer
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock TextEncoder/TextDecoder for any modules that need them
global.TextEncoder = require("util").TextEncoder;
global.TextDecoder = require("util").TextDecoder;
