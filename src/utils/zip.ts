import unzipper from "unzipper";

export const parseZip = async (rawZip: Buffer) => {
	let resultString = "";

	const unzippedArchive = await unzipper.Open.buffer(rawZip);

	for (const file of unzippedArchive.files) {
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
