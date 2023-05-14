import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1684032868725 implements MigrationInterface {
  name = 'migration1684032868725';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "jobs" ADD "orai_project" character varying(1000)`,
    );
    await queryRunner.query(
      `ALTER TABLE "proposals" ADD "orai_project" character varying(1000)`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ALTER COLUMN "type" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ALTER COLUMN "ref_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ALTER COLUMN "amount" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ALTER COLUMN "description" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ALTER COLUMN "balance" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" ALTER COLUMN "balance" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ALTER COLUMN "description" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ALTER COLUMN "amount" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ALTER COLUMN "ref_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ALTER COLUMN "type" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "proposals" DROP COLUMN "orai_project"`,
    );
    await queryRunner.query(`ALTER TABLE "jobs" DROP COLUMN "orai_project"`);
  }
}
