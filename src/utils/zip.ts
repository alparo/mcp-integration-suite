import { mkdir, writeFile } from "node:fs/promises";
import { projPath } from "..";
import AdmZip from 'adm-zip';
import path from "node:path";

export const patchFile = async (
	basePath: string,
	zipPath: string,
	content: string
): Promise<void> => {
	await writeFile(path.join(basePath, zipPath), content);
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
	await zip.addLocalFolderPromise(path, {});
	return zip.toBuffer();

};