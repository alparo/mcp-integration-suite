import { integrationContent } from "../../generated/IntegrationContent/service";
import { extractToFolder, folderToZipBuffer, patchFile } from "../../utils/zip";
import { getCurrentDestionation, getOAuthToken } from "../api_destination";
import { updateIflowFiles } from "../../handlers/iflow/tools";

import { z } from "zod";
import semver from "semver";
import {
	deployIntegrationDesigntimeArtifact,
	integrationDesigntimeArtifactSaveAsVersion,
	ServiceEndpoints,
} from "../../generated/IntegrationContent";
import { logInfo } from "../..";
import { parseFolder } from "../../utils/fileBasedUtils";
import { getEndpointUrl } from "../../utils/getEndpointUrl";
const { integrationDesigntimeArtifactsApi, serviceEndpointsApi } =
	integrationContent();

export const getIflowFolder = async (id: string): Promise<string> => {
	const iflowUrl = await integrationDesigntimeArtifactsApi
		.requestBuilder()
		.getByKey(id, "active")
		.appendPath("/$value")
		.url(await getCurrentDestionation());

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
): Promise<string> => {
	const iflowPath = await getIflowFolder(id);

	for (const file of iflowFiles) {
		await patchFile(iflowPath, file.filepath, file.content),
			`Patch file ${file.filepath}`;
	}

	const iflowBuffer = await folderToZipBuffer(iflowPath);

	const currentIflow = await integrationDesigntimeArtifactsApi
		.requestBuilder()
		.getByKey(id, "active")
		.execute(await getCurrentDestionation());
	

	currentIflow.version = "active";

	const requestURI = await integrationDesigntimeArtifactsApi
		.requestBuilder()
		.update(currentIflow)
		.url(await getCurrentDestionation());

	logInfo(`Request URI: ${requestURI}`);

	const newIflowObj = {
		Name: id,
		ArtifactContent: iflowBuffer.toString("base64"),
	};

	const reqBody = JSON.stringify(newIflowObj);
	logInfo(reqBody);

	const authHeader = (await getOAuthToken()).http_header;

	// Use fetch instead of built in axios because it is trash
	const iflowResponse = await fetch(requestURI, {
		headers: {
			[authHeader.key]: authHeader.value,
			"Content-Type": "application/json",
		},
		body: reqBody,
		method: "PUT",
	});

	logInfo(iflowResponse.status);
	logInfo(iflowResponse.statusText);
	const respText = await iflowResponse.text();
	logInfo(respText);

	return `${iflowResponse.status} - ${await iflowResponse.text()} - ${respText}`;
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

export const getIflowContentString = async (id: string): Promise<string> => {
	const folderPath = await getIflowFolder(id);
	return parseFolder(folderPath);
};

export const getEndpoints = async (id?: string) => {
	let endpointRequest = serviceEndpointsApi.requestBuilder().getAll();

	if (id) {
		endpointRequest = endpointRequest.filter(
			serviceEndpointsApi.schema.NAME.equals(id)
		);
	}

	logInfo(
		`Requesting Endpoints on ${await endpointRequest.url(await getCurrentDestionation())}`
	);
	const endpoints = await endpointRequest.execute(
		await getCurrentDestionation()
	);
	const endpointsWithUrl: (ServiceEndpoints & { URL?: string })[] = endpoints;

	endpointsWithUrl.map((endpoint) => {
		endpoint.URL = getEndpointUrl(endpoint);
	});

	return endpoints;
};
