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
	const messagemappingUrl = await messageMappingDesigntimeArtifactsApi
		.requestBuilder()
		.getByKey(id, "active")
		.appendPath("/$value")
		.url(await getCurrentDestionation());

	const authHeader = (await getOAuthToken()).http_header;

	// Use fetch instead of built in axios because it is trash
	const messagemappingResponse = await fetch(messagemappingUrl, {
		headers: { [authHeader.key]: authHeader.value },
	});

	if (messagemappingResponse.status !== 200) {
		throw new Error("Error while downloading messagemapping ZIP");
	}
	const arrBuffer = await messagemappingResponse.arrayBuffer();

	const buf = Buffer.from(arrBuffer);
	return extractToFolder(buf, id);
};

export const updateMessageMapping = async (
	id: string,
	messagemappingFiles: z.infer<typeof updateFiles>
): Promise<string> => {
	const messagemappingPath = await getMessageMappingFolder(id);

	for (const file of messagemappingFiles) {
		await patchFile(messagemappingPath, file.filepath, file.content);
	}

	const messagemappingBuffer = await folderToZipBuffer(messagemappingPath);

	const currentMessageMapping = await messageMappingDesigntimeArtifactsApi
		.requestBuilder()
		.getByKey(id, "active")
		.execute(await getCurrentDestionation());

	currentMessageMapping.version = "active";

	const requestURI = await messageMappingDesigntimeArtifactsApi
		.requestBuilder()
		.update(currentMessageMapping)
		.url(await getCurrentDestionation());

	logInfo(`Request URI: ${requestURI}`);

	const newMessageMappingObj = {
		Name: id,
		ArtifactContent: messagemappingBuffer.toString("base64"),
	};

	const reqBody = JSON.stringify(newMessageMappingObj);
	logInfo(reqBody);

	const authHeader = (await getOAuthToken()).http_header;

	// Use fetch instead of built in axios because it is trash
	const messagemappingResponse = await fetch(requestURI, {
		headers: {
			[authHeader.key]: authHeader.value,
			"Content-Type": "application/json",
		},
		body: reqBody,
		method: "PUT",
	});

	logInfo(messagemappingResponse.status);
	logInfo(messagemappingResponse.statusText);
	const respText = await messagemappingResponse.text();
	logInfo(respText);

	return `${messagemappingResponse.status} - ${await messagemappingResponse.text()} - ${respText}`;
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
