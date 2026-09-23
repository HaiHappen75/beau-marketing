import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_text_image_image_position" AS ENUM('right', 'left');
  CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_blocks_text_image_image_position" AS ENUM('right', 'left');
  CREATE TYPE "public"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_published_locale" AS ENUM('de', 'en', 'da');
  CREATE TYPE "public"."enum_services_packages_unit" AS ENUM('once', 'month', 'hour');
  CREATE TYPE "public"."enum_services_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__services_v_version_packages_unit" AS ENUM('once', 'month', 'hour');
  CREATE TYPE "public"."enum__services_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__services_v_published_locale" AS ENUM('de', 'en', 'da');
  CREATE TYPE "public"."enum_locations_local_reference_type" AS ENUM('case', 'regional');
  CREATE TYPE "public"."enum_locations_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__locations_v_version_local_reference_type" AS ENUM('case', 'regional');
  CREATE TYPE "public"."enum__locations_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__locations_v_published_locale" AS ENUM('de', 'en', 'da');
  CREATE TYPE "public"."enum_cases_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__cases_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__cases_v_published_locale" AS ENUM('de', 'en', 'da');
  CREATE TYPE "public"."enum_brands_status" AS ENUM('live', 'beta', 'development', 'hidden');
  CREATE TYPE "public"."enum_posts_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__posts_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__posts_v_published_locale" AS ENUM('de', 'en', 'da');
  CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'redaktion');
  CREATE TABLE "pages_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"primary_href" varchar,
  	"secondary_href" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_hero_locales" (
  	"kicker" varchar,
  	"heading" varchar,
  	"text" varchar,
  	"primary_label" varchar,
  	"secondary_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_service_tiles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_service_tiles_locales" (
  	"kicker" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_packages" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_packages_locales" (
  	"kicker" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_case_teaser" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_case_teaser_locales" (
  	"kicker" varchar,
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_brand_showcase" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_brand_showcase_locales" (
  	"kicker" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_trust_bar" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_trust_bar_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_engagement_band" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_engagement_band_locales" (
  	"kicker" varchar,
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_post_teaser" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_post_teaser_locales" (
  	"kicker" varchar,
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pages_blocks_faq_items_locales" (
  	"question" varchar,
  	"answer" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_faq_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"button_href" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_cta_locales" (
  	"heading" varchar,
  	"text" varchar,
  	"button_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_text_image" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"image_position" "enum_pages_blocks_text_image_image_position" DEFAULT 'right',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_text_image_locales" (
  	"kicker" varchar,
  	"heading" varchar,
  	"body" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "pages_locales" (
  	"title" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "pages_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"cases_id" integer
  );
  
  CREATE TABLE "_pages_v_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"primary_href" varchar,
  	"secondary_href" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_hero_locales" (
  	"kicker" varchar,
  	"heading" varchar,
  	"text" varchar,
  	"primary_label" varchar,
  	"secondary_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_service_tiles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_service_tiles_locales" (
  	"kicker" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_packages" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_packages_locales" (
  	"kicker" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_case_teaser" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_case_teaser_locales" (
  	"kicker" varchar,
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_brand_showcase" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_brand_showcase_locales" (
  	"kicker" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_trust_bar" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_trust_bar_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_engagement_band" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_engagement_band_locales" (
  	"kicker" varchar,
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_post_teaser" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_post_teaser_locales" (
  	"kicker" varchar,
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_faq_items_locales" (
  	"question" varchar,
  	"answer" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_faq_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"button_href" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_cta_locales" (
  	"heading" varchar,
  	"text" varchar,
  	"button_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_text_image" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"image_position" "enum__pages_v_blocks_text_image_image_position" DEFAULT 'right',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_text_image_locales" (
  	"kicker" varchar,
  	"heading" varchar,
  	"body" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__pages_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_pages_v_locales" (
  	"version_title" varchar,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"cases_id" integer
  );
  
  CREATE TABLE "services_packages_includes" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "services_packages_includes_locales" (
  	"item" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "services_packages" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"price" numeric,
  	"price_is_from" boolean DEFAULT true,
  	"unit" "enum_services_packages_unit" DEFAULT 'once'
  );
  
  CREATE TABLE "services_packages_locales" (
  	"name" varchar,
  	"term" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "services_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "services_steps_locales" (
  	"title" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "services_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "services_faq_locales" (
  	"question" varchar,
  	"answer" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "services" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_services_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "services_locales" (
  	"title" varchar,
  	"short_description" varchar,
  	"promise" varchar,
  	"scope" jsonb,
  	"cta_heading" varchar,
  	"cta_button_label" varchar,
  	"cta_text" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "services_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"cases_id" integer,
  	"posts_id" integer
  );
  
  CREATE TABLE "_services_v_version_packages_includes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_v_version_packages_includes_locales" (
  	"item" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_services_v_version_packages" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"price" numeric,
  	"price_is_from" boolean DEFAULT true,
  	"unit" "enum__services_v_version_packages_unit" DEFAULT 'once',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_v_version_packages_locales" (
  	"name" varchar,
  	"term" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_services_v_version_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_v_version_steps_locales" (
  	"title" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_services_v_version_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_v_version_faq_locales" (
  	"question" varchar,
  	"answer" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_services_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_order" numeric DEFAULT 0,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__services_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__services_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_services_v_locales" (
  	"version_title" varchar,
  	"version_short_description" varchar,
  	"version_promise" varchar,
  	"version_scope" jsonb,
  	"version_cta_heading" varchar,
  	"version_cta_button_label" varchar,
  	"version_cta_text" varchar,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_services_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"cases_id" integer,
  	"posts_id" integer
  );
  
  CREATE TABLE "locations_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "locations_faq_locales" (
  	"question" varchar,
  	"answer" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "locations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"place" varchar,
  	"region" varchar,
  	"service_id" integer,
  	"local_reference_type" "enum_locations_local_reference_type",
  	"local_reference_case_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_locations_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "locations_locales" (
  	"title" varchar,
  	"intro" varchar,
  	"local_reference_regional_note" varchar,
  	"visit_info" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_locations_v_version_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_locations_v_version_faq_locales" (
  	"question" varchar,
  	"answer" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_locations_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_place" varchar,
  	"version_region" varchar,
  	"version_service_id" integer,
  	"version_local_reference_type" "enum__locations_v_version_local_reference_type",
  	"version_local_reference_case_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__locations_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__locations_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_locations_v_locales" (
  	"version_title" varchar,
  	"version_intro" varchar,
  	"version_local_reference_regional_note" varchar,
  	"version_visit_info" varchar,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "cases_chips" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "cases_chips_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "cases_figures" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "cases_figures_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "cases" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"client" varchar,
  	"slug" varchar,
  	"place" varchar,
  	"url" varchar,
  	"has_detail_page" boolean DEFAULT false,
  	"featured_on_home" boolean DEFAULT false,
  	"order" numeric DEFAULT 0,
  	"quote_name" varchar,
  	"release_date" timestamp(3) with time zone,
  	"release_note" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_cases_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "cases_locales" (
  	"industry" varchar,
  	"challenge" jsonb,
  	"solution" jsonb,
  	"result" jsonb,
  	"quote_text" varchar,
  	"quote_role" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "cases_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"services_id" integer,
  	"media_id" integer
  );
  
  CREATE TABLE "_cases_v_version_chips" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_cases_v_version_chips_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_cases_v_version_figures" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_cases_v_version_figures_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_cases_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_client" varchar,
  	"version_slug" varchar,
  	"version_place" varchar,
  	"version_url" varchar,
  	"version_has_detail_page" boolean DEFAULT false,
  	"version_featured_on_home" boolean DEFAULT false,
  	"version_order" numeric DEFAULT 0,
  	"version_quote_name" varchar,
  	"version_release_date" timestamp(3) with time zone,
  	"version_release_note" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__cases_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__cases_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_cases_v_locales" (
  	"version_industry" varchar,
  	"version_challenge" jsonb,
  	"version_solution" jsonb,
  	"version_result" jsonb,
  	"version_quote_text" varchar,
  	"version_quote_role" varchar,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_cases_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"services_id" integer,
  	"media_id" integer
  );
  
  CREATE TABLE "engagements" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"institution" varchar NOT NULL,
  	"place" varchar,
  	"years" varchar,
  	"link" varchar,
  	"logo_id" integer,
  	"logo_permission" boolean DEFAULT false,
  	"visible" boolean DEFAULT true,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "engagements_locales" (
  	"kind" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "engagements_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "posts_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "posts_faq_locales" (
  	"question" varchar,
  	"answer" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "posts_sources" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"url" varchar
  );
  
  CREATE TABLE "posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"category_id" integer,
  	"service_id" integer,
  	"author_id" integer,
  	"hero_image_id" integer,
  	"social_image_id" integer,
  	"published_at" timestamp(3) with time zone,
  	"content_updated_at" timestamp(3) with time zone,
  	"reviewed_at" timestamp(3) with time zone,
  	"editorial_focus_keyword" varchar,
  	"editorial_dossier_link" varchar,
  	"noindex" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_posts_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "posts_locales" (
  	"title" varchar,
  	"short_answer" varchar,
  	"excerpt" varchar,
  	"content" jsonb,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "posts_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"posts_id" integer
  );
  
  CREATE TABLE "_posts_v_version_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_posts_v_version_faq_locales" (
  	"question" varchar,
  	"answer" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_posts_v_version_sources" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_posts_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_category_id" integer,
  	"version_service_id" integer,
  	"version_author_id" integer,
  	"version_hero_image_id" integer,
  	"version_social_image_id" integer,
  	"version_published_at" timestamp(3) with time zone,
  	"version_content_updated_at" timestamp(3) with time zone,
  	"version_reviewed_at" timestamp(3) with time zone,
  	"version_editorial_focus_keyword" varchar,
  	"version_editorial_dossier_link" varchar,
  	"version_noindex" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__posts_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__posts_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_posts_v_locales" (
  	"version_title" varchar,
  	"version_short_answer" varchar,
  	"version_excerpt" varchar,
  	"version_content" jsonb,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_posts_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"posts_id" integer
  );
  
  CREATE TABLE "categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"order" numeric DEFAULT 0,
  	"noindex" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "categories_locales" (
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "authors_same_as" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "authors" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar,
  	"photo_id" integer,
  	"user_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "authors_locales" (
  	"role" varchar,
  	"bio" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "site_settings_company_area_served" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL
  );
  
  CREATE TABLE "navigation_header" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"href" varchar NOT NULL
  );
  
  CREATE TABLE "navigation_header_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "navigation_footer_legal" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"href" varchar NOT NULL
  );
  
  CREATE TABLE "navigation_footer_legal_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "navigation" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "trust_badges" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"href" varchar,
  	"image_id" integer NOT NULL
  );
  
  CREATE TABLE "trust" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"shopify_badge_id" integer,
  	"google_reviews_show" boolean DEFAULT false,
  	"google_reviews_rating" numeric,
  	"google_reviews_count" numeric,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "trust_locales" (
  	"server_note" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_agb_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_last_updated" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_agb_v_locales" (
  	"version_title" varchar DEFAULT 'AGB',
  	"version_content" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_widerruf_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_last_updated" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_widerruf_v_locales" (
  	"version_title" varchar DEFAULT 'Widerrufsbelehrung',
  	"version_content" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "site_settings_nav" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_nav_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_social" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "impressum" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "impressum_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "datenschutz" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "datenschutz_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "site_settings_nav" CASCADE;
  DROP TABLE "site_settings_nav_locales" CASCADE;
  DROP TABLE "site_settings_social" CASCADE;
  DROP TABLE "impressum" CASCADE;
  DROP TABLE "impressum_locales" CASCADE;
  DROP TABLE "datenschutz" CASCADE;
  DROP TABLE "datenschutz_locales" CASCADE;
  ALTER TABLE "site_settings" ALTER COLUMN "site_name" SET DEFAULT 'Beau Marketing';
  ALTER TABLE "brands" ADD COLUMN "status" "enum_brands_status";
  -- Credit prefill applies to NEW uploads only: existing uploads stay empty and
  -- get their real credit in the admin (columns first, defaults afterwards).
  ALTER TABLE "media" ADD COLUMN "credit_author" varchar;
  ALTER TABLE "media" ADD COLUMN "credit_source" varchar;
  ALTER TABLE "media" ADD COLUMN "credit_license" varchar;
  ALTER TABLE "media" ALTER COLUMN "credit_author" SET DEFAULT 'Stephan Beau';
  ALTER TABLE "media" ALTER COLUMN "credit_source" SET DEFAULT 'eigene Aufnahme';
  ALTER TABLE "media" ALTER COLUMN "credit_license" SET DEFAULT 'alle Rechte vorbehalten';
  ALTER TABLE "users" ADD COLUMN "username" varchar;
  ALTER TABLE "users" ADD COLUMN "first_name" varchar;
  ALTER TABLE "users" ADD COLUMN "last_name" varchar;
  ALTER TABLE "users" ADD COLUMN "role" "enum_users_role";
  -- Backfill existing accounts (idempotent: only rows not yet filled).
  -- Every login that exists before the redesign is an admin account.
  UPDATE "users" SET "role" = 'admin' WHERE "role" IS NULL;
  -- Username = local part of the e-mail; the id is appended only on a collision.
  UPDATE "users" u SET "username" = CASE
      WHEN (SELECT count(*) FROM "users" o WHERE split_part(o."email", '@', 1) = split_part(u."email", '@', 1)) > 1
        THEN split_part(u."email", '@', 1) || '-' || u."id"
      ELSE split_part(u."email", '@', 1)
    END
    WHERE u."username" IS NULL;
  -- Name split at the LAST space: before = first name, after = last name;
  -- without a space everything goes to the last name.
  UPDATE "users" SET
      "first_name" = CASE WHEN position(' ' in btrim("name")) > 0
        THEN btrim(regexp_replace(btrim("name"), '\\s+\\S+$', '')) END,
      "last_name" = CASE WHEN position(' ' in btrim("name")) > 0
        THEN substring(btrim("name") from '(\\S+)$') ELSE btrim("name") END
    WHERE "first_name" IS NULL AND "last_name" IS NULL AND "name" IS NOT NULL AND btrim("name") <> '';
  ALTER TABLE "users" ALTER COLUMN "username" SET NOT NULL;
  ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'redaktion';
  ALTER TABLE "users" ALTER COLUMN "role" SET NOT NULL;
  ALTER TABLE "users" ADD COLUMN "author_id" integer;
  ALTER TABLE "redirects_rels" ADD COLUMN "pages_id" integer;
  ALTER TABLE "redirects_rels" ADD COLUMN "services_id" integer;
  ALTER TABLE "redirects_rels" ADD COLUMN "locations_id" integer;
  ALTER TABLE "redirects_rels" ADD COLUMN "cases_id" integer;
  ALTER TABLE "redirects_rels" ADD COLUMN "posts_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "pages_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "services_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "locations_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "cases_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "engagements_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "posts_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "categories_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "authors_id" integer;
  ALTER TABLE "site_settings" ADD COLUMN "company_legal_name" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "company_managing_director" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "company_street" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "company_postal_code" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "company_city" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "company_district" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "company_country" varchar DEFAULT 'Deutschland';
  ALTER TABLE "site_settings" ADD COLUMN "company_phone" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "company_email" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "company_register_court" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "company_register_number" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "company_vat_id" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "company_latitude" numeric;
  ALTER TABLE "site_settings" ADD COLUMN "company_longitude" numeric;
  ALTER TABLE "site_settings" ADD COLUMN "company_hourly_rate" numeric;
  ALTER TABLE "site_settings" ADD COLUMN "contact_booking_url" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "profiles_linkedin" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "profiles_instagram" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "profiles_google_business" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "profiles_google_review_url" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "seo_title_suffix" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "seo_default_og_image_id" integer;
  ALTER TABLE "site_settings_locales" ADD COLUMN "contact_hours" varchar;
  ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_locales" ADD CONSTRAINT "pages_blocks_hero_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_service_tiles" ADD CONSTRAINT "pages_blocks_service_tiles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_service_tiles_locales" ADD CONSTRAINT "pages_blocks_service_tiles_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_service_tiles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_packages" ADD CONSTRAINT "pages_blocks_packages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_packages_locales" ADD CONSTRAINT "pages_blocks_packages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_packages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_case_teaser" ADD CONSTRAINT "pages_blocks_case_teaser_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_case_teaser_locales" ADD CONSTRAINT "pages_blocks_case_teaser_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_case_teaser"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_brand_showcase" ADD CONSTRAINT "pages_blocks_brand_showcase_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_brand_showcase_locales" ADD CONSTRAINT "pages_blocks_brand_showcase_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_brand_showcase"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_trust_bar" ADD CONSTRAINT "pages_blocks_trust_bar_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_trust_bar_locales" ADD CONSTRAINT "pages_blocks_trust_bar_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_trust_bar"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_engagement_band" ADD CONSTRAINT "pages_blocks_engagement_band_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_engagement_band_locales" ADD CONSTRAINT "pages_blocks_engagement_band_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_engagement_band"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_post_teaser" ADD CONSTRAINT "pages_blocks_post_teaser_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_post_teaser_locales" ADD CONSTRAINT "pages_blocks_post_teaser_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_post_teaser"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq_items" ADD CONSTRAINT "pages_blocks_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq_items_locales" ADD CONSTRAINT "pages_blocks_faq_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_faq_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq" ADD CONSTRAINT "pages_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq_locales" ADD CONSTRAINT "pages_blocks_faq_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta" ADD CONSTRAINT "pages_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta_locales" ADD CONSTRAINT "pages_blocks_cta_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_text_image" ADD CONSTRAINT "pages_blocks_text_image_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_text_image" ADD CONSTRAINT "pages_blocks_text_image_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_text_image_locales" ADD CONSTRAINT "pages_blocks_text_image_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_text_image"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_locales" ADD CONSTRAINT "pages_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_locales" ADD CONSTRAINT "pages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_cases_fk" FOREIGN KEY ("cases_id") REFERENCES "public"."cases"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero" ADD CONSTRAINT "_pages_v_blocks_hero_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero" ADD CONSTRAINT "_pages_v_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_locales" ADD CONSTRAINT "_pages_v_blocks_hero_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_service_tiles" ADD CONSTRAINT "_pages_v_blocks_service_tiles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_service_tiles_locales" ADD CONSTRAINT "_pages_v_blocks_service_tiles_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_service_tiles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_packages" ADD CONSTRAINT "_pages_v_blocks_packages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_packages_locales" ADD CONSTRAINT "_pages_v_blocks_packages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_packages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_case_teaser" ADD CONSTRAINT "_pages_v_blocks_case_teaser_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_case_teaser_locales" ADD CONSTRAINT "_pages_v_blocks_case_teaser_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_case_teaser"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_brand_showcase" ADD CONSTRAINT "_pages_v_blocks_brand_showcase_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_brand_showcase_locales" ADD CONSTRAINT "_pages_v_blocks_brand_showcase_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_brand_showcase"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_trust_bar" ADD CONSTRAINT "_pages_v_blocks_trust_bar_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_trust_bar_locales" ADD CONSTRAINT "_pages_v_blocks_trust_bar_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_trust_bar"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_engagement_band" ADD CONSTRAINT "_pages_v_blocks_engagement_band_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_engagement_band_locales" ADD CONSTRAINT "_pages_v_blocks_engagement_band_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_engagement_band"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_post_teaser" ADD CONSTRAINT "_pages_v_blocks_post_teaser_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_post_teaser_locales" ADD CONSTRAINT "_pages_v_blocks_post_teaser_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_post_teaser"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq_items" ADD CONSTRAINT "_pages_v_blocks_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq_items_locales" ADD CONSTRAINT "_pages_v_blocks_faq_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_faq_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq" ADD CONSTRAINT "_pages_v_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq_locales" ADD CONSTRAINT "_pages_v_blocks_faq_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta" ADD CONSTRAINT "_pages_v_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta_locales" ADD CONSTRAINT "_pages_v_blocks_cta_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_text_image" ADD CONSTRAINT "_pages_v_blocks_text_image_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_text_image" ADD CONSTRAINT "_pages_v_blocks_text_image_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_text_image_locales" ADD CONSTRAINT "_pages_v_blocks_text_image_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_text_image"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_locales" ADD CONSTRAINT "_pages_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_locales" ADD CONSTRAINT "_pages_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_cases_fk" FOREIGN KEY ("cases_id") REFERENCES "public"."cases"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_packages_includes" ADD CONSTRAINT "services_packages_includes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_packages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_packages_includes_locales" ADD CONSTRAINT "services_packages_includes_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_packages_includes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_packages" ADD CONSTRAINT "services_packages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_packages_locales" ADD CONSTRAINT "services_packages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_packages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_steps" ADD CONSTRAINT "services_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_steps_locales" ADD CONSTRAINT "services_steps_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_faq" ADD CONSTRAINT "services_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_faq_locales" ADD CONSTRAINT "services_faq_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_locales" ADD CONSTRAINT "services_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services_locales" ADD CONSTRAINT "services_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_rels" ADD CONSTRAINT "services_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_rels" ADD CONSTRAINT "services_rels_cases_fk" FOREIGN KEY ("cases_id") REFERENCES "public"."cases"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_rels" ADD CONSTRAINT "services_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_packages_includes" ADD CONSTRAINT "_services_v_version_packages_includes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v_version_packages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_packages_includes_locales" ADD CONSTRAINT "_services_v_version_packages_includes_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v_version_packages_includes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_packages" ADD CONSTRAINT "_services_v_version_packages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_packages_locales" ADD CONSTRAINT "_services_v_version_packages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v_version_packages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_steps" ADD CONSTRAINT "_services_v_version_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_steps_locales" ADD CONSTRAINT "_services_v_version_steps_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v_version_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_faq" ADD CONSTRAINT "_services_v_version_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_faq_locales" ADD CONSTRAINT "_services_v_version_faq_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v_version_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v" ADD CONSTRAINT "_services_v_parent_id_services_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_services_v_locales" ADD CONSTRAINT "_services_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_services_v_locales" ADD CONSTRAINT "_services_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_rels" ADD CONSTRAINT "_services_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_rels" ADD CONSTRAINT "_services_v_rels_cases_fk" FOREIGN KEY ("cases_id") REFERENCES "public"."cases"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_rels" ADD CONSTRAINT "_services_v_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "locations_faq" ADD CONSTRAINT "locations_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "locations_faq_locales" ADD CONSTRAINT "locations_faq_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."locations_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "locations" ADD CONSTRAINT "locations_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "locations" ADD CONSTRAINT "locations_local_reference_case_id_cases_id_fk" FOREIGN KEY ("local_reference_case_id") REFERENCES "public"."cases"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "locations_locales" ADD CONSTRAINT "locations_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "locations_locales" ADD CONSTRAINT "locations_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_locations_v_version_faq" ADD CONSTRAINT "_locations_v_version_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_locations_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_locations_v_version_faq_locales" ADD CONSTRAINT "_locations_v_version_faq_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_locations_v_version_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_locations_v" ADD CONSTRAINT "_locations_v_parent_id_locations_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."locations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_locations_v" ADD CONSTRAINT "_locations_v_version_service_id_services_id_fk" FOREIGN KEY ("version_service_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_locations_v" ADD CONSTRAINT "_locations_v_version_local_reference_case_id_cases_id_fk" FOREIGN KEY ("version_local_reference_case_id") REFERENCES "public"."cases"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_locations_v_locales" ADD CONSTRAINT "_locations_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_locations_v_locales" ADD CONSTRAINT "_locations_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_locations_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cases_chips" ADD CONSTRAINT "cases_chips_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cases"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cases_chips_locales" ADD CONSTRAINT "cases_chips_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cases_chips"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cases_figures" ADD CONSTRAINT "cases_figures_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cases"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cases_figures_locales" ADD CONSTRAINT "cases_figures_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cases_figures"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cases_locales" ADD CONSTRAINT "cases_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cases_locales" ADD CONSTRAINT "cases_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cases"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cases_rels" ADD CONSTRAINT "cases_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."cases"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cases_rels" ADD CONSTRAINT "cases_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cases_rels" ADD CONSTRAINT "cases_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_cases_v_version_chips" ADD CONSTRAINT "_cases_v_version_chips_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_cases_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_cases_v_version_chips_locales" ADD CONSTRAINT "_cases_v_version_chips_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_cases_v_version_chips"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_cases_v_version_figures" ADD CONSTRAINT "_cases_v_version_figures_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_cases_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_cases_v_version_figures_locales" ADD CONSTRAINT "_cases_v_version_figures_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_cases_v_version_figures"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_cases_v" ADD CONSTRAINT "_cases_v_parent_id_cases_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."cases"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_cases_v_locales" ADD CONSTRAINT "_cases_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_cases_v_locales" ADD CONSTRAINT "_cases_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_cases_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_cases_v_rels" ADD CONSTRAINT "_cases_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_cases_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_cases_v_rels" ADD CONSTRAINT "_cases_v_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_cases_v_rels" ADD CONSTRAINT "_cases_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "engagements" ADD CONSTRAINT "engagements_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "engagements_locales" ADD CONSTRAINT "engagements_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."engagements"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "engagements_rels" ADD CONSTRAINT "engagements_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."engagements"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "engagements_rels" ADD CONSTRAINT "engagements_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_faq" ADD CONSTRAINT "posts_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_faq_locales" ADD CONSTRAINT "posts_faq_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_sources" ADD CONSTRAINT "posts_sources_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_author_id_authors_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."authors"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_social_image_id_media_id_fk" FOREIGN KEY ("social_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_locales" ADD CONSTRAINT "posts_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_locales" ADD CONSTRAINT "posts_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_version_faq" ADD CONSTRAINT "_posts_v_version_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_version_faq_locales" ADD CONSTRAINT "_posts_v_version_faq_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v_version_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_version_sources" ADD CONSTRAINT "_posts_v_version_sources_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_parent_id_posts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_category_id_categories_id_fk" FOREIGN KEY ("version_category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_service_id_services_id_fk" FOREIGN KEY ("version_service_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_author_id_authors_id_fk" FOREIGN KEY ("version_author_id") REFERENCES "public"."authors"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_social_image_id_media_id_fk" FOREIGN KEY ("version_social_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_locales" ADD CONSTRAINT "_posts_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_locales" ADD CONSTRAINT "_posts_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories_locales" ADD CONSTRAINT "categories_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "authors_same_as" ADD CONSTRAINT "authors_same_as_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."authors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "authors" ADD CONSTRAINT "authors_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "authors" ADD CONSTRAINT "authors_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "authors_locales" ADD CONSTRAINT "authors_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."authors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_company_area_served" ADD CONSTRAINT "site_settings_company_area_served_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_header" ADD CONSTRAINT "navigation_header_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_header_locales" ADD CONSTRAINT "navigation_header_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_footer_legal" ADD CONSTRAINT "navigation_footer_legal_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_footer_legal_locales" ADD CONSTRAINT "navigation_footer_legal_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_footer_legal"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "trust_badges" ADD CONSTRAINT "trust_badges_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "trust_badges" ADD CONSTRAINT "trust_badges_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."trust"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "trust" ADD CONSTRAINT "trust_shopify_badge_id_media_id_fk" FOREIGN KEY ("shopify_badge_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "trust_locales" ADD CONSTRAINT "trust_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."trust"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_agb_v_locales" ADD CONSTRAINT "_agb_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_agb_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_widerruf_v_locales" ADD CONSTRAINT "_widerruf_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_widerruf_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_hero_order_idx" ON "pages_blocks_hero" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_parent_id_idx" ON "pages_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_path_idx" ON "pages_blocks_hero" USING btree ("_path");
  CREATE INDEX "pages_blocks_hero_image_idx" ON "pages_blocks_hero" USING btree ("image_id");
  CREATE UNIQUE INDEX "pages_blocks_hero_locales_locale_parent_id_unique" ON "pages_blocks_hero_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_service_tiles_order_idx" ON "pages_blocks_service_tiles" USING btree ("_order");
  CREATE INDEX "pages_blocks_service_tiles_parent_id_idx" ON "pages_blocks_service_tiles" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_service_tiles_path_idx" ON "pages_blocks_service_tiles" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_service_tiles_locales_locale_parent_id_unique" ON "pages_blocks_service_tiles_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_packages_order_idx" ON "pages_blocks_packages" USING btree ("_order");
  CREATE INDEX "pages_blocks_packages_parent_id_idx" ON "pages_blocks_packages" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_packages_path_idx" ON "pages_blocks_packages" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_packages_locales_locale_parent_id_unique" ON "pages_blocks_packages_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_case_teaser_order_idx" ON "pages_blocks_case_teaser" USING btree ("_order");
  CREATE INDEX "pages_blocks_case_teaser_parent_id_idx" ON "pages_blocks_case_teaser" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_case_teaser_path_idx" ON "pages_blocks_case_teaser" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_case_teaser_locales_locale_parent_id_unique" ON "pages_blocks_case_teaser_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_brand_showcase_order_idx" ON "pages_blocks_brand_showcase" USING btree ("_order");
  CREATE INDEX "pages_blocks_brand_showcase_parent_id_idx" ON "pages_blocks_brand_showcase" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_brand_showcase_path_idx" ON "pages_blocks_brand_showcase" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_brand_showcase_locales_locale_parent_id_unique" ON "pages_blocks_brand_showcase_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_trust_bar_order_idx" ON "pages_blocks_trust_bar" USING btree ("_order");
  CREATE INDEX "pages_blocks_trust_bar_parent_id_idx" ON "pages_blocks_trust_bar" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_trust_bar_path_idx" ON "pages_blocks_trust_bar" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_trust_bar_locales_locale_parent_id_unique" ON "pages_blocks_trust_bar_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_engagement_band_order_idx" ON "pages_blocks_engagement_band" USING btree ("_order");
  CREATE INDEX "pages_blocks_engagement_band_parent_id_idx" ON "pages_blocks_engagement_band" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_engagement_band_path_idx" ON "pages_blocks_engagement_band" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_engagement_band_locales_locale_parent_id_unique" ON "pages_blocks_engagement_band_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_post_teaser_order_idx" ON "pages_blocks_post_teaser" USING btree ("_order");
  CREATE INDEX "pages_blocks_post_teaser_parent_id_idx" ON "pages_blocks_post_teaser" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_post_teaser_path_idx" ON "pages_blocks_post_teaser" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_post_teaser_locales_locale_parent_id_unique" ON "pages_blocks_post_teaser_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_faq_items_order_idx" ON "pages_blocks_faq_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_items_parent_id_idx" ON "pages_blocks_faq_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_faq_items_locales_locale_parent_id_unique" ON "pages_blocks_faq_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_faq_order_idx" ON "pages_blocks_faq" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_parent_id_idx" ON "pages_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_path_idx" ON "pages_blocks_faq" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_faq_locales_locale_parent_id_unique" ON "pages_blocks_faq_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_cta_order_idx" ON "pages_blocks_cta" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_parent_id_idx" ON "pages_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_path_idx" ON "pages_blocks_cta" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_cta_locales_locale_parent_id_unique" ON "pages_blocks_cta_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_text_image_order_idx" ON "pages_blocks_text_image" USING btree ("_order");
  CREATE INDEX "pages_blocks_text_image_parent_id_idx" ON "pages_blocks_text_image" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_text_image_path_idx" ON "pages_blocks_text_image" USING btree ("_path");
  CREATE INDEX "pages_blocks_text_image_image_idx" ON "pages_blocks_text_image" USING btree ("image_id");
  CREATE UNIQUE INDEX "pages_blocks_text_image_locales_locale_parent_id_unique" ON "pages_blocks_text_image_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pages_slug_idx" ON "pages" USING btree ("slug");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "pages__status_idx" ON "pages" USING btree ("_status");
  CREATE INDEX "pages_meta_meta_image_idx" ON "pages_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "pages_locales_locale_parent_id_unique" ON "pages_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_rels_order_idx" ON "pages_rels" USING btree ("order");
  CREATE INDEX "pages_rels_parent_idx" ON "pages_rels" USING btree ("parent_id");
  CREATE INDEX "pages_rels_path_idx" ON "pages_rels" USING btree ("path");
  CREATE INDEX "pages_rels_cases_id_idx" ON "pages_rels" USING btree ("cases_id");
  CREATE INDEX "_pages_v_blocks_hero_order_idx" ON "_pages_v_blocks_hero" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_parent_id_idx" ON "_pages_v_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_path_idx" ON "_pages_v_blocks_hero" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_hero_image_idx" ON "_pages_v_blocks_hero" USING btree ("image_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_hero_locales_locale_parent_id_unique" ON "_pages_v_blocks_hero_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_service_tiles_order_idx" ON "_pages_v_blocks_service_tiles" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_service_tiles_parent_id_idx" ON "_pages_v_blocks_service_tiles" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_service_tiles_path_idx" ON "_pages_v_blocks_service_tiles" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_service_tiles_locales_locale_parent_id_uniqu" ON "_pages_v_blocks_service_tiles_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_packages_order_idx" ON "_pages_v_blocks_packages" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_packages_parent_id_idx" ON "_pages_v_blocks_packages" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_packages_path_idx" ON "_pages_v_blocks_packages" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_packages_locales_locale_parent_id_unique" ON "_pages_v_blocks_packages_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_case_teaser_order_idx" ON "_pages_v_blocks_case_teaser" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_case_teaser_parent_id_idx" ON "_pages_v_blocks_case_teaser" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_case_teaser_path_idx" ON "_pages_v_blocks_case_teaser" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_case_teaser_locales_locale_parent_id_unique" ON "_pages_v_blocks_case_teaser_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_brand_showcase_order_idx" ON "_pages_v_blocks_brand_showcase" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_brand_showcase_parent_id_idx" ON "_pages_v_blocks_brand_showcase" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_brand_showcase_path_idx" ON "_pages_v_blocks_brand_showcase" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_brand_showcase_locales_locale_parent_id_uniq" ON "_pages_v_blocks_brand_showcase_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_trust_bar_order_idx" ON "_pages_v_blocks_trust_bar" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_trust_bar_parent_id_idx" ON "_pages_v_blocks_trust_bar" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_trust_bar_path_idx" ON "_pages_v_blocks_trust_bar" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_trust_bar_locales_locale_parent_id_unique" ON "_pages_v_blocks_trust_bar_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_engagement_band_order_idx" ON "_pages_v_blocks_engagement_band" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_engagement_band_parent_id_idx" ON "_pages_v_blocks_engagement_band" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_engagement_band_path_idx" ON "_pages_v_blocks_engagement_band" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_engagement_band_locales_locale_parent_id_uni" ON "_pages_v_blocks_engagement_band_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_post_teaser_order_idx" ON "_pages_v_blocks_post_teaser" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_post_teaser_parent_id_idx" ON "_pages_v_blocks_post_teaser" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_post_teaser_path_idx" ON "_pages_v_blocks_post_teaser" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_post_teaser_locales_locale_parent_id_unique" ON "_pages_v_blocks_post_teaser_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_faq_items_order_idx" ON "_pages_v_blocks_faq_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_faq_items_parent_id_idx" ON "_pages_v_blocks_faq_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_faq_items_locales_locale_parent_id_unique" ON "_pages_v_blocks_faq_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_faq_order_idx" ON "_pages_v_blocks_faq" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_faq_parent_id_idx" ON "_pages_v_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_faq_path_idx" ON "_pages_v_blocks_faq" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_faq_locales_locale_parent_id_unique" ON "_pages_v_blocks_faq_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_order_idx" ON "_pages_v_blocks_cta" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cta_parent_id_idx" ON "_pages_v_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_path_idx" ON "_pages_v_blocks_cta" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_cta_locales_locale_parent_id_unique" ON "_pages_v_blocks_cta_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_text_image_order_idx" ON "_pages_v_blocks_text_image" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_text_image_parent_id_idx" ON "_pages_v_blocks_text_image" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_text_image_path_idx" ON "_pages_v_blocks_text_image" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_text_image_image_idx" ON "_pages_v_blocks_text_image" USING btree ("image_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_text_image_locales_locale_parent_id_unique" ON "_pages_v_blocks_text_image_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_parent_idx" ON "_pages_v" USING btree ("parent_id");
  CREATE INDEX "_pages_v_version_version_slug_idx" ON "_pages_v" USING btree ("version_slug");
  CREATE INDEX "_pages_v_version_version_updated_at_idx" ON "_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_pages_v_version_version_created_at_idx" ON "_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_pages_v_version_version__status_idx" ON "_pages_v" USING btree ("version__status");
  CREATE INDEX "_pages_v_created_at_idx" ON "_pages_v" USING btree ("created_at");
  CREATE INDEX "_pages_v_updated_at_idx" ON "_pages_v" USING btree ("updated_at");
  CREATE INDEX "_pages_v_snapshot_idx" ON "_pages_v" USING btree ("snapshot");
  CREATE INDEX "_pages_v_published_locale_idx" ON "_pages_v" USING btree ("published_locale");
  CREATE INDEX "_pages_v_latest_idx" ON "_pages_v" USING btree ("latest");
  CREATE INDEX "_pages_v_version_meta_version_meta_image_idx" ON "_pages_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX "_pages_v_locales_locale_parent_id_unique" ON "_pages_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_rels_order_idx" ON "_pages_v_rels" USING btree ("order");
  CREATE INDEX "_pages_v_rels_parent_idx" ON "_pages_v_rels" USING btree ("parent_id");
  CREATE INDEX "_pages_v_rels_path_idx" ON "_pages_v_rels" USING btree ("path");
  CREATE INDEX "_pages_v_rels_cases_id_idx" ON "_pages_v_rels" USING btree ("cases_id");
  CREATE INDEX "services_packages_includes_order_idx" ON "services_packages_includes" USING btree ("_order");
  CREATE INDEX "services_packages_includes_parent_id_idx" ON "services_packages_includes" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "services_packages_includes_locales_locale_parent_id_unique" ON "services_packages_includes_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "services_packages_order_idx" ON "services_packages" USING btree ("_order");
  CREATE INDEX "services_packages_parent_id_idx" ON "services_packages" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "services_packages_locales_locale_parent_id_unique" ON "services_packages_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "services_steps_order_idx" ON "services_steps" USING btree ("_order");
  CREATE INDEX "services_steps_parent_id_idx" ON "services_steps" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "services_steps_locales_locale_parent_id_unique" ON "services_steps_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "services_faq_order_idx" ON "services_faq" USING btree ("_order");
  CREATE INDEX "services_faq_parent_id_idx" ON "services_faq" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "services_faq_locales_locale_parent_id_unique" ON "services_faq_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "services_slug_idx" ON "services" USING btree ("slug");
  CREATE INDEX "services_updated_at_idx" ON "services" USING btree ("updated_at");
  CREATE INDEX "services_created_at_idx" ON "services" USING btree ("created_at");
  CREATE INDEX "services__status_idx" ON "services" USING btree ("_status");
  CREATE INDEX "services_meta_meta_image_idx" ON "services_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "services_locales_locale_parent_id_unique" ON "services_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "services_rels_order_idx" ON "services_rels" USING btree ("order");
  CREATE INDEX "services_rels_parent_idx" ON "services_rels" USING btree ("parent_id");
  CREATE INDEX "services_rels_path_idx" ON "services_rels" USING btree ("path");
  CREATE INDEX "services_rels_cases_id_idx" ON "services_rels" USING btree ("cases_id");
  CREATE INDEX "services_rels_posts_id_idx" ON "services_rels" USING btree ("posts_id");
  CREATE INDEX "_services_v_version_packages_includes_order_idx" ON "_services_v_version_packages_includes" USING btree ("_order");
  CREATE INDEX "_services_v_version_packages_includes_parent_id_idx" ON "_services_v_version_packages_includes" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_services_v_version_packages_includes_locales_locale_parent_" ON "_services_v_version_packages_includes_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_services_v_version_packages_order_idx" ON "_services_v_version_packages" USING btree ("_order");
  CREATE INDEX "_services_v_version_packages_parent_id_idx" ON "_services_v_version_packages" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_services_v_version_packages_locales_locale_parent_id_unique" ON "_services_v_version_packages_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_services_v_version_steps_order_idx" ON "_services_v_version_steps" USING btree ("_order");
  CREATE INDEX "_services_v_version_steps_parent_id_idx" ON "_services_v_version_steps" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_services_v_version_steps_locales_locale_parent_id_unique" ON "_services_v_version_steps_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_services_v_version_faq_order_idx" ON "_services_v_version_faq" USING btree ("_order");
  CREATE INDEX "_services_v_version_faq_parent_id_idx" ON "_services_v_version_faq" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_services_v_version_faq_locales_locale_parent_id_unique" ON "_services_v_version_faq_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_services_v_parent_idx" ON "_services_v" USING btree ("parent_id");
  CREATE INDEX "_services_v_version_version_slug_idx" ON "_services_v" USING btree ("version_slug");
  CREATE INDEX "_services_v_version_version_updated_at_idx" ON "_services_v" USING btree ("version_updated_at");
  CREATE INDEX "_services_v_version_version_created_at_idx" ON "_services_v" USING btree ("version_created_at");
  CREATE INDEX "_services_v_version_version__status_idx" ON "_services_v" USING btree ("version__status");
  CREATE INDEX "_services_v_created_at_idx" ON "_services_v" USING btree ("created_at");
  CREATE INDEX "_services_v_updated_at_idx" ON "_services_v" USING btree ("updated_at");
  CREATE INDEX "_services_v_snapshot_idx" ON "_services_v" USING btree ("snapshot");
  CREATE INDEX "_services_v_published_locale_idx" ON "_services_v" USING btree ("published_locale");
  CREATE INDEX "_services_v_latest_idx" ON "_services_v" USING btree ("latest");
  CREATE INDEX "_services_v_version_meta_version_meta_image_idx" ON "_services_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX "_services_v_locales_locale_parent_id_unique" ON "_services_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_services_v_rels_order_idx" ON "_services_v_rels" USING btree ("order");
  CREATE INDEX "_services_v_rels_parent_idx" ON "_services_v_rels" USING btree ("parent_id");
  CREATE INDEX "_services_v_rels_path_idx" ON "_services_v_rels" USING btree ("path");
  CREATE INDEX "_services_v_rels_cases_id_idx" ON "_services_v_rels" USING btree ("cases_id");
  CREATE INDEX "_services_v_rels_posts_id_idx" ON "_services_v_rels" USING btree ("posts_id");
  CREATE INDEX "locations_faq_order_idx" ON "locations_faq" USING btree ("_order");
  CREATE INDEX "locations_faq_parent_id_idx" ON "locations_faq" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "locations_faq_locales_locale_parent_id_unique" ON "locations_faq_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "locations_slug_idx" ON "locations" USING btree ("slug");
  CREATE INDEX "locations_service_idx" ON "locations" USING btree ("service_id");
  CREATE INDEX "locations_local_reference_local_reference_case_idx" ON "locations" USING btree ("local_reference_case_id");
  CREATE INDEX "locations_updated_at_idx" ON "locations" USING btree ("updated_at");
  CREATE INDEX "locations_created_at_idx" ON "locations" USING btree ("created_at");
  CREATE INDEX "locations__status_idx" ON "locations" USING btree ("_status");
  CREATE INDEX "locations_meta_meta_image_idx" ON "locations_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "locations_locales_locale_parent_id_unique" ON "locations_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_locations_v_version_faq_order_idx" ON "_locations_v_version_faq" USING btree ("_order");
  CREATE INDEX "_locations_v_version_faq_parent_id_idx" ON "_locations_v_version_faq" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_locations_v_version_faq_locales_locale_parent_id_unique" ON "_locations_v_version_faq_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_locations_v_parent_idx" ON "_locations_v" USING btree ("parent_id");
  CREATE INDEX "_locations_v_version_version_slug_idx" ON "_locations_v" USING btree ("version_slug");
  CREATE INDEX "_locations_v_version_version_service_idx" ON "_locations_v" USING btree ("version_service_id");
  CREATE INDEX "_locations_v_version_local_reference_version_local_refer_idx" ON "_locations_v" USING btree ("version_local_reference_case_id");
  CREATE INDEX "_locations_v_version_version_updated_at_idx" ON "_locations_v" USING btree ("version_updated_at");
  CREATE INDEX "_locations_v_version_version_created_at_idx" ON "_locations_v" USING btree ("version_created_at");
  CREATE INDEX "_locations_v_version_version__status_idx" ON "_locations_v" USING btree ("version__status");
  CREATE INDEX "_locations_v_created_at_idx" ON "_locations_v" USING btree ("created_at");
  CREATE INDEX "_locations_v_updated_at_idx" ON "_locations_v" USING btree ("updated_at");
  CREATE INDEX "_locations_v_snapshot_idx" ON "_locations_v" USING btree ("snapshot");
  CREATE INDEX "_locations_v_published_locale_idx" ON "_locations_v" USING btree ("published_locale");
  CREATE INDEX "_locations_v_latest_idx" ON "_locations_v" USING btree ("latest");
  CREATE INDEX "_locations_v_version_meta_version_meta_image_idx" ON "_locations_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX "_locations_v_locales_locale_parent_id_unique" ON "_locations_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "cases_chips_order_idx" ON "cases_chips" USING btree ("_order");
  CREATE INDEX "cases_chips_parent_id_idx" ON "cases_chips" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "cases_chips_locales_locale_parent_id_unique" ON "cases_chips_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "cases_figures_order_idx" ON "cases_figures" USING btree ("_order");
  CREATE INDEX "cases_figures_parent_id_idx" ON "cases_figures" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "cases_figures_locales_locale_parent_id_unique" ON "cases_figures_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "cases_slug_idx" ON "cases" USING btree ("slug");
  CREATE INDEX "cases_updated_at_idx" ON "cases" USING btree ("updated_at");
  CREATE INDEX "cases_created_at_idx" ON "cases" USING btree ("created_at");
  CREATE INDEX "cases__status_idx" ON "cases" USING btree ("_status");
  CREATE INDEX "cases_meta_meta_image_idx" ON "cases_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "cases_locales_locale_parent_id_unique" ON "cases_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "cases_rels_order_idx" ON "cases_rels" USING btree ("order");
  CREATE INDEX "cases_rels_parent_idx" ON "cases_rels" USING btree ("parent_id");
  CREATE INDEX "cases_rels_path_idx" ON "cases_rels" USING btree ("path");
  CREATE INDEX "cases_rels_services_id_idx" ON "cases_rels" USING btree ("services_id");
  CREATE INDEX "cases_rels_media_id_idx" ON "cases_rels" USING btree ("media_id");
  CREATE INDEX "_cases_v_version_chips_order_idx" ON "_cases_v_version_chips" USING btree ("_order");
  CREATE INDEX "_cases_v_version_chips_parent_id_idx" ON "_cases_v_version_chips" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_cases_v_version_chips_locales_locale_parent_id_unique" ON "_cases_v_version_chips_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_cases_v_version_figures_order_idx" ON "_cases_v_version_figures" USING btree ("_order");
  CREATE INDEX "_cases_v_version_figures_parent_id_idx" ON "_cases_v_version_figures" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_cases_v_version_figures_locales_locale_parent_id_unique" ON "_cases_v_version_figures_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_cases_v_parent_idx" ON "_cases_v" USING btree ("parent_id");
  CREATE INDEX "_cases_v_version_version_slug_idx" ON "_cases_v" USING btree ("version_slug");
  CREATE INDEX "_cases_v_version_version_updated_at_idx" ON "_cases_v" USING btree ("version_updated_at");
  CREATE INDEX "_cases_v_version_version_created_at_idx" ON "_cases_v" USING btree ("version_created_at");
  CREATE INDEX "_cases_v_version_version__status_idx" ON "_cases_v" USING btree ("version__status");
  CREATE INDEX "_cases_v_created_at_idx" ON "_cases_v" USING btree ("created_at");
  CREATE INDEX "_cases_v_updated_at_idx" ON "_cases_v" USING btree ("updated_at");
  CREATE INDEX "_cases_v_snapshot_idx" ON "_cases_v" USING btree ("snapshot");
  CREATE INDEX "_cases_v_published_locale_idx" ON "_cases_v" USING btree ("published_locale");
  CREATE INDEX "_cases_v_latest_idx" ON "_cases_v" USING btree ("latest");
  CREATE INDEX "_cases_v_version_meta_version_meta_image_idx" ON "_cases_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX "_cases_v_locales_locale_parent_id_unique" ON "_cases_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_cases_v_rels_order_idx" ON "_cases_v_rels" USING btree ("order");
  CREATE INDEX "_cases_v_rels_parent_idx" ON "_cases_v_rels" USING btree ("parent_id");
  CREATE INDEX "_cases_v_rels_path_idx" ON "_cases_v_rels" USING btree ("path");
  CREATE INDEX "_cases_v_rels_services_id_idx" ON "_cases_v_rels" USING btree ("services_id");
  CREATE INDEX "_cases_v_rels_media_id_idx" ON "_cases_v_rels" USING btree ("media_id");
  CREATE INDEX "engagements_logo_idx" ON "engagements" USING btree ("logo_id");
  CREATE INDEX "engagements_updated_at_idx" ON "engagements" USING btree ("updated_at");
  CREATE INDEX "engagements_created_at_idx" ON "engagements" USING btree ("created_at");
  CREATE UNIQUE INDEX "engagements_locales_locale_parent_id_unique" ON "engagements_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "engagements_rels_order_idx" ON "engagements_rels" USING btree ("order");
  CREATE INDEX "engagements_rels_parent_idx" ON "engagements_rels" USING btree ("parent_id");
  CREATE INDEX "engagements_rels_path_idx" ON "engagements_rels" USING btree ("path");
  CREATE INDEX "engagements_rels_media_id_idx" ON "engagements_rels" USING btree ("media_id");
  CREATE INDEX "posts_faq_order_idx" ON "posts_faq" USING btree ("_order");
  CREATE INDEX "posts_faq_parent_id_idx" ON "posts_faq" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "posts_faq_locales_locale_parent_id_unique" ON "posts_faq_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "posts_sources_order_idx" ON "posts_sources" USING btree ("_order");
  CREATE INDEX "posts_sources_parent_id_idx" ON "posts_sources" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "posts_slug_idx" ON "posts" USING btree ("slug");
  CREATE INDEX "posts_category_idx" ON "posts" USING btree ("category_id");
  CREATE INDEX "posts_service_idx" ON "posts" USING btree ("service_id");
  CREATE INDEX "posts_author_idx" ON "posts" USING btree ("author_id");
  CREATE INDEX "posts_hero_image_idx" ON "posts" USING btree ("hero_image_id");
  CREATE INDEX "posts_social_image_idx" ON "posts" USING btree ("social_image_id");
  CREATE INDEX "posts_updated_at_idx" ON "posts" USING btree ("updated_at");
  CREATE INDEX "posts_created_at_idx" ON "posts" USING btree ("created_at");
  CREATE INDEX "posts__status_idx" ON "posts" USING btree ("_status");
  CREATE INDEX "posts_meta_meta_image_idx" ON "posts_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "posts_locales_locale_parent_id_unique" ON "posts_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "posts_rels_order_idx" ON "posts_rels" USING btree ("order");
  CREATE INDEX "posts_rels_parent_idx" ON "posts_rels" USING btree ("parent_id");
  CREATE INDEX "posts_rels_path_idx" ON "posts_rels" USING btree ("path");
  CREATE INDEX "posts_rels_posts_id_idx" ON "posts_rels" USING btree ("posts_id");
  CREATE INDEX "_posts_v_version_faq_order_idx" ON "_posts_v_version_faq" USING btree ("_order");
  CREATE INDEX "_posts_v_version_faq_parent_id_idx" ON "_posts_v_version_faq" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_posts_v_version_faq_locales_locale_parent_id_unique" ON "_posts_v_version_faq_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_posts_v_version_sources_order_idx" ON "_posts_v_version_sources" USING btree ("_order");
  CREATE INDEX "_posts_v_version_sources_parent_id_idx" ON "_posts_v_version_sources" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_parent_idx" ON "_posts_v" USING btree ("parent_id");
  CREATE INDEX "_posts_v_version_version_slug_idx" ON "_posts_v" USING btree ("version_slug");
  CREATE INDEX "_posts_v_version_version_category_idx" ON "_posts_v" USING btree ("version_category_id");
  CREATE INDEX "_posts_v_version_version_service_idx" ON "_posts_v" USING btree ("version_service_id");
  CREATE INDEX "_posts_v_version_version_author_idx" ON "_posts_v" USING btree ("version_author_id");
  CREATE INDEX "_posts_v_version_version_hero_image_idx" ON "_posts_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_posts_v_version_version_social_image_idx" ON "_posts_v" USING btree ("version_social_image_id");
  CREATE INDEX "_posts_v_version_version_updated_at_idx" ON "_posts_v" USING btree ("version_updated_at");
  CREATE INDEX "_posts_v_version_version_created_at_idx" ON "_posts_v" USING btree ("version_created_at");
  CREATE INDEX "_posts_v_version_version__status_idx" ON "_posts_v" USING btree ("version__status");
  CREATE INDEX "_posts_v_created_at_idx" ON "_posts_v" USING btree ("created_at");
  CREATE INDEX "_posts_v_updated_at_idx" ON "_posts_v" USING btree ("updated_at");
  CREATE INDEX "_posts_v_snapshot_idx" ON "_posts_v" USING btree ("snapshot");
  CREATE INDEX "_posts_v_published_locale_idx" ON "_posts_v" USING btree ("published_locale");
  CREATE INDEX "_posts_v_latest_idx" ON "_posts_v" USING btree ("latest");
  CREATE INDEX "_posts_v_version_meta_version_meta_image_idx" ON "_posts_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX "_posts_v_locales_locale_parent_id_unique" ON "_posts_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_posts_v_rels_order_idx" ON "_posts_v_rels" USING btree ("order");
  CREATE INDEX "_posts_v_rels_parent_idx" ON "_posts_v_rels" USING btree ("parent_id");
  CREATE INDEX "_posts_v_rels_path_idx" ON "_posts_v_rels" USING btree ("path");
  CREATE INDEX "_posts_v_rels_posts_id_idx" ON "_posts_v_rels" USING btree ("posts_id");
  CREATE UNIQUE INDEX "categories_slug_idx" ON "categories" USING btree ("slug");
  CREATE INDEX "categories_updated_at_idx" ON "categories" USING btree ("updated_at");
  CREATE INDEX "categories_created_at_idx" ON "categories" USING btree ("created_at");
  CREATE UNIQUE INDEX "categories_locales_locale_parent_id_unique" ON "categories_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "authors_same_as_order_idx" ON "authors_same_as" USING btree ("_order");
  CREATE INDEX "authors_same_as_parent_id_idx" ON "authors_same_as" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "authors_slug_idx" ON "authors" USING btree ("slug");
  CREATE INDEX "authors_photo_idx" ON "authors" USING btree ("photo_id");
  CREATE INDEX "authors_user_idx" ON "authors" USING btree ("user_id");
  CREATE INDEX "authors_updated_at_idx" ON "authors" USING btree ("updated_at");
  CREATE INDEX "authors_created_at_idx" ON "authors" USING btree ("created_at");
  CREATE UNIQUE INDEX "authors_locales_locale_parent_id_unique" ON "authors_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "site_settings_company_area_served_order_idx" ON "site_settings_company_area_served" USING btree ("_order");
  CREATE INDEX "site_settings_company_area_served_parent_id_idx" ON "site_settings_company_area_served" USING btree ("_parent_id");
  CREATE INDEX "navigation_header_order_idx" ON "navigation_header" USING btree ("_order");
  CREATE INDEX "navigation_header_parent_id_idx" ON "navigation_header" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "navigation_header_locales_locale_parent_id_unique" ON "navigation_header_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "navigation_footer_legal_order_idx" ON "navigation_footer_legal" USING btree ("_order");
  CREATE INDEX "navigation_footer_legal_parent_id_idx" ON "navigation_footer_legal" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "navigation_footer_legal_locales_locale_parent_id_unique" ON "navigation_footer_legal_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "trust_badges_order_idx" ON "trust_badges" USING btree ("_order");
  CREATE INDEX "trust_badges_parent_id_idx" ON "trust_badges" USING btree ("_parent_id");
  CREATE INDEX "trust_badges_image_idx" ON "trust_badges" USING btree ("image_id");
  CREATE INDEX "trust_shopify_badge_idx" ON "trust" USING btree ("shopify_badge_id");
  CREATE UNIQUE INDEX "trust_locales_locale_parent_id_unique" ON "trust_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_agb_v_created_at_idx" ON "_agb_v" USING btree ("created_at");
  CREATE INDEX "_agb_v_updated_at_idx" ON "_agb_v" USING btree ("updated_at");
  CREATE UNIQUE INDEX "_agb_v_locales_locale_parent_id_unique" ON "_agb_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_widerruf_v_created_at_idx" ON "_widerruf_v" USING btree ("created_at");
  CREATE INDEX "_widerruf_v_updated_at_idx" ON "_widerruf_v" USING btree ("updated_at");
  CREATE UNIQUE INDEX "_widerruf_v_locales_locale_parent_id_unique" ON "_widerruf_v_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "users" ADD CONSTRAINT "users_author_id_authors_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."authors"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_locations_fk" FOREIGN KEY ("locations_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_cases_fk" FOREIGN KEY ("cases_id") REFERENCES "public"."cases"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_locations_fk" FOREIGN KEY ("locations_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_cases_fk" FOREIGN KEY ("cases_id") REFERENCES "public"."cases"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_engagements_fk" FOREIGN KEY ("engagements_id") REFERENCES "public"."engagements"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_authors_fk" FOREIGN KEY ("authors_id") REFERENCES "public"."authors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_seo_default_og_image_id_media_id_fk" FOREIGN KEY ("seo_default_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE UNIQUE INDEX "users_username_idx" ON "users" USING btree ("username");
  CREATE INDEX "users_author_idx" ON "users" USING btree ("author_id");
  CREATE INDEX "redirects_rels_pages_id_idx" ON "redirects_rels" USING btree ("pages_id");
  CREATE INDEX "redirects_rels_services_id_idx" ON "redirects_rels" USING btree ("services_id");
  CREATE INDEX "redirects_rels_locations_id_idx" ON "redirects_rels" USING btree ("locations_id");
  CREATE INDEX "redirects_rels_cases_id_idx" ON "redirects_rels" USING btree ("cases_id");
  CREATE INDEX "redirects_rels_posts_id_idx" ON "redirects_rels" USING btree ("posts_id");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_services_id_idx" ON "payload_locked_documents_rels" USING btree ("services_id");
  CREATE INDEX "payload_locked_documents_rels_locations_id_idx" ON "payload_locked_documents_rels" USING btree ("locations_id");
  CREATE INDEX "payload_locked_documents_rels_cases_id_idx" ON "payload_locked_documents_rels" USING btree ("cases_id");
  CREATE INDEX "payload_locked_documents_rels_engagements_id_idx" ON "payload_locked_documents_rels" USING btree ("engagements_id");
  CREATE INDEX "payload_locked_documents_rels_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("posts_id");
  CREATE INDEX "payload_locked_documents_rels_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("categories_id");
  CREATE INDEX "payload_locked_documents_rels_authors_id_idx" ON "payload_locked_documents_rels" USING btree ("authors_id");
  CREATE INDEX "site_settings_seo_seo_default_og_image_idx" ON "site_settings" USING btree ("seo_default_og_image_id");
  ALTER TABLE "users" DROP COLUMN "name";
  ALTER TABLE "site_settings" DROP COLUMN "contact_email";
  ALTER TABLE "site_settings" DROP COLUMN "contact_phone";
  ALTER TABLE "site_settings_locales" DROP COLUMN "tagline";
  ALTER TABLE "site_settings_locales" DROP COLUMN "contact_address";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "site_settings_nav" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"href" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings_nav_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings_social" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" varchar,
  	"url" varchar
  );
  
  CREATE TABLE "impressum" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"last_updated" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "impressum_locales" (
  	"title" varchar DEFAULT 'Impressum',
  	"content" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "datenschutz" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"last_updated" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "datenschutz_locales" (
  	"title" varchar DEFAULT 'Datenschutz',
  	"content" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "pages_blocks_hero" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_hero_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_service_tiles" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_service_tiles_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_packages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_packages_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_case_teaser" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_case_teaser_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_brand_showcase" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_brand_showcase_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_trust_bar" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_trust_bar_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_engagement_band" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_engagement_band_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_post_teaser" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_post_teaser_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_faq_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_faq_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_faq_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_cta" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_cta_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_text_image" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_text_image_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_hero" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_hero_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_service_tiles" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_service_tiles_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_packages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_packages_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_case_teaser" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_case_teaser_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_brand_showcase" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_brand_showcase_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_trust_bar" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_trust_bar_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_engagement_band" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_engagement_band_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_post_teaser" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_post_teaser_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_faq_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_faq_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_faq_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_cta" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_cta_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_text_image" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_text_image_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_packages_includes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_packages_includes_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_packages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_packages_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_steps_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_faq_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_version_packages_includes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_version_packages_includes_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_version_packages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_version_packages_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_version_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_version_steps_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_version_faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_version_faq_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "locations_faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "locations_faq_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "locations" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "locations_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_locations_v_version_faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_locations_v_version_faq_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_locations_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_locations_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cases_chips" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cases_chips_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cases_figures" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cases_figures_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cases" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cases_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cases_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_cases_v_version_chips" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_cases_v_version_chips_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_cases_v_version_figures" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_cases_v_version_figures_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_cases_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_cases_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_cases_v_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "engagements" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "engagements_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "engagements_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_faq_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_sources" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_version_faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_version_faq_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_version_sources" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "categories" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "categories_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "authors_same_as" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "authors" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "authors_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_company_area_served" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "navigation_header" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "navigation_header_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "navigation_footer_legal" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "navigation_footer_legal_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "navigation" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "trust_badges" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "trust" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "trust_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_agb_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_agb_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_widerruf_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_widerruf_v_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_hero" CASCADE;
  DROP TABLE "pages_blocks_hero_locales" CASCADE;
  DROP TABLE "pages_blocks_service_tiles" CASCADE;
  DROP TABLE "pages_blocks_service_tiles_locales" CASCADE;
  DROP TABLE "pages_blocks_packages" CASCADE;
  DROP TABLE "pages_blocks_packages_locales" CASCADE;
  DROP TABLE "pages_blocks_case_teaser" CASCADE;
  DROP TABLE "pages_blocks_case_teaser_locales" CASCADE;
  DROP TABLE "pages_blocks_brand_showcase" CASCADE;
  DROP TABLE "pages_blocks_brand_showcase_locales" CASCADE;
  DROP TABLE "pages_blocks_trust_bar" CASCADE;
  DROP TABLE "pages_blocks_trust_bar_locales" CASCADE;
  DROP TABLE "pages_blocks_engagement_band" CASCADE;
  DROP TABLE "pages_blocks_engagement_band_locales" CASCADE;
  DROP TABLE "pages_blocks_post_teaser" CASCADE;
  DROP TABLE "pages_blocks_post_teaser_locales" CASCADE;
  DROP TABLE "pages_blocks_faq_items" CASCADE;
  DROP TABLE "pages_blocks_faq_items_locales" CASCADE;
  DROP TABLE "pages_blocks_faq" CASCADE;
  DROP TABLE "pages_blocks_faq_locales" CASCADE;
  DROP TABLE "pages_blocks_cta" CASCADE;
  DROP TABLE "pages_blocks_cta_locales" CASCADE;
  DROP TABLE "pages_blocks_text_image" CASCADE;
  DROP TABLE "pages_blocks_text_image_locales" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "pages_locales" CASCADE;
  DROP TABLE "pages_rels" CASCADE;
  DROP TABLE "_pages_v_blocks_hero" CASCADE;
  DROP TABLE "_pages_v_blocks_hero_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_service_tiles" CASCADE;
  DROP TABLE "_pages_v_blocks_service_tiles_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_packages" CASCADE;
  DROP TABLE "_pages_v_blocks_packages_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_case_teaser" CASCADE;
  DROP TABLE "_pages_v_blocks_case_teaser_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_brand_showcase" CASCADE;
  DROP TABLE "_pages_v_blocks_brand_showcase_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_trust_bar" CASCADE;
  DROP TABLE "_pages_v_blocks_trust_bar_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_engagement_band" CASCADE;
  DROP TABLE "_pages_v_blocks_engagement_band_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_post_teaser" CASCADE;
  DROP TABLE "_pages_v_blocks_post_teaser_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_faq_items" CASCADE;
  DROP TABLE "_pages_v_blocks_faq_items_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_faq" CASCADE;
  DROP TABLE "_pages_v_blocks_faq_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_cta" CASCADE;
  DROP TABLE "_pages_v_blocks_cta_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_text_image" CASCADE;
  DROP TABLE "_pages_v_blocks_text_image_locales" CASCADE;
  DROP TABLE "_pages_v" CASCADE;
  DROP TABLE "_pages_v_locales" CASCADE;
  DROP TABLE "_pages_v_rels" CASCADE;
  DROP TABLE "services_packages_includes" CASCADE;
  DROP TABLE "services_packages_includes_locales" CASCADE;
  DROP TABLE "services_packages" CASCADE;
  DROP TABLE "services_packages_locales" CASCADE;
  DROP TABLE "services_steps" CASCADE;
  DROP TABLE "services_steps_locales" CASCADE;
  DROP TABLE "services_faq" CASCADE;
  DROP TABLE "services_faq_locales" CASCADE;
  DROP TABLE "services" CASCADE;
  DROP TABLE "services_locales" CASCADE;
  DROP TABLE "services_rels" CASCADE;
  DROP TABLE "_services_v_version_packages_includes" CASCADE;
  DROP TABLE "_services_v_version_packages_includes_locales" CASCADE;
  DROP TABLE "_services_v_version_packages" CASCADE;
  DROP TABLE "_services_v_version_packages_locales" CASCADE;
  DROP TABLE "_services_v_version_steps" CASCADE;
  DROP TABLE "_services_v_version_steps_locales" CASCADE;
  DROP TABLE "_services_v_version_faq" CASCADE;
  DROP TABLE "_services_v_version_faq_locales" CASCADE;
  DROP TABLE "_services_v" CASCADE;
  DROP TABLE "_services_v_locales" CASCADE;
  DROP TABLE "_services_v_rels" CASCADE;
  DROP TABLE "locations_faq" CASCADE;
  DROP TABLE "locations_faq_locales" CASCADE;
  DROP TABLE "locations" CASCADE;
  DROP TABLE "locations_locales" CASCADE;
  DROP TABLE "_locations_v_version_faq" CASCADE;
  DROP TABLE "_locations_v_version_faq_locales" CASCADE;
  DROP TABLE "_locations_v" CASCADE;
  DROP TABLE "_locations_v_locales" CASCADE;
  DROP TABLE "cases_chips" CASCADE;
  DROP TABLE "cases_chips_locales" CASCADE;
  DROP TABLE "cases_figures" CASCADE;
  DROP TABLE "cases_figures_locales" CASCADE;
  DROP TABLE "cases" CASCADE;
  DROP TABLE "cases_locales" CASCADE;
  DROP TABLE "cases_rels" CASCADE;
  DROP TABLE "_cases_v_version_chips" CASCADE;
  DROP TABLE "_cases_v_version_chips_locales" CASCADE;
  DROP TABLE "_cases_v_version_figures" CASCADE;
  DROP TABLE "_cases_v_version_figures_locales" CASCADE;
  DROP TABLE "_cases_v" CASCADE;
  DROP TABLE "_cases_v_locales" CASCADE;
  DROP TABLE "_cases_v_rels" CASCADE;
  DROP TABLE "engagements" CASCADE;
  DROP TABLE "engagements_locales" CASCADE;
  DROP TABLE "engagements_rels" CASCADE;
  DROP TABLE "posts_faq" CASCADE;
  DROP TABLE "posts_faq_locales" CASCADE;
  DROP TABLE "posts_sources" CASCADE;
  DROP TABLE "posts" CASCADE;
  DROP TABLE "posts_locales" CASCADE;
  DROP TABLE "posts_rels" CASCADE;
  DROP TABLE "_posts_v_version_faq" CASCADE;
  DROP TABLE "_posts_v_version_faq_locales" CASCADE;
  DROP TABLE "_posts_v_version_sources" CASCADE;
  DROP TABLE "_posts_v" CASCADE;
  DROP TABLE "_posts_v_locales" CASCADE;
  DROP TABLE "_posts_v_rels" CASCADE;
  DROP TABLE "categories" CASCADE;
  DROP TABLE "categories_locales" CASCADE;
  DROP TABLE "authors_same_as" CASCADE;
  DROP TABLE "authors" CASCADE;
  DROP TABLE "authors_locales" CASCADE;
  DROP TABLE "site_settings_company_area_served" CASCADE;
  DROP TABLE "navigation_header" CASCADE;
  DROP TABLE "navigation_header_locales" CASCADE;
  DROP TABLE "navigation_footer_legal" CASCADE;
  DROP TABLE "navigation_footer_legal_locales" CASCADE;
  DROP TABLE "navigation" CASCADE;
  DROP TABLE "trust_badges" CASCADE;
  DROP TABLE "trust" CASCADE;
  DROP TABLE "trust_locales" CASCADE;
  DROP TABLE "_agb_v" CASCADE;
  DROP TABLE "_agb_v_locales" CASCADE;
  DROP TABLE "_widerruf_v" CASCADE;
  DROP TABLE "_widerruf_v_locales" CASCADE;
  ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "users_author_id_authors_id_fk";
  
  ALTER TABLE "redirects_rels" DROP CONSTRAINT IF EXISTS "redirects_rels_pages_fk";
  
  ALTER TABLE "redirects_rels" DROP CONSTRAINT IF EXISTS "redirects_rels_services_fk";
  
  ALTER TABLE "redirects_rels" DROP CONSTRAINT IF EXISTS "redirects_rels_locations_fk";
  
  ALTER TABLE "redirects_rels" DROP CONSTRAINT IF EXISTS "redirects_rels_cases_fk";
  
  ALTER TABLE "redirects_rels" DROP CONSTRAINT IF EXISTS "redirects_rels_posts_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_pages_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_services_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_locations_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_cases_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_engagements_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_posts_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_categories_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_authors_fk";
  
  ALTER TABLE "site_settings" DROP CONSTRAINT IF EXISTS "site_settings_seo_default_og_image_id_media_id_fk";
  
  DROP INDEX IF EXISTS "users_username_idx";
  DROP INDEX IF EXISTS "users_author_idx";
  DROP INDEX IF EXISTS "redirects_rels_pages_id_idx";
  DROP INDEX IF EXISTS "redirects_rels_services_id_idx";
  DROP INDEX IF EXISTS "redirects_rels_locations_id_idx";
  DROP INDEX IF EXISTS "redirects_rels_cases_id_idx";
  DROP INDEX IF EXISTS "redirects_rels_posts_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_pages_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_services_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_locations_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_cases_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_engagements_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_posts_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_categories_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_authors_id_idx";
  DROP INDEX IF EXISTS "site_settings_seo_seo_default_og_image_idx";
  ALTER TABLE "site_settings" ALTER COLUMN "site_name" SET DEFAULT 'Beau-Marketing';
  ALTER TABLE "users" ADD COLUMN "name" varchar;
  UPDATE "users" SET "name" = nullif(btrim(concat_ws(' ', "first_name", "last_name")), '');
  ALTER TABLE "site_settings" ADD COLUMN "contact_email" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "contact_phone" varchar;
  ALTER TABLE "site_settings_locales" ADD COLUMN "tagline" varchar;
  ALTER TABLE "site_settings_locales" ADD COLUMN "contact_address" varchar;
  ALTER TABLE "site_settings_nav" ADD CONSTRAINT "site_settings_nav_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_nav_locales" ADD CONSTRAINT "site_settings_nav_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings_nav"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_social" ADD CONSTRAINT "site_settings_social_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "impressum_locales" ADD CONSTRAINT "impressum_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."impressum"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "datenschutz_locales" ADD CONSTRAINT "datenschutz_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."datenschutz"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "site_settings_nav_order_idx" ON "site_settings_nav" USING btree ("_order");
  CREATE INDEX "site_settings_nav_parent_id_idx" ON "site_settings_nav" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "site_settings_nav_locales_locale_parent_id_unique" ON "site_settings_nav_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "site_settings_social_order_idx" ON "site_settings_social" USING btree ("_order");
  CREATE INDEX "site_settings_social_parent_id_idx" ON "site_settings_social" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "impressum_locales_locale_parent_id_unique" ON "impressum_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "datenschutz_locales_locale_parent_id_unique" ON "datenschutz_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "brands" DROP COLUMN "status";
  ALTER TABLE "media" DROP COLUMN "credit_author";
  ALTER TABLE "media" DROP COLUMN "credit_source";
  ALTER TABLE "media" DROP COLUMN "credit_license";
  ALTER TABLE "users" DROP COLUMN "username";
  ALTER TABLE "users" DROP COLUMN "first_name";
  ALTER TABLE "users" DROP COLUMN "last_name";
  ALTER TABLE "users" DROP COLUMN "role";
  ALTER TABLE "users" DROP COLUMN "author_id";
  ALTER TABLE "redirects_rels" DROP COLUMN "pages_id";
  ALTER TABLE "redirects_rels" DROP COLUMN "services_id";
  ALTER TABLE "redirects_rels" DROP COLUMN "locations_id";
  ALTER TABLE "redirects_rels" DROP COLUMN "cases_id";
  ALTER TABLE "redirects_rels" DROP COLUMN "posts_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "pages_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "services_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "locations_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "cases_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "engagements_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "posts_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "categories_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "authors_id";
  ALTER TABLE "site_settings" DROP COLUMN "company_legal_name";
  ALTER TABLE "site_settings" DROP COLUMN "company_managing_director";
  ALTER TABLE "site_settings" DROP COLUMN "company_street";
  ALTER TABLE "site_settings" DROP COLUMN "company_postal_code";
  ALTER TABLE "site_settings" DROP COLUMN "company_city";
  ALTER TABLE "site_settings" DROP COLUMN "company_district";
  ALTER TABLE "site_settings" DROP COLUMN "company_country";
  ALTER TABLE "site_settings" DROP COLUMN "company_phone";
  ALTER TABLE "site_settings" DROP COLUMN "company_email";
  ALTER TABLE "site_settings" DROP COLUMN "company_register_court";
  ALTER TABLE "site_settings" DROP COLUMN "company_register_number";
  ALTER TABLE "site_settings" DROP COLUMN "company_vat_id";
  ALTER TABLE "site_settings" DROP COLUMN "company_latitude";
  ALTER TABLE "site_settings" DROP COLUMN "company_longitude";
  ALTER TABLE "site_settings" DROP COLUMN "company_hourly_rate";
  ALTER TABLE "site_settings" DROP COLUMN "contact_booking_url";
  ALTER TABLE "site_settings" DROP COLUMN "profiles_linkedin";
  ALTER TABLE "site_settings" DROP COLUMN "profiles_instagram";
  ALTER TABLE "site_settings" DROP COLUMN "profiles_google_business";
  ALTER TABLE "site_settings" DROP COLUMN "profiles_google_review_url";
  ALTER TABLE "site_settings" DROP COLUMN "seo_title_suffix";
  ALTER TABLE "site_settings" DROP COLUMN "seo_default_og_image_id";
  ALTER TABLE "site_settings_locales" DROP COLUMN "contact_hours";
  DROP TYPE "public"."enum_pages_blocks_text_image_image_position";
  DROP TYPE "public"."enum_pages_status";
  DROP TYPE "public"."enum__pages_v_blocks_text_image_image_position";
  DROP TYPE "public"."enum__pages_v_version_status";
  DROP TYPE "public"."enum__pages_v_published_locale";
  DROP TYPE "public"."enum_services_packages_unit";
  DROP TYPE "public"."enum_services_status";
  DROP TYPE "public"."enum__services_v_version_packages_unit";
  DROP TYPE "public"."enum__services_v_version_status";
  DROP TYPE "public"."enum__services_v_published_locale";
  DROP TYPE "public"."enum_locations_local_reference_type";
  DROP TYPE "public"."enum_locations_status";
  DROP TYPE "public"."enum__locations_v_version_local_reference_type";
  DROP TYPE "public"."enum__locations_v_version_status";
  DROP TYPE "public"."enum__locations_v_published_locale";
  DROP TYPE "public"."enum_cases_status";
  DROP TYPE "public"."enum__cases_v_version_status";
  DROP TYPE "public"."enum__cases_v_published_locale";
  DROP TYPE "public"."enum_brands_status";
  DROP TYPE "public"."enum_posts_status";
  DROP TYPE "public"."enum__posts_v_version_status";
  DROP TYPE "public"."enum__posts_v_published_locale";
  DROP TYPE "public"."enum_users_role";`)
}
