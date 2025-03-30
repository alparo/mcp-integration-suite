import { integrationContent } from "../../generated/IntegrationContent/service";
import { parseZip } from "../../utils/zip";
import { getCurrentDestionation } from "../destination";

const { messageMappingDesigntimeArtifactsApi, integrationDesigntimeArtifactsApi } = integrationContent();

export const getIflow = async () => {
	const iflowResponse = await integrationDesigntimeArtifactsApi
		.requestBuilder()
		.getByKey("if_testings", "active")
        .appendPath('/$value')
        //.url(await getCurrentDestionation())
		.executeRaw(await getCurrentDestionation())
    
    if (iflowResponse.status !== 200) {
        throw new Error('Error while downloading iflow ZIP');
    }

    await parseZip(iflowResponse.data)
};
