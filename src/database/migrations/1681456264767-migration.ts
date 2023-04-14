import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1681456264767 implements MigrationInterface {
  name = 'migration1681456264767';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "employment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid, "updated_by" uuid, "deleted_at" TIMESTAMP, "deleted_by" uuid, "company" character varying NOT NULL, "city" character varying NOT NULL, "country" character varying NOT NULL, "title" character varying NOT NULL, "from_month" character varying NOT NULL, "from_year" character varying NOT NULL, "to_month" character varying NOT NULL, "to_year" character varying NOT NULL, "is_currently" character varying NOT NULL, "description" character varying NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "PK_80e1cceae89697b78db5c953776" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "employment" ADD CONSTRAINT "FK_881c23453e324de0a66c3c16f14" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "employment" DROP CONSTRAINT "FK_881c23453e324de0a66c3c16f14"`,
    );
    await queryRunner.query(`DROP TABLE "employment"`);
  }
}
