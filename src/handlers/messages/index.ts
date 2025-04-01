import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { z } from "zod";
import { sendRequestSchema } from "./types";
import { sendRequestToCPI } from "../../api/messages";

export const registerMessageHandlers = (server: McpServer) => {
	server.tool(
		"send-http-message",
		`
send an HTTP request to integration suite.
If you need to get HTTP Endpoints please use get-iflow-endpoints
Please only provide HTTP Path without endpoint etc if the URL is https://abc123.itcpi01-rt-cfapps.aa11.hana.ondemand.com/http/myendpoint You should send /http/myendpoint
        `,
		sendRequestSchema,
		async ({ path, method, contentType, body, headers }) => {
			try {
				const requestResult = await sendRequestToCPI(
					path,
					method,
					contentType,
					body,
					headers
				);

				return {
					content: [
						{
							type: "text",
							text: JSON.stringify(requestResult),
						},
					],
				};
			} catch (error) {
				return {
					content: [
						{
							type: "text",
							text:
								"Error executing request: " +
								JSON.stringify(error),
						},
					],
					isError: true,
				};
			}
		}
	);
};
