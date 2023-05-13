import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1684005405157 implements MigrationInterface {
  name = 'migration1684005405157';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bidding_contracts" ADD "approved_tx_hash" character varying(255)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bidding_contracts" DROP COLUMN "approved_tx_hash"`,
    );
  }
}
