import { integrationContent } from "../../generated/IntegrationContent/service";
import { getUnzipperInstance, parseZip, patchFile } from "../../utils/zip";
import { getCurrentDestionation, getOAuthToken } from "../destination";
import { updateIflowFiles } from "../../handlers/iflow/tools";
import unzipper from "unzipper";
import yazl from "yazl";
import { z } from "zod";
import semver from "semver";
import {
	DeployIntegrationAdapterDesigntimeArtifactParameters,
	deployIntegrationDesigntimeArtifact,
	integrationDesigntimeArtifactSaveAsVersion,
} from "../../generated/IntegrationContent";
import { logInfo } from "../..";
import { logExecutionTimeOfAsyncFunc } from "../../utils/performanceTrace";
const {
	integrationDesigntimeArtifactsApi,
} = integrationContent();

const unzipperToYazl = async (
	unzipper: unzipper.CentralDirectory
): Promise<yazl.ZipFile> => {
	const zip = new yazl.ZipFile();

	for (const file of unzipper.files) {
		const buffer = await file.buffer();
		zip.addBuffer(buffer, file.path);
	}

	return zip;
};

const getIflowZip = async (id: string): Promise<unzipper.CentralDirectory> => {
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
	return getUnzipperInstance(buf);
};

export const getIflow = async (id: string): Promise<string> => {
	const unzipperInstance = await getIflowZip(id);
	return parseZip(unzipperInstance);
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

const yazlToBuf = async (
	yazlZip: yazl.ZipFile
): Promise<Buffer<ArrayBufferLike>> => {
	return new Promise((resolve, reject) => {
		const chunks: Uint8Array[] = [];

		yazlZip.outputStream.on("data", (chunk) => chunks.push(chunk));
		yazlZip.outputStream.on("end", () => resolve(Buffer.concat(chunks)));
		yazlZip.outputStream.on("error", reject);
		yazlZip.end();
	});
};

export const updateIflow = async (
	id: string,
	iflowFiles: z.infer<typeof updateIflowFiles>
) => {
	const unzipperInstance = await logExecutionTimeOfAsyncFunc(
		getIflowZip(id),
		"get iflow zip"
	);
	const yazlZip = await logExecutionTimeOfAsyncFunc(
		unzipperToYazl(unzipperInstance),
		"unzipper to yazl"
	);

	for (const file of iflowFiles) {
		await logExecutionTimeOfAsyncFunc(
			patchFile(yazlZip, file.filepath, file.content),
			`Patch file ${file.filepath}`
		);
	}

	const iflowBuffer = await logExecutionTimeOfAsyncFunc(
		yazlToBuf(yazlZip),
		"yazl to buf"
	);

	const currentIflow = await logExecutionTimeOfAsyncFunc(
		integrationDesigntimeArtifactsApi
			.requestBuilder()
			.getByKey(id, "active")
			.execute(await getCurrentDestionation()),
		"get current iflow"
	);

	// Sorry
	currentIflow.artifactContent = iflowBuffer as unknown as string;

	const res = await logExecutionTimeOfAsyncFunc(
		integrationDesigntimeArtifactsApi
			.requestBuilder()
			.update(currentIflow)
			.execute(await getCurrentDestionation()),
		"Update iflow"
	);

	logInfo("iFlow updated");
	logInfo(res);
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
