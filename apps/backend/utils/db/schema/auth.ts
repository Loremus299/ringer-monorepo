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
