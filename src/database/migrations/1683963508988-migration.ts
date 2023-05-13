import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1683963508988 implements MigrationInterface {
  name = 'migration1683963508988';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "jobs" ALTER COLUMN "scope_type" SET DEFAULT 'small'`,
    );
    await queryRunner.query(
      `ALTER TABLE "jobs" ALTER COLUMN "experience_level" SET DEFAULT 'entry_level'`,
    );
    await queryRunner.query(
      `ALTER TABLE "jobs" ALTER COLUMN "project_length" SET DEFAULT 'less_than_one_month'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "jobs" ALTER COLUMN "project_length" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "jobs" ALTER COLUMN "experience_level" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "jobs" ALTER COLUMN "scope_type" DROP DEFAULT`,
    );
  }
}
