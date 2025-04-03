import { logError, logInfo } from "../..";
import { deployMapping, getMessageMappingContentString, saveAsNewVersion, updateMessageMapping } from "../../api/mappings";
import { McpServerWithMiddleware } from "../../utils/middleware";
import { z } from "zod";
import { updateFiles } from "../iflow/tools";
import { waitAndGetDeployStatus } from "../../api/deployment";

export const registerMappingsHandler = (server: McpServerWithMiddleware) => {
	server.registerTool(
		"get-messagemapping",
		`Get the data of an Message Mapping and the contained ressources. 
    Some ressources might relay on other package artefacts which are not included but reffrenced
    `,
		{
			id: z.string().describe("ID of the Message Mapping"),
		},
		async ({ id }) => {
			logInfo(`trying to get message mapping ${id}`);
			try {
				const fileContent = await getMessageMappingContentString(id);

				return {
					content: [
						{
							type: "text",
							text: JSON.stringify({
								type: "success",
								iflowContent: fileContent,
							}),
						},
					],
				};
			} catch (error) {
				logError(error);
				return {
					content: [
						{
							type: "text",
							text: JSON.stringify({ type: "error", error }),
						},
					],
					isError: true,
				};
			}
		}
	);

        server.registerTool(
            "update-message mapping",
            `Update or create files/content of an message mapping
    You only have to provide files that need to be updated but allways send the full file
    Make sure you ONLY change the things the user instructs you to and keep all other things
    Folder structure is like this:
    src/main/resources/ is the root
    src/main/resources/mapping contains message mappings in format <mappingname>.mmap with xml structure
    src/main/resources/xsd contains all xsd file in format <filename>.xsd
    src/main/resources/scripts contains groovy and javascript scripts that can be used within message mapping
    src/main/resources/mapping/<message mapping id>.mmap contains the mapping in xml structure
            `,
            {
                id: z.string().describe("ID of the messageMapping"),
                files: updateFiles,
                autoDeploy: z
                    .boolean()
                    .describe(
                        "True if messageMapping should be deployed after updateing, false if not"
                    ),
            },
            async ({ id, files, autoDeploy }) => {
                logInfo(`Updating messageMapping ${id} autodeploy: ${autoDeploy}`);
    
                try {
                    const result = await updateMessageMapping(id, files);
                    logInfo("messageMapping updated successfully");
                    if (autoDeploy) {
                        logInfo("auto deploy is activated");
                        await saveAsNewVersion(id);
                        await deployMapping(id);
                    }
    
                    return {
                        content: [
                            {
                                type: "text",
                                text: JSON.stringify({
                                    type: "server response",
                                    content: result,
                                }),
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

            server.registerTool(
                "deploy-message-mapping",
                `
        deploy a message-mapping
        If the deployment status is unsuccessful try getting information from get-deploy-error
                `,
                { mappingId: z.string().describe("ID/Name of message-mapping") },
        
                async ({ mappingId }) => {
                    try {
                        const taskId = await deployMapping(mappingId);
                        const deployStatus = await waitAndGetDeployStatus(taskId);
                        return {
                            content: [
                                {
                                    type: "text",
                                    text: JSON.stringify({ deployStatus }),
                                },
                            ],
                        };
                    } catch (error) {
                        return {
                            content: [
                                {
                                    type: "text",
                                    text: JSON.stringify({ error }),
                                },
                            ],
                            isError: true,
                        };
                    }
                }
            );
};
