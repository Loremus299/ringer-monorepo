import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const userTable = pgTable("users", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => globalThis.crypto.randomUUID()),

	email: text("email").notNull().unique(),
	name: text("preferred_name").notNull(),
	password: text("password").notNull(),

	createdAt: timestamp("created_at").$defaultFn(() => new Date()),
	updatedAt: timestamp("updated_at")
		.$defaultFn(() => new Date())
		.$onUpdateFn(() => new Date()),
});

export const sessionTable = pgTable("sessions", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => globalThis.crypto.randomUUID()),

	user: text("session_owner")
		.references(() => userTable.id)
		.notNull(),
	token: text("session_token").notNull(),

	createdAt: timestamp("created_at").$defaultFn(() => new Date()),
	expirationTime: timestamp("session_expiration").$defaultFn(
		() => new Date(Date.now() + 24 * 60 * 60 * 1000),
	),
});
