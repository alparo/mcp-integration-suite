import { integrationContent } from "../../generated/IntegrationContent/service";
import { extractToFolder, folderToZipBuffer, patchFile } from "../../utils/zip";
import { getCurrentDestionation, getOAuthToken } from "../destination";
import { updateIflowFiles } from "../../handlers/iflow/tools";

import { z } from "zod";
import semver from "semver";
import {
	deployIntegrationDesigntimeArtifact,
	integrationDesigntimeArtifactSaveAsVersion,
} from "../../generated/IntegrationContent";
import { logInfo } from "../..";
import { logExecutionTimeOfAsyncFunc } from "../../utils/performanceTrace";
import { writeFileSync } from "fs";
import { parseFolder } from "../../utils/fileBasedUtils";
const { integrationDesigntimeArtifactsApi } = integrationContent();


const getIflowFolder = async (id: string): Promise<string> => {
	const iflowUrl = await logExecutionTimeOfAsyncFunc(
		integrationDesigntimeArtifactsApi
			.requestBuilder()
			.getByKey(id, "active")
			.appendPath("/$value")
			.url(await getCurrentDestionation()),
		"get Iflow zip"
	);

	const authHeader = (await getOAuthToken()).http_header;

	// Use fetch instead of built in axios because it is trash
	const iflowResponse = await fetch(iflowUrl, {
		headers: { [authHeader.key]: authHeader.value },
	});

	if (iflowResponse.status !== 200) {
		throw new Error("Error while downloading iflow ZIP");
	}
	const arrBuffer = await iflowResponse.arrayBuffer();

	const buf = Buffer.from(arrBuffer);
	return extractToFolder(buf, id);
};

export const createIflow = async (
	packageId: string,
	id: string
): Promise<void> => {
	const newIflow = integrationDesigntimeArtifactsApi
		.entityBuilder()
		.fromJson({
			id,
			name: id,
			packageId,
		});

	await integrationDesigntimeArtifactsApi
		.requestBuilder()
		.create(newIflow)
		.execute(await getCurrentDestionation());
};

export const updateIflow = async (
	id: string,
	iflowFiles: z.infer<typeof updateIflowFiles>
) => {
	const iflowPath = await getIflowFolder(id);

	for (const file of iflowFiles) {
		await logExecutionTimeOfAsyncFunc(
			patchFile(file.filepath, file.content),
			`Patch file ${file.filepath}`
		);
	}

	const iflowBuffer = folderToZipBuffer(iflowPath);

	const currentIflow = await logExecutionTimeOfAsyncFunc(
		integrationDesigntimeArtifactsApi
			.requestBuilder()
			.getByKey(id, "active")
			.execute(await getCurrentDestionation()),
		"get current iflow"
	);

	currentIflow.version = "active";

	const requestURI = await integrationDesigntimeArtifactsApi
		.requestBuilder()
		.update(currentIflow)
		.url(await getCurrentDestionation());

	

	logInfo(`Request URI: ${requestURI}`);

	writeFileSync('/Users/1nbuc/devshit/mcp-integration-suite/debug.zip', iflowBuffer);

	const newIflowObj = {
		Name: id,
		ArtifactContent: iflowBuffer.toString('base64')
	};

	const reqBody = JSON.stringify(newIflowObj);
	logInfo(reqBody);

	const authHeader = (await getOAuthToken()).http_header;

	// Use fetch instead of built in axios because it is trash
	const iflowResponse = await fetch(requestURI, {
		headers: { [authHeader.key]: authHeader.value,
			"Content-Type": "application/json"
		 },
		body: reqBody,
		method: 'PUT',
		
	});

	logInfo(iflowResponse.status);
	logInfo(iflowResponse.statusText);
	logInfo(await iflowResponse.text());
};

export const saveAsNewVersion = async (id: string) => {
	const currentIflow = await integrationDesigntimeArtifactsApi
		.requestBuilder()
		.getByKey(id, "active")
		.execute(await getCurrentDestionation());

	const newVersion = semver.inc(currentIflow.version, "patch");

	if (!newVersion) {
		throw new Error("Error increasing semantic version");
	}

	logInfo(
		`Increasing iflow ${id} from version ${currentIflow.version} to ${newVersion}`
	);

	await integrationDesigntimeArtifactSaveAsVersion({
		id,
		saveAsVersion: newVersion,
	}).execute(await getCurrentDestionation());
};

export const deployIflow = async (id: string) => {
	await deployIntegrationDesigntimeArtifact({
		id,
		version: "active",
	}).execute(await getCurrentDestionation());
};

export const getIflowContentString = async(id: string): Promise<string> => {
	const folderPath = await getIflowFolder(id);
	return parseFolder(folderPath);	
}
