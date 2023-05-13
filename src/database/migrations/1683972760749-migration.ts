import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1683972760749 implements MigrationInterface {
  name = 'migration1683972760749';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "proposals" ADD "estimated_time" double precision NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "proposals" ADD "estimated_labor" integer NOT NULL DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "proposals" DROP COLUMN "estimated_labor"`,
    );
    await queryRunner.query(
      `ALTER TABLE "proposals" DROP COLUMN "estimated_time"`,
    );
  }
}
