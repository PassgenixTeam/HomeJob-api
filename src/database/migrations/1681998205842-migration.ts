import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1681998205842 implements MigrationInterface {
  name = 'migration1681998205842';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."offers_pay_type_enum" AS ENUM('hourly', 'fixed')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."offers_pay_status_enum" AS ENUM('pending', 'paid')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."offers_status_enum" AS ENUM('pending', 'accepted', 'rejected')`,
    );
    await queryRunner.query(
      `CREATE TABLE "offers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid, "updated_by" uuid, "deleted_at" TIMESTAMP, "deleted_by" uuid, "contract_id" uuid NOT NULL, "user_id" uuid NOT NULL, "job_id" uuid NOT NULL, "pay_type" "public"."offers_pay_type_enum" NOT NULL, "due_date" TIMESTAMP WITH TIME ZONE, "pay_fixed_price" double precision, "project_milestones" text, "deposit" double precision NOT NULL, "fee" double precision, "taxes" double precision, "total" double precision, "pay_status" "public"."offers_pay_status_enum" NOT NULL, "status" "public"."offers_status_enum" NOT NULL, CONSTRAINT "PK_4c88e956195bba85977da21b8f4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "offers" ADD CONSTRAINT "FK_2547a43d7409b85f70d4469c23a" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "offers" DROP CONSTRAINT "FK_2547a43d7409b85f70d4469c23a"`,
    );
    await queryRunner.query(`DROP TABLE "offers"`);
    await queryRunner.query(`DROP TYPE "public"."offers_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."offers_pay_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."offers_pay_type_enum"`);
  }
}
