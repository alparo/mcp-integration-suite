import { z } from 'zod';

export const sendRequestSchema = {
    path: z.string().describe("HTTP Path to send the request to"),
    method: z
        .union([
            z.literal("GET"),
            z.literal("POST"),
            z.literal("PUT"),
            z.literal("DELETE"),
        ])
        .default('POST')
        .describe("HTTP Method to use"),
    body: z.string().optional().describe("request body"),
    headers: z
        .array(
            z.object({
                key: z.string().describe("header"),
                value: z.string().describe("Header Value"),
            })
        )
        .optional()
        .describe("Additional Request headers in key/value format"),
    contentType: z.string().default('application/json').describe('Content type used in header. Defaults to application/json'),
};