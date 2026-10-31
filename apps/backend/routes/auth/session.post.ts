import {
	badFaithError,
	createSessionBody,
	createSessionHeader,
	createSessionOk,
	genericError,
} from "@ringer/schemas";
import { authDocs } from "./docs";
import type Logger from "@loremus299/strawberry";
import db from "../../utils/db";
import { sessionTable, userTable } from "../../utils/db/schema";
import { eq } from "drizzle-orm";
import Result, { NoRows } from "@loremus299/pineapple";
import * as argon2 from "argon2";
import { createHash } from "node:crypto";

const route = authDocs.path("/session", "post", {
	summary: "Create Session",
	description: "Create user session using email and password",
	operationId: "auth-create-session",
	tags: ["Auth"],
});

const action = route.documentFunction({
	body: {
		type: "application/json",
		zod: createSessionBody,
		description: "Email and password",
		required: true,
	},
	header: createSessionHeader,
	responses: {
		201: {
			type: "text/plain",
			description: "Session token, also set in cookie",
			zod: createSessionOk,
		},
		404: {
			type: "application/json",
			description: "User does not exist",
			zod: badFaithError,
		},
		401: {
			type: "text/plain",
			description: "Incorrect password",
			zod: badFaithError,
		},
		500: {
			type: "applicaiton/json",
			description: "Internal Server Error",
			zod: genericError,
		},
	},
});

const createSession = action(async ({ body, header }, log: Logger) => {
	log.trace("action", { ...body, password: "REDACTED" });

	log.debug("op", "check user existence");
	const q = (
		await Result.tryCatch(() =>
			db.select().from(userTable).where(eq(userTable.email, body.email)),
		)
	)
		.one()
		.mapError((e) => (e == NoRows ? "no user" : e));

	if (!q.outcome.success) {
		if (q.outcome.error == "no user")
			return {
				"404": "User with this email address does not exist",
			};
		log.error("server error", q.outcome.error as string);
		return {
			"500": {
				error: "Internal Server Error - Failed to check user existence",
				"request-id": log.id,
			},
		};
	}
	const password = q.outcome.data.password;
	const user = q.outcome.data.id;
	const failedAttempts = q.outcome.data.pastFailedAttempts;
	log.debug("useful to know", { user, failedAttempts });

	log.debug("op", "password verification");
	const verify = await Result.tryCatch(() =>
		argon2.verify(password, body.password),
	);
	if (!verify.outcome.success) {
		log.error("server error", verify.outcome.error);
		return {
			"500": {
				error: "Internal Server Error - Failed to verify password",
				"request-id": log.id,
			},
		};
	}

	if (!verify.outcome.data) {
		log.debug("op", "incrementing past failed attempts count");
		(
			await Result.tryCatch(() =>
				db
					.update(userTable)
					.set({ pastFailedAttempts: failedAttempts + 1 })
					.where(eq(userTable.id, user)),
			)
		).onError((e) => log.error("server error", e as string));
		return { "401": "Incorrect password" };
	}

	log.debug("op", "hashed token for session");
	const token = globalThis.crypto.randomUUID();
	const tokenHash = createHash("sha256").update(token).digest("hex");

	log.debug("op", "create session");
	const q2 = await Result.tryCatch(async () => {
		await db.transaction(async (tx) => {
			await tx
				.insert(sessionTable)
				.values({ token: tokenHash, user, userAgent: header["user-agent"] });
			await tx
				.update(userTable)
				.set({ pastFailedAttempts: 0 })
				.where(eq(userTable.id, user));
		});
	});
	if (!q2.outcome.success) {
		log.error("server error", q2.outcome.error as string);
		return {
			"500": {
				error: "Internal Server Error - Failed to create user session",
				"request-id": log.id,
			},
		};
	}

	return { "201": token };
});
export default createSession;
