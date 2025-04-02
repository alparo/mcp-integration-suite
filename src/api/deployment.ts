import { deployIntegrationDesigntimeArtifact, integrationContent } from "../generated/IntegrationContent";
import { getCurrentDestionation } from "./api_destination";

const { buildAndDeployStatusApi } = integrationContent();

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * 
 * @param id Artifact ID
 * @returns Deployment Task ID
 */
export const deployArtifact = async (id: string): Promise<string> => {
    const deployRes = await deployIntegrationDesigntimeArtifact({
        id,
        version: "active",
    }).executeRaw(await getCurrentDestionation());

    if (deployRes.status !== 202) {
        throw new Error('Error starting deployment of ' + id);
    }

    return deployRes.data;
};

/**
 * Waits until deployment is finished 
 * Runs as long as status is DEPLOYING
 * @param taskId Task ID of deployment
 * @returns Staus e.g. SUCCESS, FAILED, ...
 */
export const waitAndGetDeployStatus = async(taskId: string): Promise<string> => {
    let statusObj = await buildAndDeployStatusApi.requestBuilder().getByKey(taskId).execute(await getCurrentDestionation());

    while (statusObj.status === 'DEPLOYING') {
        statusObj = await buildAndDeployStatusApi.requestBuilder().getByKey(taskId).execute(await getCurrentDestionation());
        await sleep(1000);
    }

    if (!statusObj.status) {
        throw new Error('Error getting deployment status for ' + taskId);
    }

    return statusObj.status
};