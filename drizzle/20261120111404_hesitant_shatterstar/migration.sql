CREATE TABLE "urls" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"code" varchar(155) NOT NULL CONSTRAINT "urls_code_key" UNIQUE,
	"target_url" text NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"first_name" varchar(55) NOT NULL,
	"last_name" varchar(55),
	"email" varchar(55) NOT NULL,
	"password" text NOT NULL,
	"salt" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "urls" ADD CONSTRAINT "urls_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id");