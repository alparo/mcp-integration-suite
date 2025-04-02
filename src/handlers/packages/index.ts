import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { createPackage, getPackage, getPackages } from "../../api/packages";

export const registerPackageHandlers = (server: McpServer) => {
	server.registerTool(
		"packages",
		"Get all integration packages",
		{},
		async () => {
			const allPackages = await getPackages();
			return {
				content: [{ type: "text", text: JSON.stringify(allPackages) }],
			};
		}
	);

	server.registerTool(
		"package",
		"Get Content of a integration package by name",
		{
			name: z.string().describe("Name/ID of the package"),
		},
		async ({ name }) => {
			const packageContent = await getPackage(name);
			return {
				content: [
					{ type: "text", text: JSON.stringify(packageContent) },
				],
			};
		}
	);

	server.registerTool(
		"create-package",
		"Create a new integration package",
		{
			id: z.string().describe("ID of the package"),
			name: z
				.string()
				.optional()
				.describe("Package Name (uses ID by default)"),
			shortText: z
				.string()
				.optional()
				.describe("Short text of the package"),
		},
		async ({ id, name, shortText }) => {
			const packageContent = await createPackage(id, name, shortText);
			return {
				content: [
					{ type: "text", text: JSON.stringify(packageContent) },
				],
			};
		}
	);
};
