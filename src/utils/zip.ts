import { mkdtemp, writeFile } from "node:fs/promises";
import { projPath } from "..";
import AdmZip from 'adm-zip';
import path from "node:path";

export const patchFile = async (
	filepath: string,
	content: string
): Promise<void> => {
	await writeFile(filepath, content);
	return;
};

export const extractToFolder = async(zipBuf: Buffer, id: string): Promise<string>  => {
	const iflowPath = path.join(projPath, 'temp', id);
	await mkdtemp(iflowPath);

	const zip = new AdmZip(zipBuf);
	zip.extractAllTo(iflowPath, true);

	return iflowPath;
};

export const folderToZipBuffer = (path: string): Buffer => {
	const zip = new AdmZip(path);
	return zip.toBuffer();

};