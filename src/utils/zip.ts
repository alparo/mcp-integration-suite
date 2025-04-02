import { mkdir, writeFile } from "node:fs/promises";
import { logInfo, projPath } from "..";
import AdmZip from "adm-zip";
import path from "node:path";
import { rimraf } from "rimraf";



export const extractToFolder = async (
	zipBuf: Buffer,
	id: string
): Promise<string> => {
	const iflowPath = path.join(projPath, "temp", id);
	await rimraf(iflowPath);
	await mkdir(iflowPath, { recursive: true });

	const zip = new AdmZip(zipBuf);
	zip.extractAllTo(iflowPath, true);

	return iflowPath;
};

export const folderToZipBuffer = async (path: string): Promise<Buffer> => {
	const zip = new AdmZip();
	logInfo(`Adding ${path} to ZIP archive`);
	zip.addLocalFolder(path);
	return zip.toBufferPromise();
};
