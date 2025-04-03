import axios, { AxiosError } from "axios";
import { contentReturnElement } from "./middleware";
import { logError } from "..";

export const formatError = (error: any): contentReturnElement => {
	logError(Object.keys(error));
	if (error === null) {
		return {
			type: "text",
			text: "Received a null error! This should never happen. Consider checking server logs",
		};
	}
	if (axios.isAxiosError(error?.cause)) {
		const axiosError = error.cause as AxiosError;
		//here we have a type guard check, error inside this if will be treated as AxiosError
		const response = axiosError?.response;
		const request = axiosError?.request;

		if (response) {
			//The request was made and the server responded with a status code that falls out of the range of 2xx the http status code mentioned above
			return {
				type: "text",
				text: JSON.stringify({
					type: "response with error",
					statusCode: response.status,
					statusText: response.statusText,
					responseBody: response.data,
				}),
			};
		} else {
			//The request was made but no response was received, `error.request` is an instance of XMLHttpRequest in the browser and an instance of http.ClientRequest in Node.js
			return {
				type: "text",
				text: JSON.stringify({
					type: "error creating request",
					text: { URI: request.path, method: request.method },
				}),
			};
		}
	} else {
		return {
			type: "text",
			text: JSON.stringify({ error: error.toString() }),
		};
	}
};
