import {
    getMessages,
    getMessagesCount,
    getMessageMedia, // Note: Testing this requires a known message with a known attachment ID
    createMappingTestIflow
} from "../messages/messageLogs";
import { sendRequestToCPI } from "../messages/sendMessageToCPI";
import { createPackage } from "../packages/index"; // Need createPackage
import { getAllIflowsByPackage, deployIflow } from "../iflow/index"; // Need to check iflow creation/deployment
import { waitAndGetDeployStatus, getDeploymentErrorReason } from "../deployment"; // Need deployment status check
import dotenv from 'dotenv';
import moment from 'moment';
import { deletePackage, safeStringify } from "./helpers";

// Load environment variables from .env file
dotenv.config();

describe("Message Log API", () => {
    // Increase timeout significantly
    jest.setTimeout(300000); // 5 minutes

    const testPackageIdBase = `jesttestpkgmsglogs`; // No underscores
    let testPackageId: string = ""; // Initialize
    const testIflowId = "if_echo_mapping"; // Specific ID used by createMappingTestIflow
    let packageCreated = false;
    let testIflowCreated = false;
    let testIflowDeployed = false;
    let testMessageGuid: string | undefined;

    // Check prerequisites and create a dedicated package for these tests
    beforeAll(async () => {
        if (!process.env.API_BASE_URL || (!process.env.API_USER && !process.env.API_OAUTH_CLIENT_ID)) {
            throw new Error("Missing required environment variables for API connection (URL and Auth). Skipping Message Log tests.");
        }
        // Create a unique package for this test run (no underscores)
        testPackageId = testPackageIdBase; // Removed underscore
        try {
            console.log(`Attempting to create test package for message logs: ${testPackageId}`);
            await createPackage(testPackageId, `Jest MsgLog Test Pkg`, `Temp pkg for Jest MsgLog tests`);
            packageCreated = true;
            console.log(`Test package ${testPackageId} created successfully.`);
        } catch (error) {
            console.error(
                `Failed to create test package ${testPackageId}. Message Log tests will likely fail. Error:`,
                safeStringify(error)
            );
            throw new Error(`Failed to create prerequisite package ${testPackageId}`);
        }
    });

    // Note: No automatic cleanup for the package or iflow. Manual cleanup needed.

    it("should create the mapping test iflow 'if_echo_mapping'", async () => {
        expect(packageCreated).toBe(true); // Ensure package exists
        try {
            await createMappingTestIflow(testPackageId);
            testIflowCreated = true;
            // Verify by checking the list of iflows in the package
            const iflows = await getAllIflowsByPackage(testPackageId);
            const found = iflows.some((iflow: any) => iflow.Id === testIflowId);
            expect(found).toBe(true);
            console.log(`IFlow ${testIflowId} created in package ${testPackageId}.`);

            // Also deploy it for subsequent tests if needed (e.g., for getMessages)
            console.log(`Attempting to deploy ${testIflowId}...`);
            const taskId = await deployIflow(testIflowId);
            const status = await waitAndGetDeployStatus(taskId);
             if (status !== "SUCCESS") {
                 const reason = await getDeploymentErrorReason(testIflowId);
                 throw new Error(`Deployment of ${testIflowId} failed. Status: ${status}. Reason: ${reason}`);
             }
             testIflowDeployed = true;
             console.log(`IFlow ${testIflowId} deployed successfully.`);

            // Trigger the iflow to create a log entry
            await sendRequestToCPI(
                "/http/mcp/testmapping",
                "POST",
                "text/plain",
                "test"
            );

            // Poll for a message belonging to the iflow
            const startTime = moment().subtract(5, "minutes");
            for (let i = 0; i < 12; i++) {
                const messages = await getMessages({
                    integrationFlowId: testIflowId,
                    LogStart: startTime.toISOString(),
                    LogEnd: moment().toISOString(),
                });
                if (messages.length > 0) {
                    testMessageGuid = messages[0].messageGuid;
                    console.log(`Captured message GUID ${testMessageGuid}`);
                    break;
                }
                await new Promise((r) => setTimeout(r, 5000));
            }

            if (!testMessageGuid) {
                console.warn("No message GUID captured for if_echo_mapping");
            }

        } catch (error) {
            console.error(
                `Error during createMappingTestIflow test for package ${testPackageId}:`,
                safeStringify(error)
            );
            // Attempt to get error reason if deployment might have failed
            try {
                 const errorReason = await getDeploymentErrorReason(testIflowId);
                 console.error(`Deployment error reason for ${testIflowId}: ${errorReason}`);
             } catch (reasonError) {}
            throw new Error((error as Error).message);
        }
    });

    it("should count messages within a time range", async () => {
        // This test assumes there might be *some* messages in the system.
        // It's hard to guarantee messages exist without sending one first.
        try {
            const now = moment();
            const fiveMinutesAgo = moment().subtract(5, 'minutes');
            const count = await getMessagesCount({
                LogStart: fiveMinutesAgo.toISOString(),
                LogEnd: now.toISOString()
            });
            expect(count).toBeDefined();
            expect(typeof count).toBe('number');
            expect(count).toBeGreaterThanOrEqual(0); // Count can be 0
            console.log(`Found ${count} messages in the last 5 minutes.`);
        } catch (error) {
            console.error(
                `Error during getMessagesCount test:`,
                safeStringify(error)
            );
            throw new Error((error as Error).message);
        }
    });

    it("should retrieve messages with filters (last 5 mins, limit 50)", async () => {
        // Similar to count, assumes some messages might exist.
        try {
            const now = moment();
            const fiveMinutesAgo = moment().subtract(5, 'minutes');
            const messages = await getMessages({
                LogStart: fiveMinutesAgo.toISOString(),
                LogEnd: now.toISOString()
                // Optionally add status or iflow filter if needed for more specific tests
                // status: ["COMPLETED", "FAILED"],
                // integrationFlowId: testIflowId // Only if we sent a message to it
            });
            expect(messages).toBeDefined();
            expect(Array.isArray(messages)).toBe(true);
            expect(messages.length).toBeLessThanOrEqual(50); // Due to internal limit in getMessages
            console.log(`Retrieved ${messages.length} messages from the last 5 minutes.`);
            // Can add more checks here if specific messages are expected
            if (messages.length > 0) {
                expect(messages[0].messageGuid).toBeDefined();
                // Check structure of retrieved messages if needed
            }
        } catch (error) {
            console.error(
                `Error during getMessages test:`,
                safeStringify(error)
            );
            throw new Error((error as Error).message);
        }
    });

    it("should retrieve a message log by GUID", async () => {
        if (!testMessageGuid) {
            console.warn("Skipping test: no message GUID available");
            return;
        }

        try {
            const messages = await getMessages({ msgGUID: testMessageGuid });

            expect(messages).toBeDefined();
            expect(Array.isArray(messages)).toBe(true);
            expect(messages).toHaveLength(1);

            const message = messages[0];
            expect(message.messageGuid).toEqual(testMessageGuid);
            expect(message.status).toBeDefined();
            console.log(`Successfully retrieved message log ${testMessageGuid}. Status: ${message.status}`);

        } catch (error) {
            console.error(
                `Error during getMessages test for specific GUID ${testMessageGuid}:`,
                safeStringify(error)
            );
            throw new Error((error as Error).message);
        }
    });

    it("should retrieve a message log with possible attachments", async () => {
        if (!testMessageGuid) {
            console.warn("Skipping test: no message GUID available");
            return;
        }

        try {
            const messages = await getMessages({ msgGUID: testMessageGuid });

            expect(messages).toBeDefined();
            expect(Array.isArray(messages)).toBe(true);
            expect(messages).toHaveLength(1);

            const message = messages[0];
            expect(message.messageGuid).toEqual(testMessageGuid);
            expect(message.status).toBeDefined();

            if (message.attachments && message.attachments.length > 0) {
                expect(message.messageAttachementFiles).toBeDefined();
                if (message.messageAttachementFiles) {
                    expect(Array.isArray(message.messageAttachementFiles)).toBe(true);
                    expect(message.messageAttachementFiles.length).toBeGreaterThan(0);
                }
            } else {
                console.log("No attachments found for the test message");
            }

            console.log(`Successfully retrieved message log ${testMessageGuid}. Status: ${message.status}`);

        } catch (error) {
            console.error(
                `Error during getMessages test for specific GUID ${testMessageGuid} with attachments:`,
                safeStringify(error)
            );
            throw new Error((error as Error).message);
        }
    });


    afterAll(async() => {
        await deletePackage(testPackageId);
    });

});
