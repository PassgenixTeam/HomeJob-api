import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1683964170518 implements MigrationInterface {
  name = 'migration1683964170518';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "jobs" ALTER COLUMN "attachments" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "jobs" ALTER COLUMN "attachments" SET NOT NULL`,
    );
  }
}
