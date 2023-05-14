import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1684030990083 implements MigrationInterface {
  name = 'migration1684030990083';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bidding_contracts" ADD "orai_file" character varying(1000)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bidding_contracts" DROP COLUMN "orai_file"`,
    );
  }
}
