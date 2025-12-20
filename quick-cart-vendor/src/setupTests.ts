import "@testing-library/jest-dom";
import { jest } from "@jest/globals";

// Make jest available globally for ESM
(globalThis as unknown as { jest: typeof jest }).jest = jest;
