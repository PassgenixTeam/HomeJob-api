import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1682520389501 implements MigrationInterface {
  name = 'migration1682520389501';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "contract_to_hire" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."users_hours_per_week_enum" RENAME TO "users_hours_per_week_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_hours_per_week_enum" AS ENUM('More than 30h per week', 'less than 30h per week', 'As need open to offer', 'None')`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "hours_per_week" TYPE "public"."users_hours_per_week_enum" USING "hours_per_week"::"text"::"public"."users_hours_per_week_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."users_hours_per_week_enum_old"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."users_hours_per_week_enum_old" AS ENUM('more_than_30h_per_week', 'less_than_30h_per_week', 'as_need_open_to_offer', 'none')`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "hours_per_week" TYPE "public"."users_hours_per_week_enum_old" USING "hours_per_week"::"text"::"public"."users_hours_per_week_enum_old"`,
    );
    await queryRunner.query(`DROP TYPE "public"."users_hours_per_week_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."users_hours_per_week_enum_old" RENAME TO "users_hours_per_week_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN "contract_to_hire"`,
    );
  }
}
