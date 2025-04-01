import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { z } from "zod";
import { createIflow, deployIflow, getIflowContentString, saveAsNewVersion, updateIflow } from "../../api/iflow";
import { logError, logInfo } from "../..";

export const updateIflowFiles = z.array(
	z.object({
		filepath: z
			.string()
			.describe(
				'filepath within project. E.g. "resources/scenarioflows/integrationflow/myiflow.iflw'
			),
		content: z.string().describe(`File content.`),
	})
);

export const registerIflowHandlers = (server: McpServer) => {
	server.tool(
		"get-iflow",
		`Get the data of an iflow and the contained ressources. 
Some ressources might relay on other package artefacts which are not included but reffrenced
`,
		{
			id: z.string().describe("ID of the IFLOW"),
		},
		async ({ id }) => {
			logInfo(`trying to get iflow ${id}`);
			try {
				const fileContent = await getIflowContentString(id);
				//const escapedFileContent = escapeDoublequotes(fileContent);
				
				return {
					content: [{ type: "text", text: JSON.stringify({type: "success", iflowContent: fileContent}) }],
				};
			} catch (error) {
				logError(error);
				return {
					content: [
						{
							type: "text",
							text: JSON.stringify({type: "error", error}),
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
				logError(error);
				return {
					content: [
						{
							type: "text",
							text: JSON.stringify({type: "error", error}),
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
You only have to provide files that need to be updated but allways send the full file
Make sure you ONLY change the things the user instructs you to and keep all other things
Folder structure is like this:
src/main/resources/ is the root
src/main/resources/mapping contains message mappings in format <mappingname>.mmap with xml structure
src/main/resources/xsd contains all xsd file in format <filename>.xsd
src/main/resources/scripts contains groovy and javascript scripts that can be used within iflow
src/main/resources/scenarioflows/integrationflow/<iflow id>.iflw contains the iflow in xml structure
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
			logInfo(`Updating iflow ${id} autodeploy: ${autoDeploy}`);


			try {
                await updateIflow(id, files);
                logInfo("Iflow updated successfully");
                if (autoDeploy) {
                    logInfo("auto deploy is activated");
					await saveAsNewVersion(id);
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
				logError(error);
				return {
					content: [
						{
							type: "text",
							text: `Error: Could not update`,
						},
					],
					isError: true,
				};
			}
		}
	);
};
