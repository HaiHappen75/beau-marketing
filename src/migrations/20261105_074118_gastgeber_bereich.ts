import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_text_image_image_ratio" AS ENUM('landscape', 'square', 'portrait');
  CREATE TYPE "public"."enum_pages_blocks_tiles_style" AS ENUM('cards', 'box');
  CREATE TYPE "public"."enum_pages_blocks_tiles_tone" AS ENUM('white', 'offwhite');
  CREATE TYPE "public"."enum_pages_blocks_prose_tone" AS ENUM('white', 'offwhite');
  CREATE TYPE "public"."enum_pages_blocks_points_items_icon" AS ENUM('website', 'menu', 'phone', 'calendar', 'legal', 'languages', 'table', 'person', 'document', 'megaphone', 'controls', 'clock');
  CREATE TYPE "public"."enum_pages_blocks_points_style" AS ENUM('icons', 'steps');
  CREATE TYPE "public"."enum_pages_blocks_points_tone" AS ENUM('white', 'offwhite');
  CREATE TYPE "public"."enum_pages_blocks_pricing_offers_display" AS ENUM('card', 'row');
  CREATE TYPE "public"."enum_pages_blocks_pricing_offers_unit" AS ENUM('once', 'month', 'hour');
  CREATE TYPE "public"."enum__pages_v_blocks_text_image_image_ratio" AS ENUM('landscape', 'square', 'portrait');
  CREATE TYPE "public"."enum__pages_v_blocks_tiles_style" AS ENUM('cards', 'box');
  CREATE TYPE "public"."enum__pages_v_blocks_tiles_tone" AS ENUM('white', 'offwhite');
  CREATE TYPE "public"."enum__pages_v_blocks_prose_tone" AS ENUM('white', 'offwhite');
  CREATE TYPE "public"."enum__pages_v_blocks_points_items_icon" AS ENUM('website', 'menu', 'phone', 'calendar', 'legal', 'languages', 'table', 'person', 'document', 'megaphone', 'controls', 'clock');
  CREATE TYPE "public"."enum__pages_v_blocks_points_style" AS ENUM('icons', 'steps');
  CREATE TYPE "public"."enum__pages_v_blocks_points_tone" AS ENUM('white', 'offwhite');
  CREATE TYPE "public"."enum__pages_v_blocks_pricing_offers_display" AS ENUM('card', 'row');
  CREATE TYPE "public"."enum__pages_v_blocks_pricing_offers_unit" AS ENUM('once', 'month', 'hour');
  CREATE TABLE "pages_blocks_tiles_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"qr" boolean DEFAULT false,
  	"link_href" varchar
  );
  
  CREATE TABLE "pages_blocks_tiles_items_locales" (
  	"title" varchar,
  	"text" varchar,
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_tiles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"style" "enum_pages_blocks_tiles_style" DEFAULT 'cards',
  	"link_href" varchar,
  	"tone" "enum_pages_blocks_tiles_tone" DEFAULT 'white',
  	"de_only" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_tiles_locales" (
  	"kicker" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_prose" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tone" "enum_pages_blocks_prose_tone" DEFAULT 'white',
  	"de_only" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_prose_locales" (
  	"kicker" varchar,
  	"heading" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_points_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_pages_blocks_points_items_icon"
  );
  
  CREATE TABLE "pages_blocks_points_items_locales" (
  	"title" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"style" "enum_pages_blocks_points_style" DEFAULT 'icons',
  	"link_href" varchar,
  	"tone" "enum_pages_blocks_points_tone" DEFAULT 'white',
  	"de_only" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_points_locales" (
  	"kicker" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_pricing_offers_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pages_blocks_pricing_offers_items_locales" (
  	"item" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_pricing_offers" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"display" "enum_pages_blocks_pricing_offers_display" DEFAULT 'card',
  	"price" numeric,
  	"price_is_from" boolean DEFAULT false,
  	"unit" "enum_pages_blocks_pricing_offers_unit" DEFAULT 'once'
  );
  
  CREATE TABLE "pages_blocks_pricing_offers_locales" (
  	"name" varchar,
  	"note" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_pricing" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"primary_href" varchar,
  	"secondary_href" varchar,
  	"de_only" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_pricing_locales" (
  	"kicker" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"footnote" varchar,
  	"primary_label" varchar,
  	"secondary_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_tiles_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"qr" boolean DEFAULT false,
  	"link_href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_tiles_items_locales" (
  	"title" varchar,
  	"text" varchar,
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_tiles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"style" "enum__pages_v_blocks_tiles_style" DEFAULT 'cards',
  	"link_href" varchar,
  	"tone" "enum__pages_v_blocks_tiles_tone" DEFAULT 'white',
  	"de_only" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_tiles_locales" (
  	"kicker" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_prose" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"tone" "enum__pages_v_blocks_prose_tone" DEFAULT 'white',
  	"de_only" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_prose_locales" (
  	"kicker" varchar,
  	"heading" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_points_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__pages_v_blocks_points_items_icon",
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_points_items_locales" (
  	"title" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"style" "enum__pages_v_blocks_points_style" DEFAULT 'icons',
  	"link_href" varchar,
  	"tone" "enum__pages_v_blocks_points_tone" DEFAULT 'white',
  	"de_only" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_points_locales" (
  	"kicker" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_pricing_offers_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_pricing_offers_items_locales" (
  	"item" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_pricing_offers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"display" "enum__pages_v_blocks_pricing_offers_display" DEFAULT 'card',
  	"price" numeric,
  	"price_is_from" boolean DEFAULT false,
  	"unit" "enum__pages_v_blocks_pricing_offers_unit" DEFAULT 'once',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_pricing_offers_locales" (
  	"name" varchar,
  	"note" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_pricing" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"primary_href" varchar,
  	"secondary_href" varchar,
  	"de_only" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_pricing_locales" (
  	"kicker" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"footnote" varchar,
  	"primary_label" varchar,
  	"secondary_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "pages_blocks_text_image" ADD COLUMN "image_ratio" "enum_pages_blocks_text_image_image_ratio" DEFAULT 'landscape';
  ALTER TABLE "_pages_v_blocks_text_image" ADD COLUMN "image_ratio" "enum__pages_v_blocks_text_image_image_ratio" DEFAULT 'landscape';
  ALTER TABLE "pages_blocks_tiles_items" ADD CONSTRAINT "pages_blocks_tiles_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_tiles_items" ADD CONSTRAINT "pages_blocks_tiles_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_tiles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_tiles_items_locales" ADD CONSTRAINT "pages_blocks_tiles_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_tiles_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_tiles" ADD CONSTRAINT "pages_blocks_tiles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_tiles_locales" ADD CONSTRAINT "pages_blocks_tiles_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_tiles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_prose" ADD CONSTRAINT "pages_blocks_prose_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_prose_locales" ADD CONSTRAINT "pages_blocks_prose_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_prose"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_points_items" ADD CONSTRAINT "pages_blocks_points_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_points"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_points_items_locales" ADD CONSTRAINT "pages_blocks_points_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_points_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_points" ADD CONSTRAINT "pages_blocks_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_points_locales" ADD CONSTRAINT "pages_blocks_points_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_points"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_pricing_offers_items" ADD CONSTRAINT "pages_blocks_pricing_offers_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_pricing_offers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_pricing_offers_items_locales" ADD CONSTRAINT "pages_blocks_pricing_offers_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_pricing_offers_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_pricing_offers" ADD CONSTRAINT "pages_blocks_pricing_offers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_pricing"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_pricing_offers_locales" ADD CONSTRAINT "pages_blocks_pricing_offers_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_pricing_offers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_pricing" ADD CONSTRAINT "pages_blocks_pricing_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_pricing_locales" ADD CONSTRAINT "pages_blocks_pricing_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_pricing"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_tiles_items" ADD CONSTRAINT "_pages_v_blocks_tiles_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_tiles_items" ADD CONSTRAINT "_pages_v_blocks_tiles_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_tiles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_tiles_items_locales" ADD CONSTRAINT "_pages_v_blocks_tiles_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_tiles_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_tiles" ADD CONSTRAINT "_pages_v_blocks_tiles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_tiles_locales" ADD CONSTRAINT "_pages_v_blocks_tiles_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_tiles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_prose" ADD CONSTRAINT "_pages_v_blocks_prose_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_prose_locales" ADD CONSTRAINT "_pages_v_blocks_prose_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_prose"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_points_items" ADD CONSTRAINT "_pages_v_blocks_points_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_points"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_points_items_locales" ADD CONSTRAINT "_pages_v_blocks_points_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_points_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_points" ADD CONSTRAINT "_pages_v_blocks_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_points_locales" ADD CONSTRAINT "_pages_v_blocks_points_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_points"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_pricing_offers_items" ADD CONSTRAINT "_pages_v_blocks_pricing_offers_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_pricing_offers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_pricing_offers_items_locales" ADD CONSTRAINT "_pages_v_blocks_pricing_offers_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_pricing_offers_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_pricing_offers" ADD CONSTRAINT "_pages_v_blocks_pricing_offers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_pricing"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_pricing_offers_locales" ADD CONSTRAINT "_pages_v_blocks_pricing_offers_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_pricing_offers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_pricing" ADD CONSTRAINT "_pages_v_blocks_pricing_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_pricing_locales" ADD CONSTRAINT "_pages_v_blocks_pricing_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_pricing"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_tiles_items_order_idx" ON "pages_blocks_tiles_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_tiles_items_parent_id_idx" ON "pages_blocks_tiles_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_tiles_items_image_idx" ON "pages_blocks_tiles_items" USING btree ("image_id");
  CREATE UNIQUE INDEX "pages_blocks_tiles_items_locales_locale_parent_id_unique" ON "pages_blocks_tiles_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_tiles_order_idx" ON "pages_blocks_tiles" USING btree ("_order");
  CREATE INDEX "pages_blocks_tiles_parent_id_idx" ON "pages_blocks_tiles" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_tiles_path_idx" ON "pages_blocks_tiles" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_tiles_locales_locale_parent_id_unique" ON "pages_blocks_tiles_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_prose_order_idx" ON "pages_blocks_prose" USING btree ("_order");
  CREATE INDEX "pages_blocks_prose_parent_id_idx" ON "pages_blocks_prose" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_prose_path_idx" ON "pages_blocks_prose" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_prose_locales_locale_parent_id_unique" ON "pages_blocks_prose_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_points_items_order_idx" ON "pages_blocks_points_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_points_items_parent_id_idx" ON "pages_blocks_points_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_points_items_locales_locale_parent_id_unique" ON "pages_blocks_points_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_points_order_idx" ON "pages_blocks_points" USING btree ("_order");
  CREATE INDEX "pages_blocks_points_parent_id_idx" ON "pages_blocks_points" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_points_path_idx" ON "pages_blocks_points" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_points_locales_locale_parent_id_unique" ON "pages_blocks_points_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_pricing_offers_items_order_idx" ON "pages_blocks_pricing_offers_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_pricing_offers_items_parent_id_idx" ON "pages_blocks_pricing_offers_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_pricing_offers_items_locales_locale_parent_id_u" ON "pages_blocks_pricing_offers_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_pricing_offers_order_idx" ON "pages_blocks_pricing_offers" USING btree ("_order");
  CREATE INDEX "pages_blocks_pricing_offers_parent_id_idx" ON "pages_blocks_pricing_offers" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_pricing_offers_locales_locale_parent_id_unique" ON "pages_blocks_pricing_offers_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_pricing_order_idx" ON "pages_blocks_pricing" USING btree ("_order");
  CREATE INDEX "pages_blocks_pricing_parent_id_idx" ON "pages_blocks_pricing" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_pricing_path_idx" ON "pages_blocks_pricing" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_pricing_locales_locale_parent_id_unique" ON "pages_blocks_pricing_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_tiles_items_order_idx" ON "_pages_v_blocks_tiles_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_tiles_items_parent_id_idx" ON "_pages_v_blocks_tiles_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_tiles_items_image_idx" ON "_pages_v_blocks_tiles_items" USING btree ("image_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_tiles_items_locales_locale_parent_id_unique" ON "_pages_v_blocks_tiles_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_tiles_order_idx" ON "_pages_v_blocks_tiles" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_tiles_parent_id_idx" ON "_pages_v_blocks_tiles" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_tiles_path_idx" ON "_pages_v_blocks_tiles" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_tiles_locales_locale_parent_id_unique" ON "_pages_v_blocks_tiles_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_prose_order_idx" ON "_pages_v_blocks_prose" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_prose_parent_id_idx" ON "_pages_v_blocks_prose" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_prose_path_idx" ON "_pages_v_blocks_prose" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_prose_locales_locale_parent_id_unique" ON "_pages_v_blocks_prose_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_points_items_order_idx" ON "_pages_v_blocks_points_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_points_items_parent_id_idx" ON "_pages_v_blocks_points_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_points_items_locales_locale_parent_id_unique" ON "_pages_v_blocks_points_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_points_order_idx" ON "_pages_v_blocks_points" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_points_parent_id_idx" ON "_pages_v_blocks_points" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_points_path_idx" ON "_pages_v_blocks_points" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_points_locales_locale_parent_id_unique" ON "_pages_v_blocks_points_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_pricing_offers_items_order_idx" ON "_pages_v_blocks_pricing_offers_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_pricing_offers_items_parent_id_idx" ON "_pages_v_blocks_pricing_offers_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_pricing_offers_items_locales_locale_parent_i" ON "_pages_v_blocks_pricing_offers_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_pricing_offers_order_idx" ON "_pages_v_blocks_pricing_offers" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_pricing_offers_parent_id_idx" ON "_pages_v_blocks_pricing_offers" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_pricing_offers_locales_locale_parent_id_uniq" ON "_pages_v_blocks_pricing_offers_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_pricing_order_idx" ON "_pages_v_blocks_pricing" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_pricing_parent_id_idx" ON "_pages_v_blocks_pricing" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_pricing_path_idx" ON "_pages_v_blocks_pricing" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_pricing_locales_locale_parent_id_unique" ON "_pages_v_blocks_pricing_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE IF EXISTS "pages_blocks_tiles_items" CASCADE;
  DROP TABLE IF EXISTS "pages_blocks_tiles_items_locales" CASCADE;
  DROP TABLE IF EXISTS "pages_blocks_tiles" CASCADE;
  DROP TABLE IF EXISTS "pages_blocks_tiles_locales" CASCADE;
  DROP TABLE IF EXISTS "pages_blocks_prose" CASCADE;
  DROP TABLE IF EXISTS "pages_blocks_prose_locales" CASCADE;
  DROP TABLE IF EXISTS "pages_blocks_points_items" CASCADE;
  DROP TABLE IF EXISTS "pages_blocks_points_items_locales" CASCADE;
  DROP TABLE IF EXISTS "pages_blocks_points" CASCADE;
  DROP TABLE IF EXISTS "pages_blocks_points_locales" CASCADE;
  DROP TABLE IF EXISTS "pages_blocks_pricing_offers_items" CASCADE;
  DROP TABLE IF EXISTS "pages_blocks_pricing_offers_items_locales" CASCADE;
  DROP TABLE IF EXISTS "pages_blocks_pricing_offers" CASCADE;
  DROP TABLE IF EXISTS "pages_blocks_pricing_offers_locales" CASCADE;
  DROP TABLE IF EXISTS "pages_blocks_pricing" CASCADE;
  DROP TABLE IF EXISTS "pages_blocks_pricing_locales" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_tiles_items" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_tiles_items_locales" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_tiles" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_tiles_locales" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_prose" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_prose_locales" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_points_items" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_points_items_locales" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_points" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_points_locales" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_pricing_offers_items" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_pricing_offers_items_locales" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_pricing_offers" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_pricing_offers_locales" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_pricing" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_pricing_locales" CASCADE;
  ALTER TABLE IF EXISTS "pages_blocks_text_image" DROP COLUMN IF EXISTS "image_ratio";
  ALTER TABLE IF EXISTS "_pages_v_blocks_text_image" DROP COLUMN IF EXISTS "image_ratio";
  DROP TYPE IF EXISTS "public"."enum_pages_blocks_text_image_image_ratio";
  DROP TYPE IF EXISTS "public"."enum_pages_blocks_tiles_style";
  DROP TYPE IF EXISTS "public"."enum_pages_blocks_tiles_tone";
  DROP TYPE IF EXISTS "public"."enum_pages_blocks_prose_tone";
  DROP TYPE IF EXISTS "public"."enum_pages_blocks_points_items_icon";
  DROP TYPE IF EXISTS "public"."enum_pages_blocks_points_style";
  DROP TYPE IF EXISTS "public"."enum_pages_blocks_points_tone";
  DROP TYPE IF EXISTS "public"."enum_pages_blocks_pricing_offers_display";
  DROP TYPE IF EXISTS "public"."enum_pages_blocks_pricing_offers_unit";
  DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_text_image_image_ratio";
  DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_tiles_style";
  DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_tiles_tone";
  DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_prose_tone";
  DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_points_items_icon";
  DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_points_style";
  DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_points_tone";
  DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_pricing_offers_display";
  DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_pricing_offers_unit";`)
}
