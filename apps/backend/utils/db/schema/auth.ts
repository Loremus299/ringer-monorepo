import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const userTable = pgTable("users", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => globalThis.crypto.randomUUID()),

	email: text("email").notNull().unique(),
	name: text("preferred_name").notNull(),
	password: text("password").notNull(),
	pastFailedAttempts: integer("past_failed_attempts").notNull(),

	createdAt: timestamp("created_at")
		.$defaultFn(() => new Date())
		.notNull(),
	updatedAt: timestamp("updated_at")
		.$defaultFn(() => new Date())
		.$onUpdateFn(() => new Date())
		.notNull(),
});

export const sessionTable = pgTable("sessions", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => globalThis.crypto.randomUUID()),

	user: text("session_owner")
		.references(() => userTable.id, { onDelete: "cascade" })
		.notNull(),
	token: text("session_token").notNull(),
	userAgent: text("session_user_agent").notNull(),

	createdAt: timestamp("created_at")
		.$defaultFn(() => new Date())
		.notNull(),
	expirationTime: timestamp("session_expiration")
		.$defaultFn(() => new Date(Date.now() + 24 * 60 * 60 * 1000))
		.notNull(),
});
