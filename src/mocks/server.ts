// MSW in Node (Jest): the same handlers, used by unit tests.
import { setupServer } from "msw/node";
import { handlers } from "./handlers";

export const server = setupServer(...handlers);
