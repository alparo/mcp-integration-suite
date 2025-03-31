import { integrationContent } from "../../generated/IntegrationContent/service";
import { getUnzipperInstance, parseZip, patchFile } from "../../utils/zip";
import { getCurrentDestionation, getOAuthToken } from "../destination";
import { updateIflowFiles } from "../../handlers/iflow";
import unzipper from "unzipper";
import yazl from "yazl";
import fs from "fs";
import { z } from "zod";
const {
	messageMappingDesigntimeArtifactsApi,
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
	return new Promise((resulve, reject) => {
		const chunks: Uint8Array[] = [];

		yazlZip.outputStream.on("data", (chunk) => chunks.push(chunk));
		yazlZip.outputStream.on("end", () => resulve(Buffer.concat(chunks)));
		yazlZip.outputStream.on("error", reject);
	});
};

export const updateIflow = async (
	id: string,
	iflowFiles: z.infer<typeof updateIflowFiles>
) => {
	const unzipperInstance = await getIflowZip(id);
	console.log("noch alles gut");
	const yazlZip = await unzipperToYazl(unzipperInstance);

	for (const file of iflowFiles) {
		await patchFile(yazlZip, file.filepath, file.content);
	}

	yazlZip.end();
	const iflowBuffer = await yazlToBuf(yazlZip);

	const currentIflow = await integrationDesigntimeArtifactsApi
		.requestBuilder()
		.getByKey(id, "active")
		.execute(await getCurrentDestionation());

	// Sorry
	currentIflow.artifactContent = iflowBuffer as unknown as string;


	return integrationDesigntimeArtifactsApi
		.requestBuilder()
		.update(currentIflow)
		.execute(await getCurrentDestionation());
};
