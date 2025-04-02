import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

type MiddlewareFunction = (next: () => Promise<void>) => Promise<void>;

export class MiddlewareManager {
	private middlewares: MiddlewareFunction[] = [];

	use(middleware: MiddlewareFunction) {
		this.middlewares.push(middleware);
	}

	async execute() {
		const executeMiddleware = async (index: number): Promise<void> => {
			if (index >= this.middlewares.length) {
				return;
			}

			const middleware = this.middlewares[index];
			await middleware(() => executeMiddleware(index + 1));
		};

		await executeMiddleware(0);
	}
}

export class McpServerWithMiddleware extends McpServer {
	private middlewareManager: MiddlewareManager;

	constructor(options: ConstructorParameters<typeof McpServer>[0]) {
		super(options);
		this.middlewareManager = new MiddlewareManager();
	}

	use(middleware: MiddlewareFunction) {
		this.middlewareManager.use(middleware);
	}

	registerTool(
		name: string,
		description: string,
		params: z.ZodRawShape,
		handler: (
			args: { [x: string]: any },
			extra: { [x: string]: unknown }
		) => Promise<{
			[x: string]: unknown;
			content: Array<
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
				  }
			>;
			_meta?: { [x: string]: unknown };
			isError?: boolean;
		}>
	) {
		const wrappedHandler = async (
			args: { [x: string]: any },
			extra: { [x: string]: unknown }
		) => {
			await this.middlewareManager.execute();
			return handler(args, extra);
		};

		return this.tool(name, description, params, wrappedHandler);
	}
}
