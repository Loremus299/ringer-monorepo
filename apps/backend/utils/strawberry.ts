import Strawberry from "@loremus299/strawberry";
import type { MiddlewareHandler } from "hono";

export type AppEnv = {
	Variables: {
		logger: Strawberry;
	};
};

const loggerMiddleware: MiddlewareHandler<AppEnv> = async (c, next) => {
	const logger = new Strawberry();
	const start = performance.now();

	c.set("logger", logger);

	logger.info("Request", {
		url: `${c.req.method} ${c.req.url}`,
	});

	await next();

	logger.info("Response", {
		status: c.res.status,
		duration: `${(performance.now() - start).toFixed(6)}ms`,
	});

	await logger.dump();
};

export default loggerMiddleware;
