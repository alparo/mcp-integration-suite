import unzipper from "unzipper";
import { ZipFile } from "yazl";

export const parseZip = async (unzipArchive: unzipper.CentralDirectory) => {
	let resultString = "";

	for (const file of unzipArchive.files) {
		if (!file.isUnicode) continue;

		resultString += file.path + "\n---begin-of-file---\n";

		try {
			const fileBuf = await file.buffer();
			resultString += fileBuf.toString() + "\n---end-of-file---\n\n";
		} catch {
			continue;
		}
	}

	return resultString;
};

export const getUnzipperInstance = async (rawZip: Buffer) =>
	unzipper.Open.buffer(rawZip);

export const patchFile = async (
	zip: ZipFile,
	filepath: string,
	content: string
): Promise<ZipFile> => {
	zip.addBuffer(Buffer.from(content), filepath)
	return zip;
};
