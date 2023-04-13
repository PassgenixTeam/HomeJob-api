import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1681374755042 implements MigrationInterface {
  name = 'migration1681374755042';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "proposals" DROP COLUMN "boost_time"`);
    await queryRunner.query(
      `ALTER TABLE "proposals" ADD "boost_time" TIMESTAMP NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "proposals" ADD CONSTRAINT "FK_efa4cb7bcb6f3003413a6987440" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "proposals" DROP CONSTRAINT "FK_efa4cb7bcb6f3003413a6987440"`,
    );
    await queryRunner.query(`ALTER TABLE "proposals" DROP COLUMN "boost_time"`);
    await queryRunner.query(
      `ALTER TABLE "proposals" ADD "boost_time" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "jobs" ALTER COLUMN "project_length" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "jobs" ALTER COLUMN "experience_level" DROP NOT NULL`,
    );
  }
}
