CREATE TYPE "public"."user_role" AS ENUM('admin', 'user');--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"role" "user_role" DEFAULT 'user' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "matches" ADD COLUMN "host_id" integer;--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_host_id_users_id_fk" FOREIGN KEY ("host_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;

-- Create system user if not exists
INSERT INTO users (name, email, password, role)
VALUES ('System', 'system@internal.local', 'random-password', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Backfill host_id
UPDATE matches
SET host_id = (
  SELECT id FROM users WHERE email = 'system@internal.local'
)
WHERE host_id IS NULL;
