import Zod, { z } from "zod";
import {
	messageFilterSchema,
	sendRequestSchema,
} from "../../handlers/messages/types";
import { logInfo, projPath } from "../..";
import { getOAuthTokenCPI } from "../cpi_auth";
import {
	MessageProcessingLogs,
	messageProcessingLogs,
} from "../../generated/MessageProcessingLogs";
import { DeSerializers, or } from "@sap-cloud-sdk/odata-v2";
import { and, Filter, FilterList } from "@sap-cloud-sdk/odata-common";
import moment, { Moment } from "moment";
import { getCurrentDestionation } from "../api_destination";
import { createIflow } from "../iflow";
import { integrationContent } from "../../generated/IntegrationContent";
import { folderToZipBuffer } from "../../utils/zip";
import path from "path";

const { messageProcessingLogsApi, messageProcessingLogAttachmentsApi } =
	messageProcessingLogs();

const errStatus = ["RETRY", "FAILED", "ABANDONED", "ESCALATED", "DISCARDED"];

const { integrationDesigntimeArtifactsApi } = integrationContent();

export const sendRequestToCPI = async (
	path: z.infer<typeof sendRequestSchema.path>,
	method: z.infer<typeof sendRequestSchema.method>,
	contentType: z.infer<typeof sendRequestSchema.contentType>,
	body?: z.infer<typeof sendRequestSchema.body>,
	headers?: z.infer<typeof sendRequestSchema.headers>
): Promise<{ status: number; response: string }> => {
	logInfo(`Executing HTTP request to CPI on ${path} METHOD: ${method}`);
	logInfo(body);
	logInfo(headers);

	const authHeader = (await getOAuthTokenCPI()).http_header;

	const reqHeaders = {
		[authHeader.key]: authHeader.value,
		"Content-Type": contentType,
	};

	headers?.forEach((header) => {
		reqHeaders[header.key] = header.value;
	});

	const fullURL = `${process.env["CPI_BASE_URL"]}${path}`;
	logInfo(`Executing request against ${fullURL}`);
	const iflowResponse = await fetch(`${process.env["CPI_BASE_URL"]}${path}`, {
		headers: reqHeaders,
		body,
		method,
	});

	return {
		status: iflowResponse.status,
		response: await iflowResponse.text(),
	};
};

export const getFilters = (
	filterProps: z.infer<typeof messageFilterSchema>
) => {
	const {
		INTEGRATION_ARTIFACT,
		STATUS,
		LOG_START,
		LOG_END,
		SENDER,
		RECEIVER,
		MESSAGE_GUID,
		ADAPTER_ATTRIBUTES,
		ATTACHMENTS,
		CUSTOM_HEADER_PROPERTIES,
		ERROR_INFORMATION,
	} = messageProcessingLogsApi.schema;

	const filterArr: (
		| Filter<MessageProcessingLogs, DeSerializers, Moment | null | string>
		| FilterList<MessageProcessingLogs, DeSerializers>
	)[] = [];

	if (filterProps.LogEnd) {
		const momentTime = moment(filterProps.LogEnd);
		const logEndFilter = LOG_END.lessOrEqual(momentTime);
		filterArr.push(logEndFilter);
	}
	if (filterProps.LogStart) {
		const momentTime = moment(filterProps.LogStart);
		const loStartFilter = LOG_START.greaterOrEqual(momentTime);
		filterArr.push(loStartFilter);
	}

	if (filterProps.integrationFlowId)
		filterArr.push(
			INTEGRATION_ARTIFACT.id.equals(filterProps.integrationFlowId)
		);
	if (filterProps.status) {
		const filterStatusArr: Filter<
			MessageProcessingLogs,
			DeSerializers,
			Moment | null | string
		>[] = [];
		filterProps.status.forEach((statusValue) =>
			filterStatusArr.push(STATUS.equals(statusValue))
		);
		const statusOrFilter = or(filterStatusArr);
		filterArr.push(statusOrFilter);
	}

	if (filterProps.sender) filterArr.push(SENDER.equals(filterProps.sender));
	if (filterProps.receiver)
		filterArr.push(RECEIVER.equals(filterProps.receiver));

	return and(filterArr);
};

export const getMessages = async (
	filterProps: z.infer<typeof messageFilterSchema>
): Promise<
	(MessageProcessingLogs & {
		ErrorInformationValue?: string;
		messageAttachementFiles?: { description?: string; data: string }[];
	})[]
