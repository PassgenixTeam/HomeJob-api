import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1681704850471 implements MigrationInterface {
  name = 'migration1681704850471';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "skills" ADD "order" integer  NULL`);
    await queryRunner.query(
      `ALTER TABLE "sub_skills" ADD "order" integer  NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "sub_skills" DROP COLUMN "order"`);
    await queryRunner.query(`ALTER TABLE "skills" DROP COLUMN "order"`);
  }
}
