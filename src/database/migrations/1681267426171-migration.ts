import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1681267426171 implements MigrationInterface {
  name = 'migration1681267426171';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."files_status_enum" AS ENUM('pending', 'using', 'deleted')`,
    );
    await queryRunner.query(
      `CREATE TABLE "files" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid, "updated_by" uuid, "deleted_at" TIMESTAMP, "deleted_by" uuid, "type" character varying NOT NULL, "size" integer NOT NULL, "url" character varying NOT NULL, "key" character varying NOT NULL, "status" "public"."files_status_enum" NOT NULL, CONSTRAINT "PK_6c16b9093a142e0e7613b04a3d9" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "files"`);
    await queryRunner.query(`DROP TYPE "public"."files_status_enum"`);
  }
}
