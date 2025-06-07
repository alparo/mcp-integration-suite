import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export type MiddlewareFunction = (
        next: () => Promise<void>,
        name: string,
        params: z.ZodRawShape
) => Promise<void>;

export type contentReturnElement =
	| {
			[x: string]: unknown;
			type: "text";
			text: string;
	  }
	| {
			[x: string]: unknown;
			type: "image";
			data: string;
			mimeType: string;
	  }
	| {
			[x: string]: unknown;
			type: "resource";
			resource:
				| {
						[x: string]: unknown;
						text: string;
						uri: string;
						mimeType?: string;
				  }
				| {
						[x: string]: unknown;
						uri: string;
						blob: string;
						mimeType?: string;
				  };
	  };

export class MiddlewareManager {
	private middlewares: MiddlewareFunction[] = [];

	use(middleware: MiddlewareFunction) {
		this.middlewares.push(middleware);
	}

	async execute(name: string, params: z.ZodRawShape) {
		const executeMiddleware = async (index: number): Promise<void> => {
			if (index >= this.middlewares.length) {
				return;
			}

			const middleware = this.middlewares[index];
			await middleware(() => executeMiddleware(index + 1), name, params);
		};

		await executeMiddleware(0);
	}
}

/**
 * Registers a tool while executing all configured middleware functions.
 * Useful for logging or other cross-cutting concerns.
 */
export function registerToolWithMiddleware(
        server: McpServer,
        middleware: MiddlewareManager,
        name: string,
        description: string,
        params: z.ZodRawShape,
        handler: (
                args: { [x: string]: any },
                extra: { [x: string]: unknown }
        ) => Promise<{
                [x: string]: unknown;
                content: Array<contentReturnElement>;
                _meta?: { [x: string]: unknown };
                isError?: boolean;
        }>
) {
        const wrappedHandler = async (
                args: { [x: string]: any },
                extra: { [x: string]: unknown }
        ) => {
                await middleware.execute(name, params);
                return handler(args, extra);
        };

        return server.tool(name, description, params, wrappedHandler);
}
