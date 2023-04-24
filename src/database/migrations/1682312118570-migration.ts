import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1682312118570 implements MigrationInterface {
  name = 'migration1682312118570';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."project_milestones_freelancer_confirm_status_enum" AS ENUM('pending', 'accepted', 'rejected')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."project_milestones_status_enum" AS ENUM('active_and_funded', 'paid', 'pending')`,
    );
    await queryRunner.query(
      `CREATE TABLE "project_milestones" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid, "updated_by" uuid, "deleted_at" TIMESTAMP, "deleted_by" uuid, "title" character varying(255) NOT NULL, "description" character varying(1000) NOT NULL, "amount" double precision NOT NULL, "due_date" TIMESTAMP WITH TIME ZONE NOT NULL, "contract_id" uuid NOT NULL, "is_paid" boolean NOT NULL DEFAULT false, "freelancer_confirm_status" "public"."project_milestones_freelancer_confirm_status_enum" NOT NULL DEFAULT 'pending', "status" "public"."project_milestones_status_enum" NOT NULL, CONSTRAINT "PK_0c561300a12c6ba3ad793dff4b8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."contracts_pay_type_enum" AS ENUM('hourly', 'fixed')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."contracts_offer_status_enum" AS ENUM('pending', 'accepted', 'rejected')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."contracts_pay_status_enum" AS ENUM('pending', 'paid')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."contracts_status_enum" AS ENUM('pending', 'started', 'completed', 'cancelled')`,
    );
    await queryRunner.query(
      `CREATE TABLE "contracts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid, "updated_by" uuid, "deleted_at" TIMESTAMP, "deleted_by" uuid, "contract_id" uuid NOT NULL, "freelancer_id" uuid NOT NULL, "job_id" uuid NOT NULL, "pay_type" "public"."contracts_pay_type_enum" NOT NULL, "due_date" TIMESTAMP WITH TIME ZONE, "pay_fixed_price" double precision, "offer_status" "public"."contracts_offer_status_enum" NOT NULL, "deposit" double precision NOT NULL, "fee" double precision, "taxes" double precision, "total" double precision, "pay_status" "public"."contracts_pay_status_enum" NOT NULL, "status" "public"."contracts_status_enum" NOT NULL, CONSTRAINT "PK_2c7b8f3a7b1acdd49497d83d0fb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."jobs_job_type_enum" AS ENUM('draft', 'pending', 'public')`,
    );
    await queryRunner.query(
      `ALTER TABLE "jobs" ADD "job_type" "public"."jobs_job_type_enum" NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "jobs" DROP COLUMN "title"`);
    await queryRunner.query(
      `ALTER TABLE "jobs" ADD "title" character varying(255) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "jobs" DROP COLUMN "description"`);
    await queryRunner.query(
      `ALTER TABLE "jobs" ADD "description" text NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "jobs" DROP COLUMN "scope_type"`);
    await queryRunner.query(
      `CREATE TYPE "public"."jobs_scope_type_enum" AS ENUM('large', 'medium', 'small')`,
    );
    await queryRunner.query(
      `ALTER TABLE "jobs" ADD "scope_type" "public"."jobs_scope_type_enum" NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "jobs" DROP COLUMN "experience_level"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."jobs_experience_level_enum" AS ENUM('entry_level', 'intermediate', 'expert')`,
    );
    await queryRunner.query(
      `ALTER TABLE "jobs" ADD "experience_level" "public"."jobs_experience_level_enum" NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "jobs" DROP COLUMN "project_length"`);
    await queryRunner.query(
      `CREATE TYPE "public"."jobs_project_length_enum" AS ENUM('less_than_one_month', 'one_to_three_months', 'three_to_six_months', 'more_than_six_months')`,
    );
    await queryRunner.query(
      `ALTER TABLE "jobs" ADD "project_length" "public"."jobs_project_length_enum" NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "jobs" DROP COLUMN "budget"`);
    await queryRunner.query(`ALTER TABLE "jobs" ADD "budget" double precision`);
    await queryRunner.query(
      `ALTER TABLE "jobs" ALTER COLUMN "hourly_to" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "jobs" ALTER COLUMN "hourly_from" DROP NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "jobs" DROP COLUMN "attachments"`);
    await queryRunner.query(
      `ALTER TABLE "jobs" ADD "attachments" text NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "jobs" DROP COLUMN "status"`);
    await queryRunner.query(
      `CREATE TYPE "public"."jobs_status_enum" AS ENUM('draft', 'pending', 'public')`,
    );
    await queryRunner.query(
      `ALTER TABLE "jobs" ADD "status" "public"."jobs_status_enum" NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_milestones" ADD CONSTRAINT "FK_2b21da3b280a42e980f5ce717b0" FOREIGN KEY ("contract_id") REFERENCES "contracts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "contracts" ADD CONSTRAINT "FK_a94ffd0b1a052fddaa84d4cb186" FOREIGN KEY ("freelancer_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "contracts" DROP CONSTRAINT "FK_a94ffd0b1a052fddaa84d4cb186"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_milestones" DROP CONSTRAINT "FK_2b21da3b280a42e980f5ce717b0"`,
    );
    await queryRunner.query(`ALTER TABLE "jobs" DROP COLUMN "status"`);
    await queryRunner.query(`DROP TYPE "public"."jobs_status_enum"`);
    await queryRunner.query(
      `ALTER TABLE "jobs" ADD "status" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "jobs" DROP COLUMN "attachments"`);
    await queryRunner.query(
      `ALTER TABLE "jobs" ADD "attachments" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "jobs" ALTER COLUMN "hourly_from" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "jobs" ALTER COLUMN "hourly_to" SET NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "jobs" DROP COLUMN "budget"`);
    await queryRunner.query(`ALTER TABLE "jobs" ADD "budget" integer NOT NULL`);
    await queryRunner.query(`ALTER TABLE "jobs" DROP COLUMN "project_length"`);
    await queryRunner.query(`DROP TYPE "public"."jobs_project_length_enum"`);
    await queryRunner.query(
      `ALTER TABLE "jobs" ADD "project_length" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "jobs" DROP COLUMN "experience_level"`,
    );
    await queryRunner.query(`DROP TYPE "public"."jobs_experience_level_enum"`);
    await queryRunner.query(
      `ALTER TABLE "jobs" ADD "experience_level" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "jobs" DROP COLUMN "scope_type"`);
    await queryRunner.query(`DROP TYPE "public"."jobs_scope_type_enum"`);
    await queryRunner.query(
      `ALTER TABLE "jobs" ADD "scope_type" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "jobs" DROP COLUMN "description"`);
    await queryRunner.query(
      `ALTER TABLE "jobs" ADD "description" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "jobs" DROP COLUMN "title"`);
    await queryRunner.query(
      `ALTER TABLE "jobs" ADD "title" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "jobs" DROP COLUMN "job_type"`);
    await queryRunner.query(`DROP TYPE "public"."jobs_job_type_enum"`);
    await queryRunner.query(`DROP TABLE "contracts"`);
    await queryRunner.query(`DROP TYPE "public"."contracts_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."contracts_pay_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."contracts_offer_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."contracts_pay_type_enum"`);
    await queryRunner.query(`DROP TABLE "project_milestones"`);
    await queryRunner.query(
      `DROP TYPE "public"."project_milestones_status_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."project_milestones_freelancer_confirm_status_enum"`,
    );
  }
}
