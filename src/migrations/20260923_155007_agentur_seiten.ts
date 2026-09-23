import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_hero_checks_kind" AS ENUM('service', 'text');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_checks_kind" AS ENUM('service', 'text');
  CREATE TYPE "public"."enum_services_packages_display" AS ENUM('card', 'box');
  CREATE TYPE "public"."enum__services_v_version_packages_display" AS ENUM('card', 'box');
  CREATE TABLE "pages_blocks_hero_checks" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kind" "enum_pages_blocks_hero_checks_kind" DEFAULT 'service',
  	"service_id" integer
  );
  
  CREATE TABLE "pages_blocks_hero_checks_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_price_table" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_price_table_locales" (
  	"kicker" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_contact_form" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_contact_form_locales" (
  	"heading" varchar,
  	"intro" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_hero_checks" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"kind" "enum__pages_v_blocks_hero_checks_kind" DEFAULT 'service',
  	"service_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_hero_checks_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_price_table" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_price_table_locales" (
  	"kicker" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_contact_form" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_contact_form_locales" (
  	"heading" varchar,
  	"intro" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "services_deliverables_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "services_deliverables_items_locales" (
  	"item" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "services_in_house_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "services_in_house_items_locales" (
  	"item" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "_services_v_version_deliverables_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_v_version_deliverables_items_locales" (
  	"item" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_services_v_version_in_house_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_v_version_in_house_items_locales" (
  	"item" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "trust_badges_locales" (
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  ALTER TABLE "pages_blocks_hero" ADD COLUMN "caption_name" varchar;
  ALTER TABLE "pages_blocks_hero_locales" ADD COLUMN "caption_text" varchar;
  ALTER TABLE "pages_blocks_hero_locales" ADD COLUMN "note" varchar;
  ALTER TABLE "pages_blocks_engagement_band" ADD COLUMN "link_href" varchar;
  ALTER TABLE "pages_blocks_engagement_band_locales" ADD COLUMN "text" varchar;
  ALTER TABLE "pages_blocks_engagement_band_locales" ADD COLUMN "link_label" varchar;
  ALTER TABLE "_pages_v_blocks_hero" ADD COLUMN "caption_name" varchar;
  ALTER TABLE "_pages_v_blocks_hero_locales" ADD COLUMN "caption_text" varchar;
  ALTER TABLE "_pages_v_blocks_hero_locales" ADD COLUMN "note" varchar;
  ALTER TABLE "_pages_v_blocks_engagement_band" ADD COLUMN "link_href" varchar;
  ALTER TABLE "_pages_v_blocks_engagement_band_locales" ADD COLUMN "text" varchar;
  ALTER TABLE "_pages_v_blocks_engagement_band_locales" ADD COLUMN "link_label" varchar;
  -- Existing package rows stay NULL (= card) so the fill-only seed can still mark
  -- e.g. the Pflichtangaben-Update as a box; the default applies to new rows only.
  ALTER TABLE "services_packages" ADD COLUMN "display" "enum_services_packages_display";
  ALTER TABLE "services_packages" ALTER COLUMN "display" SET DEFAULT 'card';
  ALTER TABLE "services_packages_locales" ADD COLUMN "kicker" varchar;
  ALTER TABLE "services_packages_locales" ADD COLUMN "description" varchar;
  ALTER TABLE "services" ADD COLUMN "aftercare_service_id" integer;
  ALTER TABLE "services" ADD COLUMN "aftercare_package_name" varchar;
  ALTER TABLE "services" ADD COLUMN "in_house_image_id" integer;
  ALTER TABLE "services" ADD COLUMN "in_house_url" varchar;
  ALTER TABLE "services" ADD COLUMN "hero_image_id" integer;
  ALTER TABLE "services_locales" ADD COLUMN "short_label" varchar;
  ALTER TABLE "services_locales" ADD COLUMN "teaser" varchar;
  ALTER TABLE "services_locales" ADD COLUMN "headline" varchar;
  ALTER TABLE "services_locales" ADD COLUMN "deliverables_heading" varchar;
  ALTER TABLE "services_locales" ADD COLUMN "deliverables_text" varchar;
  ALTER TABLE "services_locales" ADD COLUMN "in_house_heading" varchar;
  ALTER TABLE "services_locales" ADD COLUMN "in_house_text" varchar;
  ALTER TABLE "services_locales" ADD COLUMN "in_house_link_label" varchar;
  ALTER TABLE "_services_v_version_packages" ADD COLUMN "display" "enum__services_v_version_packages_display";
  ALTER TABLE "_services_v_version_packages" ALTER COLUMN "display" SET DEFAULT 'card';
  ALTER TABLE "_services_v_version_packages_locales" ADD COLUMN "kicker" varchar;
  ALTER TABLE "_services_v_version_packages_locales" ADD COLUMN "description" varchar;
  ALTER TABLE "_services_v" ADD COLUMN "version_aftercare_service_id" integer;
  ALTER TABLE "_services_v" ADD COLUMN "version_aftercare_package_name" varchar;
  ALTER TABLE "_services_v" ADD COLUMN "version_in_house_image_id" integer;
  ALTER TABLE "_services_v" ADD COLUMN "version_in_house_url" varchar;
  ALTER TABLE "_services_v" ADD COLUMN "version_hero_image_id" integer;
  ALTER TABLE "_services_v_locales" ADD COLUMN "version_short_label" varchar;
  ALTER TABLE "_services_v_locales" ADD COLUMN "version_teaser" varchar;
  ALTER TABLE "_services_v_locales" ADD COLUMN "version_headline" varchar;
  ALTER TABLE "_services_v_locales" ADD COLUMN "version_deliverables_heading" varchar;
  ALTER TABLE "_services_v_locales" ADD COLUMN "version_deliverables_text" varchar;
  ALTER TABLE "_services_v_locales" ADD COLUMN "version_in_house_heading" varchar;
  ALTER TABLE "_services_v_locales" ADD COLUMN "version_in_house_text" varchar;
  ALTER TABLE "_services_v_locales" ADD COLUMN "version_in_house_link_label" varchar;
  ALTER TABLE "pages_blocks_hero_checks" ADD CONSTRAINT "pages_blocks_hero_checks_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_checks" ADD CONSTRAINT "pages_blocks_hero_checks_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_checks_locales" ADD CONSTRAINT "pages_blocks_hero_checks_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hero_checks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_price_table" ADD CONSTRAINT "pages_blocks_price_table_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_price_table_locales" ADD CONSTRAINT "pages_blocks_price_table_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_price_table"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_contact_form" ADD CONSTRAINT "pages_blocks_contact_form_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_contact_form_locales" ADD CONSTRAINT "pages_blocks_contact_form_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_contact_form"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_checks" ADD CONSTRAINT "_pages_v_blocks_hero_checks_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_checks" ADD CONSTRAINT "_pages_v_blocks_hero_checks_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_checks_locales" ADD CONSTRAINT "_pages_v_blocks_hero_checks_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_hero_checks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_price_table" ADD CONSTRAINT "_pages_v_blocks_price_table_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_price_table_locales" ADD CONSTRAINT "_pages_v_blocks_price_table_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_price_table"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_contact_form" ADD CONSTRAINT "_pages_v_blocks_contact_form_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_contact_form_locales" ADD CONSTRAINT "_pages_v_blocks_contact_form_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_contact_form"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_deliverables_items" ADD CONSTRAINT "services_deliverables_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_deliverables_items_locales" ADD CONSTRAINT "services_deliverables_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_deliverables_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_in_house_items" ADD CONSTRAINT "services_in_house_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_in_house_items_locales" ADD CONSTRAINT "services_in_house_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_in_house_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_deliverables_items" ADD CONSTRAINT "_services_v_version_deliverables_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_deliverables_items_locales" ADD CONSTRAINT "_services_v_version_deliverables_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v_version_deliverables_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_in_house_items" ADD CONSTRAINT "_services_v_version_in_house_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_in_house_items_locales" ADD CONSTRAINT "_services_v_version_in_house_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v_version_in_house_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "trust_badges_locales" ADD CONSTRAINT "trust_badges_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."trust_badges"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_hero_checks_order_idx" ON "pages_blocks_hero_checks" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_checks_parent_id_idx" ON "pages_blocks_hero_checks" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_checks_service_idx" ON "pages_blocks_hero_checks" USING btree ("service_id");
  CREATE UNIQUE INDEX "pages_blocks_hero_checks_locales_locale_parent_id_unique" ON "pages_blocks_hero_checks_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_price_table_order_idx" ON "pages_blocks_price_table" USING btree ("_order");
  CREATE INDEX "pages_blocks_price_table_parent_id_idx" ON "pages_blocks_price_table" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_price_table_path_idx" ON "pages_blocks_price_table" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_price_table_locales_locale_parent_id_unique" ON "pages_blocks_price_table_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_contact_form_order_idx" ON "pages_blocks_contact_form" USING btree ("_order");
  CREATE INDEX "pages_blocks_contact_form_parent_id_idx" ON "pages_blocks_contact_form" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_contact_form_path_idx" ON "pages_blocks_contact_form" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_contact_form_locales_locale_parent_id_unique" ON "pages_blocks_contact_form_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_checks_order_idx" ON "_pages_v_blocks_hero_checks" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_checks_parent_id_idx" ON "_pages_v_blocks_hero_checks" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_checks_service_idx" ON "_pages_v_blocks_hero_checks" USING btree ("service_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_hero_checks_locales_locale_parent_id_unique" ON "_pages_v_blocks_hero_checks_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_price_table_order_idx" ON "_pages_v_blocks_price_table" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_price_table_parent_id_idx" ON "_pages_v_blocks_price_table" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_price_table_path_idx" ON "_pages_v_blocks_price_table" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_price_table_locales_locale_parent_id_unique" ON "_pages_v_blocks_price_table_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_contact_form_order_idx" ON "_pages_v_blocks_contact_form" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_contact_form_parent_id_idx" ON "_pages_v_blocks_contact_form" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_contact_form_path_idx" ON "_pages_v_blocks_contact_form" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_contact_form_locales_locale_parent_id_unique" ON "_pages_v_blocks_contact_form_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "services_deliverables_items_order_idx" ON "services_deliverables_items" USING btree ("_order");
  CREATE INDEX "services_deliverables_items_parent_id_idx" ON "services_deliverables_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "services_deliverables_items_locales_locale_parent_id_unique" ON "services_deliverables_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "services_in_house_items_order_idx" ON "services_in_house_items" USING btree ("_order");
  CREATE INDEX "services_in_house_items_parent_id_idx" ON "services_in_house_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "services_in_house_items_locales_locale_parent_id_unique" ON "services_in_house_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_services_v_version_deliverables_items_order_idx" ON "_services_v_version_deliverables_items" USING btree ("_order");
  CREATE INDEX "_services_v_version_deliverables_items_parent_id_idx" ON "_services_v_version_deliverables_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_services_v_version_deliverables_items_locales_locale_parent" ON "_services_v_version_deliverables_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_services_v_version_in_house_items_order_idx" ON "_services_v_version_in_house_items" USING btree ("_order");
  CREATE INDEX "_services_v_version_in_house_items_parent_id_idx" ON "_services_v_version_in_house_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_services_v_version_in_house_items_locales_locale_parent_id_" ON "_services_v_version_in_house_items_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "trust_badges_locales_locale_parent_id_unique" ON "trust_badges_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "services" ADD CONSTRAINT "services_aftercare_service_id_services_id_fk" FOREIGN KEY ("aftercare_service_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services" ADD CONSTRAINT "services_in_house_image_id_media_id_fk" FOREIGN KEY ("in_house_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services" ADD CONSTRAINT "services_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_services_v" ADD CONSTRAINT "_services_v_version_aftercare_service_id_services_id_fk" FOREIGN KEY ("version_aftercare_service_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_services_v" ADD CONSTRAINT "_services_v_version_in_house_image_id_media_id_fk" FOREIGN KEY ("version_in_house_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_services_v" ADD CONSTRAINT "_services_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "services_aftercare_aftercare_service_idx" ON "services" USING btree ("aftercare_service_id");
  CREATE INDEX "services_in_house_in_house_image_idx" ON "services" USING btree ("in_house_image_id");
  CREATE INDEX "services_hero_image_idx" ON "services" USING btree ("hero_image_id");
  CREATE INDEX "_services_v_version_aftercare_version_aftercare_service_idx" ON "_services_v" USING btree ("version_aftercare_service_id");
  CREATE INDEX "_services_v_version_in_house_version_in_house_image_idx" ON "_services_v" USING btree ("version_in_house_image_id");
  CREATE INDEX "_services_v_version_version_hero_image_idx" ON "_services_v" USING btree ("version_hero_image_id");
  ALTER TABLE "services_locales" DROP COLUMN "scope";
  ALTER TABLE "_services_v_locales" DROP COLUMN "version_scope";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_hero_checks" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_hero_checks_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_price_table" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_price_table_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_contact_form" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_contact_form_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_hero_checks" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_hero_checks_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_price_table" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_price_table_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_contact_form" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_contact_form_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_deliverables_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_deliverables_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_in_house_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_in_house_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_version_deliverables_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_version_deliverables_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_version_in_house_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_version_in_house_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "trust_badges_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_hero_checks" CASCADE;
  DROP TABLE "pages_blocks_hero_checks_locales" CASCADE;
  DROP TABLE "pages_blocks_price_table" CASCADE;
  DROP TABLE "pages_blocks_price_table_locales" CASCADE;
  DROP TABLE "pages_blocks_contact_form" CASCADE;
  DROP TABLE "pages_blocks_contact_form_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_hero_checks" CASCADE;
  DROP TABLE "_pages_v_blocks_hero_checks_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_price_table" CASCADE;
  DROP TABLE "_pages_v_blocks_price_table_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_contact_form" CASCADE;
  DROP TABLE "_pages_v_blocks_contact_form_locales" CASCADE;
  DROP TABLE "services_deliverables_items" CASCADE;
  DROP TABLE "services_deliverables_items_locales" CASCADE;
  DROP TABLE "services_in_house_items" CASCADE;
  DROP TABLE "services_in_house_items_locales" CASCADE;
  DROP TABLE "_services_v_version_deliverables_items" CASCADE;
  DROP TABLE "_services_v_version_deliverables_items_locales" CASCADE;
  DROP TABLE "_services_v_version_in_house_items" CASCADE;
  DROP TABLE "_services_v_version_in_house_items_locales" CASCADE;
  DROP TABLE "trust_badges_locales" CASCADE;
  ALTER TABLE "services" DROP CONSTRAINT IF EXISTS "services_aftercare_service_id_services_id_fk";
  
  ALTER TABLE "services" DROP CONSTRAINT IF EXISTS "services_in_house_image_id_media_id_fk";
  
  ALTER TABLE "services" DROP CONSTRAINT IF EXISTS "services_hero_image_id_media_id_fk";
  
  ALTER TABLE "_services_v" DROP CONSTRAINT IF EXISTS "_services_v_version_aftercare_service_id_services_id_fk";
  
  ALTER TABLE "_services_v" DROP CONSTRAINT IF EXISTS "_services_v_version_in_house_image_id_media_id_fk";
  
  ALTER TABLE "_services_v" DROP CONSTRAINT IF EXISTS "_services_v_version_hero_image_id_media_id_fk";
  
  DROP INDEX IF EXISTS "services_aftercare_aftercare_service_idx";
  DROP INDEX IF EXISTS "services_in_house_in_house_image_idx";
  DROP INDEX IF EXISTS "services_hero_image_idx";
  DROP INDEX IF EXISTS "_services_v_version_aftercare_version_aftercare_service_idx";
  DROP INDEX IF EXISTS "_services_v_version_in_house_version_in_house_image_idx";
  DROP INDEX IF EXISTS "_services_v_version_version_hero_image_idx";
  ALTER TABLE "services_locales" ADD COLUMN "scope" jsonb;
  ALTER TABLE "_services_v_locales" ADD COLUMN "version_scope" jsonb;
  ALTER TABLE "pages_blocks_hero" DROP COLUMN "caption_name";
  ALTER TABLE "pages_blocks_hero_locales" DROP COLUMN "caption_text";
  ALTER TABLE "pages_blocks_hero_locales" DROP COLUMN "note";
  ALTER TABLE "pages_blocks_engagement_band" DROP COLUMN "link_href";
  ALTER TABLE "pages_blocks_engagement_band_locales" DROP COLUMN "text";
  ALTER TABLE "pages_blocks_engagement_band_locales" DROP COLUMN "link_label";
  ALTER TABLE "_pages_v_blocks_hero" DROP COLUMN "caption_name";
  ALTER TABLE "_pages_v_blocks_hero_locales" DROP COLUMN "caption_text";
  ALTER TABLE "_pages_v_blocks_hero_locales" DROP COLUMN "note";
  ALTER TABLE "_pages_v_blocks_engagement_band" DROP COLUMN "link_href";
  ALTER TABLE "_pages_v_blocks_engagement_band_locales" DROP COLUMN "text";
  ALTER TABLE "_pages_v_blocks_engagement_band_locales" DROP COLUMN "link_label";
  ALTER TABLE "services_packages" DROP COLUMN "display";
  ALTER TABLE "services_packages_locales" DROP COLUMN "kicker";
  ALTER TABLE "services_packages_locales" DROP COLUMN "description";
  ALTER TABLE "services" DROP COLUMN "aftercare_service_id";
  ALTER TABLE "services" DROP COLUMN "aftercare_package_name";
  ALTER TABLE "services" DROP COLUMN "in_house_image_id";
  ALTER TABLE "services" DROP COLUMN "in_house_url";
  ALTER TABLE "services" DROP COLUMN "hero_image_id";
  ALTER TABLE "services_locales" DROP COLUMN "short_label";
  ALTER TABLE "services_locales" DROP COLUMN "teaser";
  ALTER TABLE "services_locales" DROP COLUMN "headline";
  ALTER TABLE "services_locales" DROP COLUMN "deliverables_heading";
  ALTER TABLE "services_locales" DROP COLUMN "deliverables_text";
  ALTER TABLE "services_locales" DROP COLUMN "in_house_heading";
  ALTER TABLE "services_locales" DROP COLUMN "in_house_text";
  ALTER TABLE "services_locales" DROP COLUMN "in_house_link_label";
  ALTER TABLE "_services_v_version_packages" DROP COLUMN "display";
  ALTER TABLE "_services_v_version_packages_locales" DROP COLUMN "kicker";
  ALTER TABLE "_services_v_version_packages_locales" DROP COLUMN "description";
  ALTER TABLE "_services_v" DROP COLUMN "version_aftercare_service_id";
  ALTER TABLE "_services_v" DROP COLUMN "version_aftercare_package_name";
  ALTER TABLE "_services_v" DROP COLUMN "version_in_house_image_id";
  ALTER TABLE "_services_v" DROP COLUMN "version_in_house_url";
  ALTER TABLE "_services_v" DROP COLUMN "version_hero_image_id";
  ALTER TABLE "_services_v_locales" DROP COLUMN "version_short_label";
  ALTER TABLE "_services_v_locales" DROP COLUMN "version_teaser";
  ALTER TABLE "_services_v_locales" DROP COLUMN "version_headline";
  ALTER TABLE "_services_v_locales" DROP COLUMN "version_deliverables_heading";
  ALTER TABLE "_services_v_locales" DROP COLUMN "version_deliverables_text";
  ALTER TABLE "_services_v_locales" DROP COLUMN "version_in_house_heading";
  ALTER TABLE "_services_v_locales" DROP COLUMN "version_in_house_text";
  ALTER TABLE "_services_v_locales" DROP COLUMN "version_in_house_link_label";
  DROP TYPE "public"."enum_pages_blocks_hero_checks_kind";
  DROP TYPE "public"."enum__pages_v_blocks_hero_checks_kind";
  DROP TYPE "public"."enum_services_packages_display";
  DROP TYPE "public"."enum__services_v_version_packages_display";`)
}
