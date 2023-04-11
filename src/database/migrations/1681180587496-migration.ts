import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1681180587496 implements MigrationInterface {
  name = 'migration1681180587496';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "coins" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid, "updated_by" uuid, "deleted_at" TIMESTAMP, "deleted_by" uuid, "title" character varying NOT NULL, "reason" character varying NOT NULL, "coin" integer NOT NULL, "balance" integer NOT NULL, "type" character varying NOT NULL, "user_id" uuid, CONSTRAINT "PK_af01e5dcef2c05e6385611205c6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "coins" ADD CONSTRAINT "FK_aa6cb7b2b98c1d3c6118c06046c" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "coins" DROP CONSTRAINT "FK_aa6cb7b2b98c1d3c6118c06046c"`,
    );
    await queryRunner.query(`DROP TABLE "coins"`);
  }
}
