import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import path from "path";
import { z } from "zod";
import { parseFolder } from "../../utils/fileBasedUtils";
import { projPath } from "../..";

const basePath = path.resolve(projPath, "./resources/examples/iflows/");

const availableExamples: {
	[name: string]: { description: string; _path: string };
} = {
	simple_http_srv_to_http: {
		description: `
This Iflow accepts HTTPS requests on <CPI address>/http_endpoint
It uses User Role authentication
Max Body Size is 40MB for a request

It has no mapping functionality and so on

It sends received data to http://targetaddr/dataupload
With a POST request without authentication
        `,
		_path: path.join(basePath, "if_http_server_to_http_request"),
	},
	replicate_product_inventory_info: {
		description: `
The purpose of this IFLOW is to Replicate Product Inventory Information from SAP to 3rd party
This IFLOW takes an LOISTD from a SAP system as input
It then saves the application ID into the IDOC using a Content Modifier
The IDOC gets converted using a Message Mapping. The source structure is the IDOC
The Target structure is more of a placeholder for the acutal 3rd party system
After the mapping the XML gets converted into JSON using a standard module
Because there is one unneccesary root element left a groovy script removes this with the function processData
Afterwards another groovy script is running which fixes some JSON conversion issues
Then a content modifier wraps the whole message in an array
Before the request to the target system is made, a Request/Reply module is used to collect the response into a log
Then the request gets executed via HTTP using OAUTH2 Authentication and request method PUT
The response is then redirected by the Request/Reply module to a groovy script which logs the HTTP response        
`,
		_path: path.join(basePath, "Replicate_product_inventory_info"),
	},
};

export const registerIflowExampleHandler = (server: McpServer) => {
	server.tool(
		"list-iflow-examples",
		`
Get a list of available iflow examples.
You can use these examples to query get-iflow-example
        `,
		() => {
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

	server.tool(
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
