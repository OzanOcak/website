CREATE TABLE IF NOT EXISTS "website_visits" (
	"id" serial PRIMARY KEY NOT NULL,
	"total_visits" bigint DEFAULT 0 NOT NULL
);
