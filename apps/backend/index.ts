import { serve } from "@hono/node-server";
import { ZodValidationError } from "@nidhi/schemas";
import { Hono } from "hono/quick";
import loggerMiddleware, { type AppEnv } from "./utils/strawberry";
import { aril } from "./utils/lychee";
import { Scalar } from "@scalar/hono-api-reference";

const app = new Hono<AppEnv>();
app.use("*", loggerMiddleware);

app.get("/openapi", (c) => c.json(aril.docs));
app.use("/", Scalar({ url: "/openapi", theme: "elysiajs" }));

app.onError((err, c) => {
	if (err instanceof ZodValidationError) {
		c.var.logger.warn("failed validation", err.error);
		return c.json(err.error, 400);
	}
	c.var.logger.error("CRITICAL", err);
	return c.text("Unknown & unaccounted error", 500);
});
serve({ fetch: app.fetch, port: 8080 });
