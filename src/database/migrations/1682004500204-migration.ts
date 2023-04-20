import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1682004500204 implements MigrationInterface {
  name = 'migration1682004500204';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "offers" DROP CONSTRAINT "FK_2547a43d7409b85f70d4469c23a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "offers" RENAME COLUMN "user_id" TO "freelancer_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "offers" ADD CONSTRAINT "FK_76bb3409f785e94e88600eafac5" FOREIGN KEY ("freelancer_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "offers" DROP CONSTRAINT "FK_76bb3409f785e94e88600eafac5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "offers" RENAME COLUMN "freelancer_id" TO "user_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "offers" ADD CONSTRAINT "FK_2547a43d7409b85f70d4469c23a" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
