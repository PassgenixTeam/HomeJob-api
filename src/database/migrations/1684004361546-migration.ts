import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1684004361546 implements MigrationInterface {
  name = 'migration1684004361546';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "orai_wallet" character varying(255)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "orai_wallet"`);
  }
}
