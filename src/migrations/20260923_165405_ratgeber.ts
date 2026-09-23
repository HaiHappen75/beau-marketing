import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "posts" ADD COLUMN "cta_package" varchar;
  ALTER TABLE "_posts_v" ADD COLUMN "version_cta_package" varchar;
  ALTER TABLE "authors" ADD COLUMN "about_path" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "posts" DROP COLUMN "cta_package";
  ALTER TABLE "_posts_v" DROP COLUMN "version_cta_package";
  ALTER TABLE "authors" DROP COLUMN "about_path";`)
}
