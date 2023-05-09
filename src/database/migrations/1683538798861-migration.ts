import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1683538798861 implements MigrationInterface {
  name = 'migration1683538798861';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "proposals" ADD "bid" double precision DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "proposals" DROP COLUMN "bid"`);
  }
}
