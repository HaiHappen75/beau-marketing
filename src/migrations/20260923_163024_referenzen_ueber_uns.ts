import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pages_blocks_timeline_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pages_blocks_timeline_items_locales" (
  	"label" varchar,
  	"title" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_timeline" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_timeline_locales" (
  	"kicker" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_dark_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_dark_text_locales" (
  	"kicker" varchar,
  	"heading" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_case_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_case_grid_locales" (
  	"kicker" varchar,
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_timeline_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_timeline_items_locales" (
  	"label" varchar,
  	"title" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_timeline" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_timeline_locales" (
  	"kicker" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_dark_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_dark_text_locales" (
  	"kicker" varchar,
  	"heading" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_case_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_case_grid_locales" (
  	"kicker" varchar,
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "pages_rels" ADD COLUMN "media_id" integer;
  ALTER TABLE "_pages_v_rels" ADD COLUMN "media_id" integer;
  ALTER TABLE "cases_locales" ADD COLUMN "summary" varchar;
  ALTER TABLE "_cases_v_locales" ADD COLUMN "version_summary" varchar;
  ALTER TABLE "pages_blocks_timeline_items" ADD CONSTRAINT "pages_blocks_timeline_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_timeline"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_timeline_items_locales" ADD CONSTRAINT "pages_blocks_timeline_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_timeline_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_timeline" ADD CONSTRAINT "pages_blocks_timeline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_timeline_locales" ADD CONSTRAINT "pages_blocks_timeline_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_timeline"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_dark_text" ADD CONSTRAINT "pages_blocks_dark_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_dark_text_locales" ADD CONSTRAINT "pages_blocks_dark_text_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_dark_text"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_case_grid" ADD CONSTRAINT "pages_blocks_case_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_case_grid_locales" ADD CONSTRAINT "pages_blocks_case_grid_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_case_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_timeline_items" ADD CONSTRAINT "_pages_v_blocks_timeline_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_timeline"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_timeline_items_locales" ADD CONSTRAINT "_pages_v_blocks_timeline_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_timeline_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_timeline" ADD CONSTRAINT "_pages_v_blocks_timeline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_timeline_locales" ADD CONSTRAINT "_pages_v_blocks_timeline_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_timeline"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_dark_text" ADD CONSTRAINT "_pages_v_blocks_dark_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_dark_text_locales" ADD CONSTRAINT "_pages_v_blocks_dark_text_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_dark_text"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_case_grid" ADD CONSTRAINT "_pages_v_blocks_case_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_case_grid_locales" ADD CONSTRAINT "_pages_v_blocks_case_grid_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_case_grid"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_timeline_items_order_idx" ON "pages_blocks_timeline_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_timeline_items_parent_id_idx" ON "pages_blocks_timeline_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_timeline_items_locales_locale_parent_id_unique" ON "pages_blocks_timeline_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_timeline_order_idx" ON "pages_blocks_timeline" USING btree ("_order");
  CREATE INDEX "pages_blocks_timeline_parent_id_idx" ON "pages_blocks_timeline" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_timeline_path_idx" ON "pages_blocks_timeline" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_timeline_locales_locale_parent_id_unique" ON "pages_blocks_timeline_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_dark_text_order_idx" ON "pages_blocks_dark_text" USING btree ("_order");
  CREATE INDEX "pages_blocks_dark_text_parent_id_idx" ON "pages_blocks_dark_text" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_dark_text_path_idx" ON "pages_blocks_dark_text" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_dark_text_locales_locale_parent_id_unique" ON "pages_blocks_dark_text_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_case_grid_order_idx" ON "pages_blocks_case_grid" USING btree ("_order");
  CREATE INDEX "pages_blocks_case_grid_parent_id_idx" ON "pages_blocks_case_grid" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_case_grid_path_idx" ON "pages_blocks_case_grid" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_case_grid_locales_locale_parent_id_unique" ON "pages_blocks_case_grid_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_timeline_items_order_idx" ON "_pages_v_blocks_timeline_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_timeline_items_parent_id_idx" ON "_pages_v_blocks_timeline_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_timeline_items_locales_locale_parent_id_uniq" ON "_pages_v_blocks_timeline_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_timeline_order_idx" ON "_pages_v_blocks_timeline" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_timeline_parent_id_idx" ON "_pages_v_blocks_timeline" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_timeline_path_idx" ON "_pages_v_blocks_timeline" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_timeline_locales_locale_parent_id_unique" ON "_pages_v_blocks_timeline_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_dark_text_order_idx" ON "_pages_v_blocks_dark_text" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_dark_text_parent_id_idx" ON "_pages_v_blocks_dark_text" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_dark_text_path_idx" ON "_pages_v_blocks_dark_text" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_dark_text_locales_locale_parent_id_unique" ON "_pages_v_blocks_dark_text_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_case_grid_order_idx" ON "_pages_v_blocks_case_grid" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_case_grid_parent_id_idx" ON "_pages_v_blocks_case_grid" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_case_grid_path_idx" ON "_pages_v_blocks_case_grid" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_case_grid_locales_locale_parent_id_unique" ON "_pages_v_blocks_case_grid_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_rels_media_id_idx" ON "pages_rels" USING btree ("media_id");
  CREATE INDEX "_pages_v_rels_media_id_idx" ON "_pages_v_rels" USING btree ("media_id");
  ALTER TABLE "brands" DROP COLUMN "accent_color";
  ALTER TABLE "brands" DROP COLUMN "accent_gradient_from";
  ALTER TABLE "brands" DROP COLUMN "accent_gradient_to";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_timeline_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_timeline_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_timeline" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_timeline_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_dark_text" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_dark_text_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_case_grid" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_case_grid_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_timeline_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_timeline_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_timeline" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_timeline_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_dark_text" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_dark_text_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_case_grid" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_case_grid_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_timeline_items" CASCADE;
  DROP TABLE "pages_blocks_timeline_items_locales" CASCADE;
  DROP TABLE "pages_blocks_timeline" CASCADE;
  DROP TABLE "pages_blocks_timeline_locales" CASCADE;
  DROP TABLE "pages_blocks_dark_text" CASCADE;
  DROP TABLE "pages_blocks_dark_text_locales" CASCADE;
  DROP TABLE "pages_blocks_case_grid" CASCADE;
  DROP TABLE "pages_blocks_case_grid_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_timeline_items" CASCADE;
  DROP TABLE "_pages_v_blocks_timeline_items_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_timeline" CASCADE;
  DROP TABLE "_pages_v_blocks_timeline_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_dark_text" CASCADE;
  DROP TABLE "_pages_v_blocks_dark_text_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_case_grid" CASCADE;
  DROP TABLE "_pages_v_blocks_case_grid_locales" CASCADE;
  ALTER TABLE "pages_rels" DROP CONSTRAINT IF EXISTS "pages_rels_media_fk";
  
  ALTER TABLE "_pages_v_rels" DROP CONSTRAINT IF EXISTS "_pages_v_rels_media_fk";
  
  DROP INDEX IF EXISTS "pages_rels_media_id_idx";
  DROP INDEX IF EXISTS "_pages_v_rels_media_id_idx";
  ALTER TABLE "brands" ADD COLUMN "accent_color" varchar DEFAULT '#004959' NOT NULL;
  ALTER TABLE "brands" ADD COLUMN "accent_gradient_from" varchar;
  ALTER TABLE "brands" ADD COLUMN "accent_gradient_to" varchar;
  ALTER TABLE "pages_rels" DROP COLUMN "media_id";
  ALTER TABLE "_pages_v_rels" DROP COLUMN "media_id";
  ALTER TABLE "cases_locales" DROP COLUMN "summary";
  ALTER TABLE "_cases_v_locales" DROP COLUMN "version_summary";`)
}
