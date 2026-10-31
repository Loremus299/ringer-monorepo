import { eq, type InferSelectModel } from "drizzle-orm";
import { sessionTable, userTable } from "../../utils/db/schema";
import type { MiddlewareHandler } from "hono";
import zodValidate, {
	authMiddlewareCookies,
	type GenericError,
} from "@ringer/schemas";
import { getCookie } from "hono/cookie";
import Result, { NoRows } from "@loremus299/pineapple";
import db from "../../utils/db";
import type { AppEnv } from "../../utils/strawberry";
import { createHash } from "node:crypto";

export type AuthEnv = {
	Variables: AppEnv["Variables"] & {
		user: InferSelectModel<typeof userTable>;
		session: InferSelectModel<typeof sessionTable>;
	};
};

const authMiddleware: MiddlewareHandler<AuthEnv> = async (c, next) => {
	const cookies = zodValidate(authMiddlewareCookies, getCookie(c));
	const authToken = cookies.authorization.split("Bearer ")[1] ?? "";
	const tokenHash = createHash("sha256").update(authToken).digest("hex");

	const q = (
		await Result.tryCatch(() =>
			db
				.select({ session: sessionTable, user: userTable })
				.from(sessionTable)
				.innerJoin(userTable, eq(sessionTable.user, userTable.id))
				.where(eq(sessionTable.token, tokenHash)),
		)
	)
		.one()
		.mapError((e) => (e == NoRows ? "no session" : e));

	if (!q.outcome.success) {
		if (q.outcome.error == "no session")
			return c.json<GenericError>(
				{
					error: "No session found",
					"request-id": c.var.logger.id,
				},
				404,
			);
		c.var.logger.error("server error", q.outcome.error as string);
		return c.json<GenericError>(
			{
				error: "Internal Server Error - Failed to get session data",
				"request-id": c.var.logger.id,
			},
			500,
		);
	}

	const user = q.outcome.data.user;
	const session = q.outcome.data.session;

	if (session.expirationTime.getTime() < Date.now()) {
		(
			await Result.tryCatch(() =>
				db.delete(sessionTable).where(eq(sessionTable.id, session.id)),
			)
		).onError((e) =>
			c.var.logger.error("failed to delete an expired session", e),
		);
		return c.json<GenericError>(
			{
				error: "Session token epxired",
				"request-id": c.var.logger.id,
			},
			401,
		);
	}

	c.set("user", user);
	c.set("session", session);

	(await Result.tryCatch(() => next())).onError((e) =>
		c.var.logger.error("bruh", e as string),
	);
};

export default authMiddleware;
