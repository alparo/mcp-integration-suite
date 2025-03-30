import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { registerPackageHandlers } from "./packages";
import { registerIflowHandlers } from "./iflow";

export const registerAllHandlers = (server: McpServer) => {
  registerPackageHandlers(server);
  registerIflowHandlers(server);
};