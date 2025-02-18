ALTER TABLE "likes" ADD COLUMN "likes_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "likes" ADD COLUMN "dislikes_count" integer DEFAULT 0 NOT NULL;