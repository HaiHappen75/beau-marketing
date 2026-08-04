import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "widerruf" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"last_updated" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "widerruf_locales" (
  	"title" varchar DEFAULT 'Widerrufsbelehrung',
  	"content" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "agb" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"last_updated" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "agb_locales" (
  	"title" varchar DEFAULT 'AGB',
  	"content" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "widerruf_locales" ADD CONSTRAINT "widerruf_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."widerruf"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "agb_locales" ADD CONSTRAINT "agb_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."agb"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "widerruf_locales_locale_parent_id_unique" ON "widerruf_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "agb_locales_locale_parent_id_unique" ON "agb_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "widerruf" CASCADE;
  DROP TABLE "widerruf_locales" CASCADE;
  DROP TABLE "agb" CASCADE;
  DROP TABLE "agb_locales" CASCADE;`)
}
