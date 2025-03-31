import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { promises as fs } from 'fs';
import path from "path";


enum iflowExamples {
    simple_http_server_to_http = ""
};

const resourceDiscoverPath = path.resolve(__dirname, '../../../resources/Discover');

export const registerPackageDiscoverHandler = (server: McpServer) => {
    server.tool(
        "discover-packages",
        "Get information about Packages from discover center",
        async() => {
            return {
                content: [{
                    type: "text",
                    text: await fs.readFile(path.join(resourceDiscoverPath, "IntegrationPackages.json"), 'utf-8')
                }]
            }
        }
    );
};