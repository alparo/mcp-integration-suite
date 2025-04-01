import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { registerPackageHandlers } from "./packages";
import { registerIflowHandlers } from "./iflow/tools";
import { registerPackageDiscoverHandler } from "./discover/packages";
import { registerIflowExampleHandler } from "./iflow/exmaples";
import { registerMessageHandlers } from "./messages";

export const registerAllHandlers = (server: McpServer) => {
	registerPackageHandlers(server);
	registerIflowHandlers(server);
	registerPackageDiscoverHandler(server);
	registerIflowExampleHandler(server);
	registerMessageHandlers(server);
};
