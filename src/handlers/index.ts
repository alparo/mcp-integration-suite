
import { registerPackageHandlers } from "./packages";
import { registerIflowHandlers } from "./iflow/tools";
import { registerPackageDiscoverHandler } from "./discover/packages";
import { registerIflowExampleHandler } from "./iflow/exmaples";
import { registerMessageHandlers } from "./messages";
import { McpServerWithMiddleware } from "../utils/middleware";

export const registerAllHandlers = (server: McpServerWithMiddleware) => {
	registerPackageHandlers(server);
	registerIflowHandlers(server);
	registerPackageDiscoverHandler(server);
	registerIflowExampleHandler(server);
	registerMessageHandlers(server);
};
