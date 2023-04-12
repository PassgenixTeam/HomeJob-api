import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1681284239743 implements MigrationInterface {
  name = 'migration1681284239743';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "mapping_job_skills" DROP CONSTRAINT "FK_24bb6d0343404efad8334429ce6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mapping_job_skills" DROP CONSTRAINT "FK_99584e82207261ff8b0b0332193"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mapping_job_skills" ALTER COLUMN "job_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "mapping_job_skills" ALTER COLUMN "skill_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "mapping_job_skills" ADD CONSTRAINT "FK_24bb6d0343404efad8334429ce6" FOREIGN KEY ("job_id") REFERENCES "jobs"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "mapping_job_skills" ADD CONSTRAINT "FK_99584e82207261ff8b0b0332193" FOREIGN KEY ("skill_id") REFERENCES "sub_skills"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "mapping_job_skills" DROP CONSTRAINT "FK_99584e82207261ff8b0b0332193"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mapping_job_skills" DROP CONSTRAINT "FK_24bb6d0343404efad8334429ce6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mapping_job_skills" ALTER COLUMN "skill_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "mapping_job_skills" ALTER COLUMN "job_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "mapping_job_skills" ADD CONSTRAINT "FK_99584e82207261ff8b0b0332193" FOREIGN KEY ("skill_id") REFERENCES "sub_skills"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "mapping_job_skills" ADD CONSTRAINT "FK_24bb6d0343404efad8334429ce6" FOREIGN KEY ("job_id") REFERENCES "jobs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
