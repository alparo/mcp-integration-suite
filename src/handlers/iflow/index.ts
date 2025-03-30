import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { z } from 'zod';
import { getIflow } from "../../api/iflow";

export const registerIflowHandlers = (server: McpServer) => {
    server.tool(
        'get-iflow',
        'Get the data of an iflow and the contained ressources. Some ressources might relay on other package artefacts which are not included but reffrenced',
        {
            id: z.string().describe('ID of the IFLOW')
        },
        async ({ id }) => {
            return {content: [
                { type: "text", text: await getIflow(id) },
            ]}
        }
    )
}