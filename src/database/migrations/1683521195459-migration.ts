import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1683521195459 implements MigrationInterface {
  name = 'migration1683521195459';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "jobs" ADD "more_info" character varying(1000)`,
    );
    await queryRunner.query(
      `ALTER TABLE "proposals" ADD "bidding" double precision`,
    );
    await queryRunner.query(`ALTER TABLE "proposals" DROP COLUMN "paid_type"`);
    await queryRunner.query(
      `ALTER TABLE "proposals" ADD "paid_type" character varying(50)`,
    );
    await queryRunner.query(
      `ALTER TABLE "proposals" ALTER COLUMN "amount" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "proposals" ALTER COLUMN "amount" SET DEFAULT '0'`,
    );
    await queryRunner.query(`ALTER TABLE "proposals" DROP COLUMN "milestones"`);
    await queryRunner.query(
      `ALTER TABLE "proposals" ADD "milestones" character varying(1000)`,
    );
    await queryRunner.query(
      `ALTER TABLE "proposals" DROP COLUMN "project_long"`,
    );
    await queryRunner.query(
      `ALTER TABLE "proposals" ADD "project_long" character varying(100)`,
    );
    await queryRunner.query(
      `ALTER TABLE "proposals" DROP COLUMN "cover_letter"`,
    );
    await queryRunner.query(`ALTER TABLE "proposals" ADD "cover_letter" text`);
    await queryRunner.query(
      `ALTER TABLE "proposals" DROP COLUMN "attachments"`,
    );
    await queryRunner.query(`ALTER TABLE "proposals" ADD "attachments" text`);
    await queryRunner.query(
      `ALTER TABLE "proposals" ALTER COLUMN "boost_coin" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "proposals" ALTER COLUMN "boost_time" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "proposals" ALTER COLUMN "boost_time" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "proposals" ALTER COLUMN "boost_coin" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "proposals" DROP COLUMN "attachments"`,
    );
    await queryRunner.query(
      `ALTER TABLE "proposals" ADD "attachments" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "proposals" DROP COLUMN "cover_letter"`,
    );
    await queryRunner.query(
      `ALTER TABLE "proposals" ADD "cover_letter" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "proposals" DROP COLUMN "project_long"`,
    );
    await queryRunner.query(
      `ALTER TABLE "proposals" ADD "project_long" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "proposals" DROP COLUMN "milestones"`);
    await queryRunner.query(
      `ALTER TABLE "proposals" ADD "milestones" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "proposals" ALTER COLUMN "amount" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "proposals" ALTER COLUMN "amount" SET NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "proposals" DROP COLUMN "paid_type"`);
    await queryRunner.query(
      `ALTER TABLE "proposals" ADD "paid_type" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "proposals" DROP COLUMN "bidding"`);
    await queryRunner.query(`ALTER TABLE "jobs" DROP COLUMN "more_info"`);
  }
}
