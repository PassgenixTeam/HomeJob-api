import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1681698498163 implements MigrationInterface {
  name = 'migration1681698498163';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "experiences" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid, "updated_by" uuid, "deleted_at" TIMESTAMP, "deleted_by" uuid, "subject" character varying NOT NULL, "description" character varying NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "PK_884f0913a63882712ea578e7c85" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "experiences" ADD CONSTRAINT "FK_99646b65b428fe670f2dc5aac77" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "experiences" DROP CONSTRAINT "FK_99646b65b428fe670f2dc5aac77"`,
    );
    await queryRunner.query(`DROP TABLE "experiences"`);
  }
}
