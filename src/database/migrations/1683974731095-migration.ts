import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1683974731095 implements MigrationInterface {
  name = 'migration1683974731095';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "proposals" ADD "estimate_budget" double precision NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "proposals" DROP COLUMN "estimated_time"`,
    );
    await queryRunner.query(
      `ALTER TABLE "proposals" ADD "estimated_time" integer NOT NULL DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "proposals" DROP COLUMN "estimated_time"`,
    );
    await queryRunner.query(
      `ALTER TABLE "proposals" ADD "estimated_time" double precision NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "proposals" DROP COLUMN "estimate_budget"`,
    );
  }
}
