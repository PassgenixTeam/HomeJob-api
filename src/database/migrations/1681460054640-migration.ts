import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1681460054640 implements MigrationInterface {
  name = 'migration1681460054640';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project" RENAME COLUMN "attach_file" TO "attachments"`,
    );
    await queryRunner.query(
      `ALTER TABLE "employment" DROP COLUMN "from_month"`,
    );
    await queryRunner.query(
      `ALTER TABLE "employment" ADD "from_month" integer NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "employment" DROP COLUMN "from_year"`);
    await queryRunner.query(
      `ALTER TABLE "employment" ADD "from_year" integer NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "employment" DROP COLUMN "to_month"`);
    await queryRunner.query(
      `ALTER TABLE "employment" ADD "to_month" integer NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "employment" DROP COLUMN "to_year"`);
    await queryRunner.query(
      `ALTER TABLE "employment" ADD "to_year" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "employment" DROP COLUMN "is_currently"`,
    );
    await queryRunner.query(
      `ALTER TABLE "employment" ADD "is_currently" boolean NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "employment" DROP COLUMN "is_currently"`,
    );
    await queryRunner.query(
      `ALTER TABLE "employment" ADD "is_currently" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "employment" DROP COLUMN "to_year"`);
    await queryRunner.query(
      `ALTER TABLE "employment" ADD "to_year" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "employment" DROP COLUMN "to_month"`);
    await queryRunner.query(
      `ALTER TABLE "employment" ADD "to_month" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "employment" DROP COLUMN "from_year"`);
    await queryRunner.query(
      `ALTER TABLE "employment" ADD "from_year" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "employment" DROP COLUMN "from_month"`,
    );
    await queryRunner.query(
      `ALTER TABLE "employment" ADD "from_month" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" RENAME COLUMN "attachments" TO "attach_file"`,
    );
  }
}
