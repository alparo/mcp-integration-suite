import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { z } from "zod";
import { messageFilterSchema, sendRequestSchema } from "./types";
import { getMessages, sendRequestToCPI } from "../../api/messages";
import { readFileSync } from "fs";
import { projPath } from "../..";
import path from "path";
import { McpServerWithMiddleware } from "../../utils/middleware";
import { formatError } from "../../utils/customErrHandler";

export const registerMessageHandlers = (server: McpServerWithMiddleware) => {
	server.registerTool(
		"send-http-message",
		`
send an HTTP request to integration suite.
If you need to get HTTP Endpoints please use get-iflow-endpoints
Please only provide HTTP Path without endpoint etc if the URL is https://abc123.itcpi01-rt-cfapps.aa11.hana.ondemand.com/http/myendpoint You should send /http/myendpoint

If not specified otherwise the user probably wants to see the text in response
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
					isError: true,
					content: [formatError(error)],
				};
			}
		}
	);

	server.registerTool(
		"get-messages",
		`
Get message processing logs
This will include information about errors, attachements etc.
		`,
		{
			filterProps: messageFilterSchema,
		},
		async ({ filterProps }) => {
			try {
				const messages = await getMessages(filterProps);
				return {
					content: [
						{
							type: "text",
							text: JSON.stringify({ messages }),
						},
					],
				};
			} catch (error) {
				return {
					isError: true,
					content: [formatError(error)],
				};
			}
		}
	);
};
