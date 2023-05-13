import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1683994014663 implements MigrationInterface {
  name = 'migration1683994014663';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bidding_contracts" ADD "status" character varying(50)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bidding_contracts" DROP COLUMN "status"`,
    );
  }
}
