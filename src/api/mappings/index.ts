import { integrationContent } from "../../generated/IntegrationContent";
import { parseFolder } from "../../utils/fileBasedUtils";
import { extractToFolder } from "../../utils/zip";
import { getCurrentDestionation, getOAuthToken } from "../api_destination";

const { messageMappingDesigntimeArtifactsApi } = integrationContent();

export const getIflowContentString = async (id: string): Promise<string> => {
    const folderPath = await getIflowFolder(id);
    return parseFolder(folderPath);
};

export const getIflowFolder = async (id: string): Promise<string> => {
    const iflowUrl = await messageMappingDesigntimeArtifactsApi
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
    return extractToFolder(buf, id);
};