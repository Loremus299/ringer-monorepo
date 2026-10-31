CREATE TABLE "sessions" (
	"id" text PRIMARY KEY,
	"session_owner" text NOT NULL,
	"session_token" text NOT NULL,
	"created_at" timestamp,
	"session_expiration" timestamp
);
--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_session_owner_users_id_fkey" FOREIGN KEY ("session_owner") REFERENCES "users"("id");