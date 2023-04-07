import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1680770762788 implements MigrationInterface {
  name = 'migration1680770762788';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "mapping_job_skills" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid, "updated_by" uuid, "deleted_at" TIMESTAMP, "deleted_by" uuid, "job_id" uuid, "skill_id" uuid, CONSTRAINT "PK_e79f7520e4139703c27c70b6b1e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "mapping_job_skills" ADD CONSTRAINT "FK_24bb6d0343404efad8334429ce6" FOREIGN KEY ("job_id") REFERENCES "jobs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "mapping_job_skills" ADD CONSTRAINT "FK_99584e82207261ff8b0b0332193" FOREIGN KEY ("skill_id") REFERENCES "sub_skills"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "mapping_job_skills" DROP CONSTRAINT "FK_99584e82207261ff8b0b0332193"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mapping_job_skills" DROP CONSTRAINT "FK_24bb6d0343404efad8334429ce6"`,
    );
    await queryRunner.query(`DROP TABLE "mapping_job_skills"`);
  }
}
