CREATE TABLE IF NOT EXISTS "commentlikes" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"comment_id" integer NOT NULL,
	CONSTRAINT "commentlikes_user_id_comment_id_unique" UNIQUE("user_id","comment_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "commentlikes" ADD CONSTRAINT "commentlikes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "commentlikes" ADD CONSTRAINT "commentlikes_comment_id_comments_id_fk" FOREIGN KEY ("comment_id") REFERENCES "public"."comments"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
