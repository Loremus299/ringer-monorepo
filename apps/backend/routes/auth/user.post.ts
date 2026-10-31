import {
	badFaithError,
	createUserBody,
	genericError,
	genericOk,
} from "@ringer/schemas";
import { authDocs } from "./docs";
import type Logger from "@loremus299/strawberry";
import Result, { NoRows } from "@loremus299/pineapple";
import db from "../../utils/db";
import { userTable } from "../../utils/db/schema";
import * as argon2 from "argon2";

const route = authDocs.path("/user", "post", {
	summary: "Create user",
	description: "Create user with preferred name, email and password",
	operationId: "auth-create-user",
	tags: ["Auth"],
});

const action = route.documentFunction({
	body: {
		type: "application/json",
		zod: createUserBody,
		description: "Preferred name, email, password",
		required: true,
	},
	responses: {
		201: { type: "text/plain", description: "Nice message :3", zod: genericOk },
		409: {
			type: "application/json",
			description: "Email already registered",
			zod: badFaithError,
		},
		500: {
			type: "application/json",
			description: "Internal Server Error",
			zod: genericError,
		},
	},
});

const createUser = action(async ({ body }, log: Logger) => {
	log.trace("action", { ...body, password: "REDACTED" });

	log.debug("op", "hashing password");
	const hashedPassword = await Result.tryCatch(() =>
		argon2.hash(body.password),
	);
	if (!hashedPassword.outcome.success)
		return {
			"500": {
				error: "Internal Server Error - Failed to hash password",
				"request-id": log.id,
			},
		};

	const hp = hashedPassword.outcome.data;
	log.debug("op", "create user query");
	const q = (
		await Result.tryCatch(() =>
			db
				.insert(userTable)
				.values({ ...body, password: hp, pastFailedAttempts: 0 })
				.onConflictDoNothing()
				.returning(),
		)
	)
		.one()
		.mapError((e) => (e === NoRows ? "conflict" : e));

	if (!q.outcome.success) {
		if (q.outcome.error == "conflict")
			return {
				"409": "Email is already registered",
			};
		log.error("server error", q.outcome.error as string);
		return {
			"500": {
				error: "Internal Server Error - Failed to create user",
				"request-id": log.id,
			},
		};
	}

	return { "201": "Successfully created user account" };
});

export default createUser;
