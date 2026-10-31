import { genericError, getSessionOk } from "@ringer/schemas";
import { protectedAuthDocs } from "./docs";
import type Logger from "@loremus299/strawberry";
import Result from "@loremus299/pineapple";
import db from "../../utils/db";
import { sessionTable } from "../../utils/db/schema";
import { eq } from "drizzle-orm";

const route = protectedAuthDocs.path("/session", "get", {
	summary: "Get sessions",
	description: "Get all the sessions owned by the user",
	operationId: "auth-get-sessions",
	tags: ["Auth"],
});

const action = route.documentFunction({
	responses: {
		200: {
			description: "User sessions",
			type: "application/json",
			zod: getSessionOk,
		},
		500: {
			description: "Failed to get sessions",
			type: "application/json",
			zod: genericError,
		},
	},
});

const getSession = action(
	async (_req, user: string, token: string, log: Logger) => {
		log.trace("action", { user, token });

		const sessions = await Result.tryCatch(() =>
			db.select().from(sessionTable).where(eq(sessionTable.user, user)),
		);

		if (!sessions.outcome.success) {
			log.error("server error", sessions.outcome.error as string);
			return {
				"500": {
					error: "Internal Server Error - Failed to get sessions",
					"request-id": log.id,
				},
			};
		}

		const res = sessions.outcome.data.map((item) => {
			return {
				id: item.id,
				userAgent: item.userAgent,
				createdAt: item.createdAt.toISOString(),
				expirationTime: item.expirationTime.toISOString(),
				current: item.token == token,
			};
		});

		return { "200": res };
	},
);

export default getSession;
