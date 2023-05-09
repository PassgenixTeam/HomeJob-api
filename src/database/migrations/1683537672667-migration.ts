import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1683537672667 implements MigrationInterface {
  name = 'migration1683537672667';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "proposals" DROP COLUMN "amount"`);
    await queryRunner.query(
      `ALTER TABLE "proposals" ADD "amount" double precision DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "proposals" DROP COLUMN "amount"`);
    await queryRunner.query(
      `ALTER TABLE "proposals" ADD "amount" integer DEFAULT '0'`,
    );
  }
}
