import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { z } from "zod";
import { createIflow, deployIflow, getIflow, updateIflow } from "../../api/iflow";
import { logInfo } from "../..";

export const updateIflowFiles = z.array(
	z.object({
		filepath: z
			.string()
			.describe(
				'filepath within project. E.g. "resources/scenarioflows/integrationflow/myiflow.iflw'
			),
		content: z.string().describe("File content"),
	})
);

export const registerIflowHandlers = (server: McpServer) => {
	server.tool(
		"get-iflow",
		"Get the data of an iflow and the contained ressources. Some ressources might relay on other package artefacts which are not included but reffrenced",
		{
			id: z.string().describe("ID of the IFLOW"),
		},
		async ({ id }) => {
			try {
				return {
					content: [{ type: "text", text: await getIflow(id) }],
				};
			} catch (error) {
				return {
					content: [
						{
							type: "text",
							text: `Error: ${error}`,
						},
					],
					isError: true,
				};
			}
		}
	);

	server.tool(
		"create-empty-iflow",
		`Create an empty iflow without functionality. You probably want to add content to it afterwards with tool get-iflow and then update-iflow`,
		{
			packageId: z.string().describe("Package ID"),
			id: z.string().describe("ID/Name of the Iflow"),
		},
		async ({ packageId, id }) => {
			try {
				await createIflow(packageId, id);
				return {
					content: [
						{
							type: "text",
							text: "IFlow successfully created. You can now use get-iflow and then edit it and upload with update-iflow",
						},
					],
				};
			} catch (error) {
				return {
					content: [
						{
							type: "text",
							text: `Error: ${error}`,
						},
					],
					isError: true,
				};
			}
		}
	);

	server.tool(
		"update-iflow",
		`Update or create files/content of an iflow
        Folder structure is like this:
        resources/ is the root
        resources/mapping contains message mappings in format <mappingname>.mmap with xml structure
        resources/scripts contains groovy and javascript scripts that can be used within iflow
        resources/scenarioflows/integrationflow/<iflow id>.iflw contains the iflow in xml structure
        `,
		{
			id: z.string().describe("ID of the IFLOW"),
			files: updateIflowFiles,
			autoDeploy: z
				.boolean()
				.describe(
					"True if iflow should be deployed after updateing, false if not"
				),
		},
		async ({ id, files, autoDeploy }) => {
			try {
                const result = await updateIflow(id, files);
                logInfo("Iflow updated successfully");
                if (autoDeploy) {
                    logInfo("auto deploy is activated");
                    await deployIflow(id);
                }

				return {
					content: [
						{
							type: "text",
							text: "IFlow successfully updated",
						},
					],
				};
			} catch (error) {
				return {
					content: [
						{
							type: "text",
							text: `Error: ${error}`,
						},
					],
					isError: true,
				};
			}
		}
	);
};
