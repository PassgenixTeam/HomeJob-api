import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1683963321125 implements MigrationInterface {
  name = 'migration1683963321125';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "jobs" ADD "estimate" integer NOT NULL DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "jobs" DROP COLUMN "estimate"`);
  }
}
