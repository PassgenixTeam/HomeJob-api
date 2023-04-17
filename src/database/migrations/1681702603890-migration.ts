import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1681702603890 implements MigrationInterface {
  name = 'migration1681702603890';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "mapping_user_languages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid, "updated_by" uuid, "deleted_at" TIMESTAMP, "deleted_by" uuid, "user_id" uuid NOT NULL, "language_id" uuid NOT NULL, "level" character varying NOT NULL, CONSTRAINT "PK_33ebf5e62c70e022287aacb8c84" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "languages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid, "updated_by" uuid, "deleted_at" TIMESTAMP, "deleted_by" uuid, "name" character varying NOT NULL, CONSTRAINT "PK_b517f827ca496b29f4d549c631d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "jobs" ALTER COLUMN "subtitle" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "mapping_user_languages" ADD CONSTRAINT "FK_a372fe3845fd868012524f2a587" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "mapping_user_languages" ADD CONSTRAINT "FK_1663b2dff75dbbe9486b1c20604" FOREIGN KEY ("language_id") REFERENCES "languages"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "mapping_user_languages" DROP CONSTRAINT "FK_1663b2dff75dbbe9486b1c20604"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mapping_user_languages" DROP CONSTRAINT "FK_a372fe3845fd868012524f2a587"`,
    );
    await queryRunner.query(
      `ALTER TABLE "jobs" ALTER COLUMN "subtitle" SET NOT NULL`,
    );
    await queryRunner.query(`DROP TABLE "languages"`);
    await queryRunner.query(`DROP TABLE "mapping_user_languages"`);
  }
}
