import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1681447995387 implements MigrationInterface {
  name = 'migration1681447995387';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "transaction" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid, "updated_by" uuid, "deleted_at" TIMESTAMP, "deleted_by" uuid, "type" character varying NOT NULL, "ref_id" character varying NOT NULL, "amount" integer NOT NULL, "description" character varying NOT NULL, "balance" integer NOT NULL, "payment_method_id" uuid NOT NULL, "freelancer_id" uuid, CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "payment_methods" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid, "updated_by" uuid, "deleted_at" TIMESTAMP, "deleted_by" uuid, "last_4" character varying NOT NULL, "payment_method_id" character varying NOT NULL, "brand" character varying NOT NULL, "is_default" boolean NOT NULL, "user_id" uuid, CONSTRAINT "PK_34f9b8c6dfb4ac3559f7e2820d1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "coins" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid, "updated_by" uuid, "deleted_at" TIMESTAMP, "deleted_by" uuid, "title" character varying NOT NULL, "reason" character varying NOT NULL, "coin" integer NOT NULL, "balance" integer NOT NULL, "type" character varying NOT NULL, "user_id" uuid, CONSTRAINT "PK_af01e5dcef2c05e6385611205c6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "skills" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid, "updated_by" uuid, "deleted_at" TIMESTAMP, "deleted_by" uuid, "name" character varying NOT NULL, CONSTRAINT "PK_0d3212120f4ecedf90864d7e298" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "sub_skills" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid, "updated_by" uuid, "deleted_at" TIMESTAMP, "deleted_by" uuid, "name" character varying NOT NULL, "skill_id" uuid, CONSTRAINT "PK_9a524bb1e8dff2a72d39bc4929c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "mapping_job_skills" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid, "updated_by" uuid, "deleted_at" TIMESTAMP, "deleted_by" uuid, "job_id" uuid NOT NULL, "skill_id" uuid NOT NULL, CONSTRAINT "PK_e79f7520e4139703c27c70b6b1e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "jobs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid, "updated_by" uuid, "deleted_at" TIMESTAMP, "deleted_by" uuid, "title" character varying NOT NULL, "subtitle" character varying NOT NULL, "description" character varying NOT NULL, "scope_type" character varying NOT NULL, "experience_level" character varying NOT NULL, "project_length" character varying NOT NULL, "budget" integer NOT NULL, "hourly_to" integer NOT NULL, "hourly_from" integer NOT NULL, "attachments" character varying NOT NULL, "status" character varying NOT NULL, CONSTRAINT "PK_cf0a6c42b72fcc7f7c237def345" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "proposals" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid, "updated_by" uuid, "deleted_at" TIMESTAMP, "deleted_by" uuid, "job_id" uuid NOT NULL, "paid_type" character varying NOT NULL, "amount" integer NOT NULL, "milestones" character varying NOT NULL, "project_long" character varying NOT NULL, "cover_letter" character varying NOT NULL, "attachments" character varying NOT NULL, "boost_coin" integer NOT NULL, "boost_time" TIMESTAMP NOT NULL, CONSTRAINT "PK_db524c8db8e126a38a2f16d8cac" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "educations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid, "updated_by" uuid, "deleted_at" TIMESTAMP, "deleted_by" uuid, "school" character varying NOT NULL, "degree" character varying NOT NULL, "from_attended" character varying NOT NULL, "to_attended" character varying NOT NULL, "area_of_study" character varying NOT NULL, "description" character varying NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "PK_09d2f29e7f6f31f5c01d79d2dbf" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid, "updated_by" uuid, "deleted_at" TIMESTAMP, "deleted_by" uuid, "password" character varying, "email" character varying NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "avatar_url" character varying NOT NULL DEFAULT 'https://media.istockphoto.com/id/1016744004/vector/profile-placeholder-image-gray-silhouette-no-photo.jpg?s=612x612&w=0&k=20&c=mB6A9idhtEtsFXphs1WVwW_iPBt37S2kJp6VpPhFeoA=', "is_active" boolean NOT NULL DEFAULT false, "role" character varying NOT NULL DEFAULT 'freelance', "stripe_customer_id" character varying, "address" character varying, "city" character varying, "country" character varying, "line_1" character varying, "line_2" character varying, "phone" character varying, "state" character varying, "balance" double precision NOT NULL DEFAULT '0', "coin" double precision NOT NULL DEFAULT '0', "login_by" character varying NOT NULL, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "sessions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid, "updated_by" uuid, "deleted_at" TIMESTAMP, "deleted_by" uuid, "access_token" character varying NOT NULL, "refresh_token" character varying NOT NULL, "expired_at" TIMESTAMP, "user_id" uuid, CONSTRAINT "PK_3238ef96f18b355b671619111bc" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "files" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid, "updated_by" uuid, "deleted_at" TIMESTAMP, "deleted_by" uuid, "type" character varying NOT NULL, "size" integer NOT NULL, "url" character varying NOT NULL, "key" character varying NOT NULL, "status" "public"."files_status_enum" NOT NULL, CONSTRAINT "PK_6c16b9093a142e0e7613b04a3d9" PRIMARY KEY ("id"))`,
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
    await queryRunner.query(
      `ALTER TABLE "payment_methods" ADD CONSTRAINT "FK_d7d7fb15569674aaadcfbc0428c" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "coins" ADD CONSTRAINT "FK_aa6cb7b2b98c1d3c6118c06046c" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sub_skills" ADD CONSTRAINT "FK_a9f691c6da23a962423b5521df4" FOREIGN KEY ("skill_id") REFERENCES "skills"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "mapping_job_skills" ADD CONSTRAINT "FK_24bb6d0343404efad8334429ce6" FOREIGN KEY ("job_id") REFERENCES "jobs"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "mapping_job_skills" ADD CONSTRAINT "FK_99584e82207261ff8b0b0332193" FOREIGN KEY ("skill_id") REFERENCES "sub_skills"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "proposals" ADD CONSTRAINT "FK_0b6dc5b941879ad3f581a8ad3fe" FOREIGN KEY ("job_id") REFERENCES "jobs"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "proposals" ADD CONSTRAINT "FK_efa4cb7bcb6f3003413a6987440" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "educations" ADD CONSTRAINT "FK_ed30b84b392640d53591405a1f7" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sessions" ADD CONSTRAINT "FK_085d540d9f418cfbdc7bd55bb19" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "sessions" DROP CONSTRAINT "FK_085d540d9f418cfbdc7bd55bb19"`,
    );
    await queryRunner.query(
      `ALTER TABLE "educations" DROP CONSTRAINT "FK_ed30b84b392640d53591405a1f7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "proposals" DROP CONSTRAINT "FK_efa4cb7bcb6f3003413a6987440"`,
    );
    await queryRunner.query(
      `ALTER TABLE "proposals" DROP CONSTRAINT "FK_0b6dc5b941879ad3f581a8ad3fe"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mapping_job_skills" DROP CONSTRAINT "FK_99584e82207261ff8b0b0332193"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mapping_job_skills" DROP CONSTRAINT "FK_24bb6d0343404efad8334429ce6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sub_skills" DROP CONSTRAINT "FK_a9f691c6da23a962423b5521df4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "coins" DROP CONSTRAINT "FK_aa6cb7b2b98c1d3c6118c06046c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_methods" DROP CONSTRAINT "FK_d7d7fb15569674aaadcfbc0428c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_cecf231b4a8cee7c27d539e0956"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_25b1234bd0af272d259fe5e38de"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_50cbfefd92ed4c857c0bafb9708"`,
    );
    await queryRunner.query(`DROP TABLE "files"`);
    await queryRunner.query(`DROP TABLE "sessions"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "educations"`);
    await queryRunner.query(`DROP TABLE "proposals"`);
    await queryRunner.query(`DROP TABLE "jobs"`);
    await queryRunner.query(`DROP TABLE "mapping_job_skills"`);
    await queryRunner.query(`DROP TABLE "sub_skills"`);
    await queryRunner.query(`DROP TABLE "skills"`);
    await queryRunner.query(`DROP TABLE "coins"`);
    await queryRunner.query(`DROP TABLE "payment_methods"`);
    await queryRunner.query(`DROP TABLE "transaction"`);
  }
}
