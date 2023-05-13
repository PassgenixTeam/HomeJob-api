import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1684000266916 implements MigrationInterface {
  name = 'migration1684000266916';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bidding_contracts" ADD "tx_hash" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "bidding_contracts" ADD "orai_job_id" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "jobs" ADD "tx_hash" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "jobs" ADD "orai_job_id" character varying(255)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "jobs" DROP COLUMN "orai_job_id"`);
    await queryRunner.query(`ALTER TABLE "jobs" DROP COLUMN "tx_hash"`);
    await queryRunner.query(
      `ALTER TABLE "bidding_contracts" DROP COLUMN "orai_job_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bidding_contracts" DROP COLUMN "tx_hash"`,
    );
  }
}
