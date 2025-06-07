
import path from "path";
import { z } from "zod";
import { parseFolder } from "../../utils/fileBasedUtils";
import { projPath } from "../..";
import { availableExamples } from "../../api/iflow/examples";
import { MiddlewareManager, registerToolWithMiddleware } from "../../utils/middleware";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export const registerIflowExampleHandler = (server: McpServer, middleware: MiddlewareManager) => {
        registerToolWithMiddleware(
                server,
                middleware,
                "list-iflow-examples",
                `Get a list of available iflow examples.
You can use these examples to query get-iflow-example`,
                {},
                async () => {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(availableExamples),
          },
        ],
      };
  }
        );

        registerToolWithMiddleware(
                server,
                middleware,
                "get-iflow-example",
                `Get an existing iflow as an example to use to create or update other iflows
Call list-iflow-examples to show available examples`,
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
