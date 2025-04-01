import { mkdir, writeFile } from "node:fs/promises";
import { logInfo, projPath } from "..";
import AdmZip from 'adm-zip';
import path from "node:path";

export const patchFile = async (
	basePath: string,
	zipPath: string,
	content: string
): Promise<void> => {
	const filePath = path.join(basePath, zipPath);
	await mkdir(path.dirname(filePath), { recursive: true });
	await writeFile(filePath, content);
	return;
};

export const extractToFolder = async(zipBuf: Buffer, id: string): Promise<string>  => {
	const iflowPath = path.join(projPath, 'temp', id);
	await mkdir(iflowPath, { recursive: true });

	const zip = new AdmZip(zipBuf);
	zip.extractAllTo(iflowPath, true);

	return iflowPath;
};

export const folderToZipBuffer = async (path: string): Promise<Buffer<ArrayBufferLike>> => {
	const zip = new AdmZip();
	logInfo(`Adding ${path} to ZIP archive`);
	zip.addLocalFolder(path);
	return zip.toBufferPromise();

};