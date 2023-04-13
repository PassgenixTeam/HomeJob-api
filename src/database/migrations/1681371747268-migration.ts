import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1681371747268 implements MigrationInterface {
  name = 'migration1681371747268';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "proposals" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid, "updated_by" uuid, "deleted_at" TIMESTAMP, "deleted_by" uuid, "job_id" uuid NOT NULL, "paid_type" character varying NOT NULL, "amount" integer NOT NULL, "milestones" character varying NOT NULL, "project_long" character varying NOT NULL, "cover_letter" character varying NOT NULL, "attachments" character varying NOT NULL, "boost_coin" integer NOT NULL, "boost_time" integer NOT NULL, CONSTRAINT "PK_db524c8db8e126a38a2f16d8cac" PRIMARY KEY ("id"))`,
    );
    // await queryRunner.query(
    //   `ALTER TABLE "jobs" ALTER COLUMN "experience_level" SET NULL`,
    // );
    // await queryRunner.query(
    //   `ALTER TABLE "jobs" ALTER COLUMN "project_length" SET NULL`,
    // );
    await queryRunner.query(
      `ALTER TABLE "proposals" ADD CONSTRAINT "FK_0b6dc5b941879ad3f581a8ad3fe" FOREIGN KEY ("job_id") REFERENCES "jobs"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "proposals" DROP CONSTRAINT "FK_0b6dc5b941879ad3f581a8ad3fe"`,
    );
    await queryRunner.query(
      `ALTER TABLE "jobs" ALTER COLUMN "project_length" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "jobs" ALTER COLUMN "experience_level" DROP NOT NULL`,
    );
    await queryRunner.query(`DROP TABLE "proposals"`);
  }
}
