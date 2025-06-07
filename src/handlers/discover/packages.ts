
import { promises as fs } from "fs";
import path from "path";
import { projPath } from "../..";
import { MiddlewareManager, registerToolWithMiddleware } from "../../utils/middleware";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

const resourceDiscoverPath = path.resolve(projPath, "./resources/Discover");

export const registerPackageDiscoverHandler = (server: McpServer, middleware: MiddlewareManager) => {
        registerToolWithMiddleware(
                server,
                middleware,
                "discover-packages",
                "Get information about Packages from discover center",
        {},
		async () => {
			return {
				content: [
					{
						type: "text",
						text: await fs.readFile(
							path.join(
								resourceDiscoverPath,
								"IntegrationPackages.json"
							),
							"utf-8"
						),
					},
				],
			};
		}
	);
};
