import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1680768496993 implements MigrationInterface {
  name = 'migration1680768496993';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid, "updated_by" uuid, "deleted_at" TIMESTAMP, "deleted_by" uuid, "password" character varying NOT NULL, "email" character varying NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "avatar_url" character varying NOT NULL DEFAULT 'https://media.istockphoto.com/id/1016744004/vector/profile-placeholder-image-gray-silhouette-no-photo.jpg?s=612x612&w=0&k=20&c=mB6A9idhtEtsFXphs1WVwW_iPBt37S2kJp6VpPhFeoA=', "is_active" boolean NOT NULL DEFAULT false, "role" character varying NOT NULL DEFAULT 'freelance', CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "sessions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid, "updated_by" uuid, "deleted_at" TIMESTAMP, "deleted_by" uuid, "access_token" character varying NOT NULL, "refresh_token" character varying NOT NULL, "expired_at" TIMESTAMP, "user_id" uuid, CONSTRAINT "PK_3238ef96f18b355b671619111bc" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "sub_skills" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid, "updated_by" uuid, "deleted_at" TIMESTAMP, "deleted_by" uuid, "name" character varying NOT NULL, "skill_id" uuid, CONSTRAINT "PK_9a524bb1e8dff2a72d39bc4929c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "skills" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid, "updated_by" uuid, "deleted_at" TIMESTAMP, "deleted_by" uuid, "name" character varying NOT NULL, CONSTRAINT "PK_0d3212120f4ecedf90864d7e298" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "uploads" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid, "updated_by" uuid, "deleted_at" TIMESTAMP, "deleted_by" uuid, "type" character varying NOT NULL, "size" integer NOT NULL, "url" character varying NOT NULL, "key" character varying NOT NULL, "status" "public"."uploads_status_enum" NOT NULL, CONSTRAINT "PK_d1781d1eedd7459314f60f39bd3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "jobs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid, "updated_by" uuid, "deleted_at" TIMESTAMP, "deleted_by" uuid, "title" character varying NOT NULL, "subtitle" character varying NOT NULL, "description" character varying NOT NULL, "scope_type" character varying NOT NULL, "scope_level" character varying NOT NULL, "scope_time" character varying NOT NULL, "budget" integer NOT NULL, "hourly_to" integer NOT NULL, "hourly_from" integer NOT NULL, "attachments" character varying NOT NULL, "status" character varying NOT NULL, CONSTRAINT "PK_cf0a6c42b72fcc7f7c237def345" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "sessions" ADD CONSTRAINT "FK_085d540d9f418cfbdc7bd55bb19" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sub_skills" ADD CONSTRAINT "FK_a9f691c6da23a962423b5521df4" FOREIGN KEY ("skill_id") REFERENCES "skills"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "sub_skills" DROP CONSTRAINT "FK_a9f691c6da23a962423b5521df4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sessions" DROP CONSTRAINT "FK_085d540d9f418cfbdc7bd55bb19"`,
    );
    await queryRunner.query(`DROP TABLE "jobs"`);
    await queryRunner.query(`DROP TABLE "uploads"`);
    await queryRunner.query(`DROP TABLE "skills"`);
    await queryRunner.query(`DROP TABLE "sub_skills"`);
    await queryRunner.query(`DROP TABLE "sessions"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
