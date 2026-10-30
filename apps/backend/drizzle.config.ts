import { defineConfig } from "drizzle-kit";

export default defineConfig({
	out: "./migrations",
	schema: "./utils/db/schema.ts",
	dialect: "postgresql",
	dbCredentials: {
		url: process.env.DATABASE_URL!,
	},
});
