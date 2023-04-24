import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1682328408928 implements MigrationInterface {
  name = 'migration1682328408928';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."jobs_job_type_enum" RENAME TO "jobs_job_type_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."jobs_job_type_enum" AS ENUM('hourly', 'fixed')`,
    );
    await queryRunner.query(
      `ALTER TABLE "jobs" ALTER COLUMN "job_type" TYPE "public"."jobs_job_type_enum" USING "job_type"::"text"::"public"."jobs_job_type_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."jobs_job_type_enum_old"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."jobs_job_type_enum_old" AS ENUM('draft', 'pending', 'public')`,
    );
    await queryRunner.query(
      `ALTER TABLE "jobs" ALTER COLUMN "job_type" TYPE "public"."jobs_job_type_enum_old" USING "job_type"::"text"::"public"."jobs_job_type_enum_old"`,
    );
    await queryRunner.query(`DROP TYPE "public"."jobs_job_type_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."jobs_job_type_enum_old" RENAME TO "jobs_job_type_enum"`,
    );
  }
}
