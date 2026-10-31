import { serve } from "@hono/node-server";
import { ZodValidationError } from "@nidhi/schemas";
import { Hono } from "hono/quick";
import loggerMiddleware, { type AppEnv } from "./utils/strawberry";
import { aril } from "./utils/lychee";
import { Scalar } from "@scalar/hono-api-reference";
import { env } from "node:process";
import { authRouter } from "./routes/auth";

if (!(env.PORT && env.DATABASE_URL))
	throw new Error(`
MAKE SURE THE FOLLOWING ENVIRONMENT VARIABLES ARE SET
PORT=
DATABASE_URL=`);

const app = new Hono<AppEnv>();
app.use("*", loggerMiddleware);

app.route("", authRouter);

app.get("/openapi", (c) => c.json(aril.docs));
app.use(
	"/",
	Scalar({
		url: "/openapi",
		theme: "elysiajs",
		showOperationId: true,
		showDeveloperTools: "never",
	}),
);

app.onError((err, c) => {
	if (err instanceof ZodValidationError) {
		c.var.logger.warn("failed validation", err.error);
		return c.json(err.error, 400);
	}
	c.var.logger.error(
		"CRITICAL",
		err instanceof Error ? (err.stack ?? err.message) : String(err),
	);
	return c.text("Unknown & unaccounted error", 500);
});
aril.servers([
	{
		url: `http://localhost:${env.PORT}`,
		description: "Local Development Server",
	},
]);
serve({ fetch: app.fetch, port: Number(env.PORT) });
