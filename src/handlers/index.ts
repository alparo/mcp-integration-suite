
import { registerPackageHandlers } from "./packages";
import { registerIflowHandlers } from "./iflow/tools";
import { registerPackageDiscoverHandler } from "./discover/packages";
import { registerIflowExampleHandler } from "./iflow/examples";
import { registerMessageHandlers } from "./messages";
import { MiddlewareManager } from "../utils/middleware";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { logError, logInfo } from "..";
import { registerMappingsHandler } from "./mappings";
import { registerMappingsExampleHandler } from "./mappings/examples";

const registerDefaultMiddleware = (middleware: MiddlewareManager) => {
        middleware.use(async (next, name, params) => {
                logInfo(`executing ${name} with ${JSON.stringify(params)}`);
                const startTime = performance.now();

                await next();

                logInfo(`${name} executed in ${performance.now() - startTime}ms`);
        });
};


export const registerAllHandlers = (server: McpServer, middleware: MiddlewareManager) => {
        registerDefaultMiddleware(middleware);
        registerPackageHandlers(server, middleware);
        registerIflowHandlers(server, middleware);
        registerPackageDiscoverHandler(server, middleware);
        registerIflowExampleHandler(server, middleware);
        registerMessageHandlers(server, middleware);
        registerMappingsHandler(server, middleware);
        registerMappingsExampleHandler(server, middleware);
};

