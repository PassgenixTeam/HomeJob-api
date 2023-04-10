import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1681111116315 implements MigrationInterface {
  name = 'migration1681111116315';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "transaction" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid, "updated_by" uuid, "deleted_at" TIMESTAMP, "deleted_by" uuid, "type" character varying NOT NULL, "ref_id" character varying NOT NULL, "amount" integer NOT NULL, "description" character varying NOT NULL, "balance" integer NOT NULL, "payment_method_id" uuid NOT NULL, "freelancer_id" uuid, CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "balance" double precision NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "coin" double precision NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_50cbfefd92ed4c857c0bafb9708" FOREIGN KEY ("freelancer_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_25b1234bd0af272d259fe5e38de" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_cecf231b4a8cee7c27d539e0956" FOREIGN KEY ("payment_method_id") REFERENCES "payment_methods"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_cecf231b4a8cee7c27d539e0956"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_25b1234bd0af272d259fe5e38de"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_50cbfefd92ed4c857c0bafb9708"`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "coin"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "balance"`);
    await queryRunner.query(`DROP TABLE "transaction"`);
  }
}
