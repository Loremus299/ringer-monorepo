CREATE TABLE "users" (
	"id" text PRIMARY KEY,
	"email" text NOT NULL UNIQUE,
	"preferred_name" text NOT NULL,
	"password" text NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp
);
