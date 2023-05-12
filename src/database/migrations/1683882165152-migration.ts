import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1683882165152 implements MigrationInterface {
  name = 'migration1683882165152';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "contracts" ADD "company" text`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "contracts" DROP COLUMN "company"`);
  }
}
