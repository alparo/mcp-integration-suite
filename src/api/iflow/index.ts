import { integrationContent } from "../../generated/IntegrationContent/service";
import { parseZip } from "../../utils/zip";
import { getCurrentDestionation, getOAuthToken } from "../destination";

const {
	messageMappingDesigntimeArtifactsApi,
	integrationDesigntimeArtifactsApi,
} = integrationContent();

export const getIflow = async (id: string): Promise<string> => {
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
	return parseZip(buf);
};
