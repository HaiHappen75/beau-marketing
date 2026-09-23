import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "locations_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "locations_highlights_locales" (
  	"item" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "locations_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"cases_id" integer
  );
  
  CREATE TABLE "_locations_v_version_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_locations_v_version_highlights_locales" (
  	"item" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_locations_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"cases_id" integer
  );
  
  ALTER TABLE "locations_locales" ADD COLUMN "headline" varchar;
  ALTER TABLE "locations_locales" ADD COLUMN "lead" varchar;
  ALTER TABLE "locations_locales" ADD COLUMN "intro_heading" varchar;
  ALTER TABLE "locations_locales" ADD COLUMN "distance" varchar;
  ALTER TABLE "_locations_v_locales" ADD COLUMN "version_headline" varchar;
  ALTER TABLE "_locations_v_locales" ADD COLUMN "version_lead" varchar;
  ALTER TABLE "_locations_v_locales" ADD COLUMN "version_intro_heading" varchar;
  ALTER TABLE "_locations_v_locales" ADD COLUMN "version_distance" varchar;
  ALTER TABLE "locations_highlights" ADD CONSTRAINT "locations_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "locations_highlights_locales" ADD CONSTRAINT "locations_highlights_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."locations_highlights"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "locations_rels" ADD CONSTRAINT "locations_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "locations_rels" ADD CONSTRAINT "locations_rels_cases_fk" FOREIGN KEY ("cases_id") REFERENCES "public"."cases"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_locations_v_version_highlights" ADD CONSTRAINT "_locations_v_version_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_locations_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_locations_v_version_highlights_locales" ADD CONSTRAINT "_locations_v_version_highlights_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_locations_v_version_highlights"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_locations_v_rels" ADD CONSTRAINT "_locations_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_locations_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_locations_v_rels" ADD CONSTRAINT "_locations_v_rels_cases_fk" FOREIGN KEY ("cases_id") REFERENCES "public"."cases"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "locations_highlights_order_idx" ON "locations_highlights" USING btree ("_order");
  CREATE INDEX "locations_highlights_parent_id_idx" ON "locations_highlights" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "locations_highlights_locales_locale_parent_id_unique" ON "locations_highlights_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "locations_rels_order_idx" ON "locations_rels" USING btree ("order");
  CREATE INDEX "locations_rels_parent_idx" ON "locations_rels" USING btree ("parent_id");
  CREATE INDEX "locations_rels_path_idx" ON "locations_rels" USING btree ("path");
  CREATE INDEX "locations_rels_cases_id_idx" ON "locations_rels" USING btree ("cases_id");
  CREATE INDEX "_locations_v_version_highlights_order_idx" ON "_locations_v_version_highlights" USING btree ("_order");
  CREATE INDEX "_locations_v_version_highlights_parent_id_idx" ON "_locations_v_version_highlights" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_locations_v_version_highlights_locales_locale_parent_id_uni" ON "_locations_v_version_highlights_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_locations_v_rels_order_idx" ON "_locations_v_rels" USING btree ("order");
  CREATE INDEX "_locations_v_rels_parent_idx" ON "_locations_v_rels" USING btree ("parent_id");
  CREATE INDEX "_locations_v_rels_path_idx" ON "_locations_v_rels" USING btree ("path");
  CREATE INDEX "_locations_v_rels_cases_id_idx" ON "_locations_v_rels" USING btree ("cases_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "locations_highlights" CASCADE;
  DROP TABLE "locations_highlights_locales" CASCADE;
  DROP TABLE "locations_rels" CASCADE;
  DROP TABLE "_locations_v_version_highlights" CASCADE;
  DROP TABLE "_locations_v_version_highlights_locales" CASCADE;
  DROP TABLE "_locations_v_rels" CASCADE;
  ALTER TABLE "locations_locales" DROP COLUMN "headline";
  ALTER TABLE "locations_locales" DROP COLUMN "lead";
  ALTER TABLE "locations_locales" DROP COLUMN "intro_heading";
  ALTER TABLE "locations_locales" DROP COLUMN "distance";
  ALTER TABLE "_locations_v_locales" DROP COLUMN "version_headline";
  ALTER TABLE "_locations_v_locales" DROP COLUMN "version_lead";
  ALTER TABLE "_locations_v_locales" DROP COLUMN "version_intro_heading";
  ALTER TABLE "_locations_v_locales" DROP COLUMN "version_distance";`)
}
