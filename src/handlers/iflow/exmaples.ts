
import { z } from "zod";
import { parseFolder } from "../../utils/fileBasedUtils";
import { availableExamples } from "../../api/iflow/examples";
import { McpServerWithMiddleware } from "../../utils/middleware";

export const registerIflowExampleHandler = (server: McpServerWithMiddleware) => {
	server.resource(
		"List of available iflow examples. Use them with get-iflow-example",
		"cpi://iflow/examples",
		async(uri) => {
			return {
				contents: [
					{
						uri: uri.href,
						text: JSON.stringify(availableExamples),
					},
				],
			};
		}
	);

	server.registerTool(
		"get-iflow-example",
		`
Get an existing iflow as an example to use to create or update other iflows
Call list-iflow-examples to show available examples
        `,
		{
			name: z
				.enum(Object.keys(availableExamples) as [string, ...string[]])
				.describe("Example name from list-iflow-examples"),
		},
		async ({ name }) => {
			const exampleObj = availableExamples[name];

			if (!exampleObj) {
				return {
					content: [
						{
							type: "text",
							text: "Unknown example, please use list-iflow-examples",
						},
					],
					isError: true,
				};
			}

			try {
				return {
					content: [
						{
							type: "text",
							text: await parseFolder(exampleObj._path),
						},
					],
				};
			} catch (error) {
				return {
					content: [
						{
							type: "text",
							text: "Error getting provided example",
						},
					],
					isError: true,
				};
			}
		}
	);
};
