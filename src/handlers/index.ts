import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { registerPackageHandlers } from "./packages";

export const registerAllHandlers = (server: McpServer) => {
  registerPackageHandlers(server);
};