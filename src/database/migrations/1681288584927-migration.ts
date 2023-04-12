import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1681288584927 implements MigrationInterface {
  name = 'migration1681288584927';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "jobs" DROP COLUMN "scope_level"`);
    await queryRunner.query(`ALTER TABLE "jobs" DROP COLUMN "scope_time"`);
    await queryRunner.query(
      `ALTER TABLE "jobs" ADD "experience_level" character varying  NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "jobs" ADD "project_length" character varying  NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "jobs" DROP COLUMN "project_length"`);
    await queryRunner.query(
      `ALTER TABLE "jobs" DROP COLUMN "experience_level"`,
    );
    await queryRunner.query(
      `ALTER TABLE "jobs" ADD "scope_time" character varying  NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "jobs" ADD "scope_level" character varying  NULL`,
    );
  }
}