> => {
	const messageBaseReq = messageProcessingLogsApi
		.requestBuilder()
		.getAll()
		// Every message will cause 4 API calls so be aware of rate limits
		// also most LLM truncate Output at some point
		.top(50)
		.filter(getFilters(filterProps));

	logInfo(await messageBaseReq.url(await getCurrentDestionation()));

	const messageWithErrVal: (MessageProcessingLogs & {
		ErrorInformationValue?: string;
		messageAttachementFiles?: { description?: string; data: string }[];
	})[] = await messageBaseReq.execute(await getCurrentDestionation());

	logInfo(`Found ${messageWithErrVal.length} messages`);

	return Promise.all(
		messageWithErrVal.map(async (message) => {
			try {
				message.adapterAttributes = (
					await messageProcessingLogsApi
						.requestBuilder()
						.getByKey(message.messageGuid)
						.appendPath("/AdapterAttributes")
						.executeRaw(await getCurrentDestionation())
				).data;
			} catch (error) {
				logInfo(
					`Could not get adapterAttributes for ${message.messageGuid}`
				);
			}

			try {
				message.customHeaderProperties = (
					await messageProcessingLogsApi
						.requestBuilder()
						.getByKey(message.messageGuid)
						.appendPath("/CustomHeaderProperties")
						.executeRaw(await getCurrentDestionation())
				).data.d.results;
			} catch (error) {
				logInfo(
					`Could not get CustomHeaderProperties for ${message.messageGuid}`
				);
				logInfo(error);
			}

			try {
				message.attachments = (
					await messageProcessingLogsApi
						.requestBuilder()
						.getByKey(message.messageGuid)
						.appendPath("/Attachments")
						.executeRaw(await getCurrentDestionation())
				).data.d.results;

				logInfo(
					`Found ${message.attachments.length} attachements for ${message.messageGuid}`
				);

				message.messageAttachementFiles = [];

				for (const attachement of message.attachments) {
					message.messageAttachementFiles?.push({
						description: attachement.name as string,
						// TS ignore because SAP specification is not what they actually provide
						
						data: await getMessageMedia(
							// @ts-ignore
							attachement["Id"] as string
						),
					});
				}
			} catch (error) {
				logInfo(`Could not get Attachments for ${message.messageGuid}`);
				logInfo(
					await messageProcessingLogsApi
						.requestBuilder()
						.getByKey(message.messageGuid)
						.appendPath("/Attachments")
						.url(await getCurrentDestionation())
				);
				logInfo(error);
			}

			if (message.status && errStatus.includes(message.status)) {
				try {
					logInfo(
						`Getting error value for msg: ${message.messageGuid}`
					);
					message.errorInformation = (
						await messageProcessingLogsApi
							.requestBuilder()
							.getByKey(message.messageGuid)
							.appendPath("/ErrorInformation")
							.executeRaw(await getCurrentDestionation())
					).data.d.results;
					message.ErrorInformationValue = (
						await messageProcessingLogsApi
							.requestBuilder()
							.getByKey(message.messageGuid)
							.appendPath("/ErrorInformation/$value")
							.executeRaw(await getCurrentDestionation())
					).data;
				} catch (error) {
					logInfo(
						`Error getting error info for ${message.messageGuid}`
					);
				}
			}

			return message;
		})
	);
};

export const getMessageMedia = async (mediaId: string): Promise<string> => {
	logInfo(`Getting file ${mediaId}`);

	return (
		await messageProcessingLogAttachmentsApi
			.requestBuilder()
			.getByKey(mediaId)
			.appendPath("/$value")
			.executeRaw(await getCurrentDestionation())
	).data;
};

export const createMappingTestIflow = async (pkgId: string) => {
	const iflowBuffer = await folderToZipBuffer(
		path.resolve(projPath, "resources", "helpers", "if_echo_mapping")
	);

	const newIflow = integrationDesigntimeArtifactsApi
		.entityBuilder()
		.fromJson({
			id: "if_echo_mapping",
			name: "if_echo_mapping",
			packageId: pkgId,
			artifactContent: iflowBuffer.toString("base64"),
		});

	await integrationDesigntimeArtifactsApi
		.requestBuilder()
		.create(newIflow)
		.execute(await getCurrentDestionation());
};
