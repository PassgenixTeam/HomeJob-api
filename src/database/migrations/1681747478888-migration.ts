import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1681747478888 implements MigrationInterface {
  name = 'migration1681747478888';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_50cbfefd92ed4c857c0bafb9708"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "freelancer_id"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "freelancer_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_50cbfefd92ed4c857c0bafb9708" FOREIGN KEY ("freelancer_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
