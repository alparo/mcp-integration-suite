import { promises as fs } from "fs";
import { glob } from "glob";
import path from "path";
import { logInfo } from "..";

export const parseFolder = async (folderPath: string): Promise<string> => {
	const allFiles = await glob(path.join(folderPath, "**/*"), { nodir: true });

	let resultString = "";

	for (const file of allFiles) {
		resultString += file + "\n---begin-of-file---\n";
		resultString += await fs.readFile(file, "utf-8");
		resultString += "\n---end-of-file---\n\n";
	}

	logInfo(
		`Done parsing ${folderPath}. Total length is  ${resultString.length}`
	);

	return resultString;
};

