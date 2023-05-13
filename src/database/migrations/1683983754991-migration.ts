import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1683983754991 implements MigrationInterface {
  name = 'migration1683983754991';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "bidding_contracts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid, "updated_by" uuid, "deleted_at" TIMESTAMP, "deleted_by" uuid, "contractor_id" uuid NOT NULL, "job_id" uuid NOT NULL, "owner_id" uuid NOT NULL, "information" text, CONSTRAINT "PK_a3e9c4947d46c565c06f610120a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "bidding_contracts" ADD CONSTRAINT "FK_1a5107dc2de72c3ce62a4f4a29e" FOREIGN KEY ("contractor_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bidding_contracts" ADD CONSTRAINT "FK_2fcc18cd922c67323ff40edd187" FOREIGN KEY ("job_id") REFERENCES "jobs"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bidding_contracts" ADD CONSTRAINT "FK_f1928278551cb88e67237cfe311" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bidding_contracts" DROP CONSTRAINT "FK_f1928278551cb88e67237cfe311"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bidding_contracts" DROP CONSTRAINT "FK_2fcc18cd922c67323ff40edd187"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bidding_contracts" DROP CONSTRAINT "FK_1a5107dc2de72c3ce62a4f4a29e"`,
    );
    await queryRunner.query(`DROP TABLE "bidding_contracts"`);
  }
}
