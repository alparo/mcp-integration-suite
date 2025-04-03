import { logInfo } from "../..";
import {
	deployMessageMappingDesigntimeArtifact,
	integrationContent,
	messageMappingDesigntimeArtifactSaveAsVersion,
} from "../../generated/IntegrationContent";
import { updateFiles } from "../../handlers/iflow/tools";
import { parseFolder, patchFile } from "../../utils/fileBasedUtils";
import { extractToFolder, folderToZipBuffer } from "../../utils/zip";
import { getCurrentDestionation, getOAuthToken } from "../api_destination";
import { z } from "zod";
import semver from "semver";

const { messageMappingDesigntimeArtifactsApi } = integrationContent();

export const getMessageMappingContentString = async (
	id: string
): Promise<string> => {
	const folderPath = await getMessageMappingFolder(id);
	return parseFolder(folderPath);
};

export const getMessageMappingFolder = async (id: string): Promise<string> => {
	const arrBuffer = await messageMappingDesigntimeArtifactsApi
		.requestBuilder()
		.getByKey(id, "active")
		.appendPath("/$value")
		.addCustomRequestConfiguration({ responseType: "arraybuffer" })
		.executeRaw(await getCurrentDestionation());

	const buf = Buffer.from(arrBuffer.data);
	return extractToFolder(buf, id);
};

export const updateMessageMapping = async (
	id: string,
	messagemappingFiles: z.infer<typeof updateFiles>
) => {
	const messagemappingPath = await getMessageMappingFolder(id);

	for (const file of messagemappingFiles) {
		await patchFile(messagemappingPath, file.filepath, file.content);
	}

	const messagemappingBuffer = await folderToZipBuffer(messagemappingPath);

	const currentMessageMapping = await messageMappingDesigntimeArtifactsApi
		.requestBuilder()
		.getByKey(id, "active")
		.execute(await getCurrentDestionation());

	currentMessageMapping.artifactContent =
		messagemappingBuffer.toString("base64");

	await messageMappingDesigntimeArtifactsApi
		.requestBuilder()
		.update(currentMessageMapping)
		.replaceWholeEntityWithPut()
		.executeRaw(await getCurrentDestionation());

	return {
		messageMappingUpdate: {
			status: 200,
			text: "successfully updated",
		},
	};
};

export const saveAsNewVersion = async (id: string) => {
	const currentMessageMapping = await messageMappingDesigntimeArtifactsApi
		.requestBuilder()
		.getByKey(id, "active")
		.execute(await getCurrentDestionation());

	const newVersion = semver.inc(currentMessageMapping.version, "patch");

	if (!newVersion) {
		throw new Error("Error increasing semantic version");
	}

	logInfo(
		`Increasing messagemapping ${id} from version ${currentMessageMapping.version} to ${newVersion}`
	);

	await messageMappingDesigntimeArtifactSaveAsVersion({
		id,
		saveAsVersion: newVersion,
	}).execute(await getCurrentDestionation());
};

/**
 * Deploy Mapping
 * @param Mapping ID
 * @returns Deployment Task ID
 */
export const deployMapping = async (id: string): Promise<string> => {
	const deployRes = await deployMessageMappingDesigntimeArtifact({
		id,
		version: "active",
	}).executeRaw(await getCurrentDestionation());

	if (deployRes.status !== 202) {
		throw new Error("Error starting deployment of " + id);
	}

	// Actually SAP API is broken, it returns an empty body instead of the taskId, so waiting for deployment isn't possible
	if (deployRes.data) {
		throw new Error(`The deployment was triggered successfully altough didn't return a token to wait for the deployment to finish
		But you can still use get-deploy-error to check the status`);
	}
	logInfo(`got TaskId ${deployRes.data} for deployment of ${id}`);
	return deployRes.data;
};
