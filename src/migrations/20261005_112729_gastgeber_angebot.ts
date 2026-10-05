import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_offer_style" AS ENUM('box', 'columns', 'plain');
  CREATE TYPE "public"."enum_pages_blocks_offer_unit" AS ENUM('once', 'month', 'hour');
  CREATE TYPE "public"."enum__pages_v_blocks_offer_style" AS ENUM('box', 'columns', 'plain');
  CREATE TYPE "public"."enum__pages_v_blocks_offer_unit" AS ENUM('once', 'month', 'hour');
  CREATE TABLE "pages_blocks_offer_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pages_blocks_offer_items_locales" (
  	"item" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_offer" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"style" "enum_pages_blocks_offer_style" DEFAULT 'box',
  	"price" numeric,
  	"price_is_from" boolean DEFAULT false,
  	"unit" "enum_pages_blocks_offer_unit" DEFAULT 'once',
  	"link_href" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_offer_locales" (
  	"kicker" varchar,
  	"heading" varchar,
  	"text" varchar,
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_offer_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_offer_items_locales" (
  	"item" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_offer" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"style" "enum__pages_v_blocks_offer_style" DEFAULT 'box',
  	"price" numeric,
  	"price_is_from" boolean DEFAULT false,
  	"unit" "enum__pages_v_blocks_offer_unit" DEFAULT 'once',
  	"link_href" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_offer_locales" (
  	"kicker" varchar,
  	"heading" varchar,
  	"text" varchar,
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "services" ADD COLUMN "highlight_page_id" integer;
  ALTER TABLE "services_locales" ADD COLUMN "highlight_kicker" varchar;
  ALTER TABLE "services_locales" ADD COLUMN "highlight_link_label" varchar;
  ALTER TABLE "services_locales" ADD COLUMN "highlight_heading" varchar;
  ALTER TABLE "services_locales" ADD COLUMN "highlight_text" varchar;
  ALTER TABLE "_services_v" ADD COLUMN "version_highlight_page_id" integer;
  ALTER TABLE "_services_v_locales" ADD COLUMN "version_highlight_kicker" varchar;
  ALTER TABLE "_services_v_locales" ADD COLUMN "version_highlight_link_label" varchar;
  ALTER TABLE "_services_v_locales" ADD COLUMN "version_highlight_heading" varchar;
  ALTER TABLE "_services_v_locales" ADD COLUMN "version_highlight_text" varchar;
  ALTER TABLE "pages_blocks_offer_items" ADD CONSTRAINT "pages_blocks_offer_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_offer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_offer_items_locales" ADD CONSTRAINT "pages_blocks_offer_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_offer_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_offer" ADD CONSTRAINT "pages_blocks_offer_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_offer_locales" ADD CONSTRAINT "pages_blocks_offer_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_offer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_offer_items" ADD CONSTRAINT "_pages_v_blocks_offer_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_offer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_offer_items_locales" ADD CONSTRAINT "_pages_v_blocks_offer_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_offer_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_offer" ADD CONSTRAINT "_pages_v_blocks_offer_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_offer_locales" ADD CONSTRAINT "_pages_v_blocks_offer_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_offer"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_offer_items_order_idx" ON "pages_blocks_offer_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_offer_items_parent_id_idx" ON "pages_blocks_offer_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_offer_items_locales_locale_parent_id_unique" ON "pages_blocks_offer_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_offer_order_idx" ON "pages_blocks_offer" USING btree ("_order");
  CREATE INDEX "pages_blocks_offer_parent_id_idx" ON "pages_blocks_offer" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_offer_path_idx" ON "pages_blocks_offer" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_offer_locales_locale_parent_id_unique" ON "pages_blocks_offer_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_offer_items_order_idx" ON "_pages_v_blocks_offer_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_offer_items_parent_id_idx" ON "_pages_v_blocks_offer_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_offer_items_locales_locale_parent_id_unique" ON "_pages_v_blocks_offer_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_offer_order_idx" ON "_pages_v_blocks_offer" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_offer_parent_id_idx" ON "_pages_v_blocks_offer" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_offer_path_idx" ON "_pages_v_blocks_offer" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_offer_locales_locale_parent_id_unique" ON "_pages_v_blocks_offer_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "services" ADD CONSTRAINT "services_highlight_page_id_pages_id_fk" FOREIGN KEY ("highlight_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_services_v" ADD CONSTRAINT "_services_v_version_highlight_page_id_pages_id_fk" FOREIGN KEY ("version_highlight_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "services_highlight_highlight_page_idx" ON "services" USING btree ("highlight_page_id");
  CREATE INDEX "_services_v_version_highlight_version_highlight_page_idx" ON "_services_v" USING btree ("version_highlight_page_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_offer_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_offer_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_offer" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_offer_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_offer_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_offer_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_offer" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_offer_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_offer_items" CASCADE;
  DROP TABLE "pages_blocks_offer_items_locales" CASCADE;
  DROP TABLE "pages_blocks_offer" CASCADE;
  DROP TABLE "pages_blocks_offer_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_offer_items" CASCADE;
  DROP TABLE "_pages_v_blocks_offer_items_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_offer" CASCADE;
  DROP TABLE "_pages_v_blocks_offer_locales" CASCADE;
  ALTER TABLE "services" DROP CONSTRAINT "services_highlight_page_id_pages_id_fk";
  
  ALTER TABLE "_services_v" DROP CONSTRAINT "_services_v_version_highlight_page_id_pages_id_fk";
  
  DROP INDEX "services_highlight_highlight_page_idx";
  DROP INDEX "_services_v_version_highlight_version_highlight_page_idx";
  ALTER TABLE "services" DROP COLUMN "highlight_page_id";
  ALTER TABLE "services_locales" DROP COLUMN "highlight_kicker";
  ALTER TABLE "services_locales" DROP COLUMN "highlight_link_label";
  ALTER TABLE "services_locales" DROP COLUMN "highlight_heading";
  ALTER TABLE "services_locales" DROP COLUMN "highlight_text";
  ALTER TABLE "_services_v" DROP COLUMN "version_highlight_page_id";
  ALTER TABLE "_services_v_locales" DROP COLUMN "version_highlight_kicker";
  ALTER TABLE "_services_v_locales" DROP COLUMN "version_highlight_link_label";
  ALTER TABLE "_services_v_locales" DROP COLUMN "version_highlight_heading";
  ALTER TABLE "_services_v_locales" DROP COLUMN "version_highlight_text";
  DROP TYPE "public"."enum_pages_blocks_offer_style";
  DROP TYPE "public"."enum_pages_blocks_offer_unit";
  DROP TYPE "public"."enum__pages_v_blocks_offer_style";
  DROP TYPE "public"."enum__pages_v_blocks_offer_unit";`)
}
