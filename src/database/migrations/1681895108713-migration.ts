import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1681895108713 implements MigrationInterface {
  name = 'migration1681895108713';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "mapping_user_skills" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid, "updated_by" uuid, "deleted_at" TIMESTAMP, "deleted_by" uuid, "user_id" uuid NOT NULL, "sub_skill_id" uuid NOT NULL, CONSTRAINT "PK_55fa3b73f3d547aa8a5a9d14ec8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "sub_categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid, "updated_by" uuid, "deleted_at" TIMESTAMP, "deleted_by" uuid, "name" character varying NOT NULL, "category_id" uuid NOT NULL, CONSTRAINT "PK_f319b046685c0e07287e76c5ab1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid, "updated_by" uuid, "deleted_at" TIMESTAMP, "deleted_by" uuid, "name" character varying NOT NULL, CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "mapping_user_skills" ADD CONSTRAINT "FK_03d669dd083b9d9eff359ffa354" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "mapping_user_skills" ADD CONSTRAINT "FK_0e8120f49f3df2de9203bdae0ec" FOREIGN KEY ("sub_skill_id") REFERENCES "sub_skills"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sub_categories" ADD CONSTRAINT "FK_7a424f07f46010d3441442f7764" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "sub_categories" DROP CONSTRAINT "FK_7a424f07f46010d3441442f7764"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mapping_user_skills" DROP CONSTRAINT "FK_0e8120f49f3df2de9203bdae0ec"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mapping_user_skills" DROP CONSTRAINT "FK_03d669dd083b9d9eff359ffa354"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sub_skills" ALTER COLUMN "order" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "skills" ALTER COLUMN "order" DROP NOT NULL`,
    );
    await queryRunner.query(`DROP TABLE "categories"`);
    await queryRunner.query(`DROP TABLE "sub_categories"`);
    await queryRunner.query(`DROP TABLE "mapping_user_skills"`);
  }
}
