import { setupServer } from "msw/node";
import { handlers } from "./handlers";

/**
 * MSW server instance for testing
 * This intercepts HTTP requests and returns mocked responses
 */
export const server = setupServer(...handlers);
