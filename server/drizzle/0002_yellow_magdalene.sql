ALTER TABLE "matches" DROP CONSTRAINT "matches_host_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "matches" ALTER COLUMN "host_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_host_id_users_id_fk" FOREIGN KEY ("host_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;