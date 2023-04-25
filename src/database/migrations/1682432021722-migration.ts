import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1682432021722 implements MigrationInterface {
  name = 'migration1682432021722';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "transaction" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid, "updated_by" uuid, "deleted_at" TIMESTAMP, "deleted_by" uuid, "type" character varying NOT NULL, "ref_id" character varying NOT NULL, "amount" integer NOT NULL, "description" character varying NOT NULL, "balance" integer NOT NULL, "payment_method_id" uuid NOT NULL, CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "payment_methods" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid, "updated_by" uuid, "deleted_at" TIMESTAMP, "deleted_by" uuid, "last_4" character varying NOT NULL, "payment_method_id" character varying NOT NULL, "brand" character varying NOT NULL, "is_default" boolean NOT NULL, "user_id" uuid, CONSTRAINT "PK_34f9b8c6dfb4ac3559f7e2820d1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "coins" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid, "updated_by" uuid, "deleted_at" TIMESTAMP, "deleted_by" uuid, "title" character varying NOT NULL, "reason" character varying NOT NULL, "coin" integer NOT NULL, "balance" integer NOT NULL, "type" character varying NOT NULL, "user_id" uuid, CONSTRAINT "PK_af01e5dcef2c05e6385611205c6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "skills" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid, "updated_by" uuid, "deleted_at" TIMESTAMP, "deleted_by" uuid, "name" character varying NOT NULL, "order" integer NOT NULL, CONSTRAINT "PK_0d3212120f4ecedf90864d7e298" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "mapping_user_skills" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid, "updated_by" uuid, "deleted_at" TIMESTAMP, "deleted_by" uuid, "user_id" uuid NOT NULL, "sub_skill_id" uuid NOT NULL, CONSTRAINT "PK_55fa3b73f3d547aa8a5a9d14ec8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "sub_skills" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid, "updated_by" uuid, "deleted_at" TIMESTAMP, "deleted_by" uuid, "name" character varying NOT NULL, "order" integer NOT NULL, "skill_id" uuid, CONSTRAINT "PK_9a524bb1e8dff2a72d39bc4929c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "mapping_job_skills" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid, "updated_by" uuid, "deleted_at" TIMESTAMP, "deleted_by" uuid, "job_id" uuid NOT NULL, "skill_id" uuid NOT NULL, CONSTRAINT "PK_e79f7520e4139703c27c70b6b1e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "jobs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid, "updated_by" uuid, "deleted_at" TIMESTAMP, "deleted_by" uuid, "title" character varying(255) NOT NULL, "subtitle" character varying, "description" text NOT NULL, "scope_type" "public"."jobs_scope_type_enum" NOT NULL, "experience_level" "public"."jobs_experience_level_enum" NOT NULL, "project_length" "public"."jobs_project_length_enum" NOT NULL, "budget" double precision, "hourly_to" integer, "hourly_from" integer, "attachments" text NOT NULL, "job_type" "public"."jobs_job_type_enum" NOT NULL, "status" "public"."jobs_status_enum" NOT NULL, CONSTRAINT "PK_cf0a6c42b72fcc7f7c237def345" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "proposals" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid, "updated_by" uuid, "deleted_at" TIMESTAMP, "deleted_by" uuid, "job_id" uuid NOT NULL, "paid_type" character varying NOT NULL, "amount" integer NOT NULL, "milestones" character varying NOT NULL, "project_long" character varying NOT NULL, "cover_letter" character varying NOT NULL, "attachments" character varying NOT NULL, "boost_coin" integer NOT NULL, "boost_time" TIMESTAMP NOT NULL, CONSTRAINT "PK_db524c8db8e126a38a2f16d8cac" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "educations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid, "updated_by" uuid, "deleted_at" TIMESTAMP, "deleted_by" uuid, "school" character varying NOT NULL, "degree" character varying NOT NULL, "from_attended" character varying NOT NULL, "to_attended" character varying NOT NULL, "area_of_study" character varying NOT NULL, "description" character varying NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "PK_09d2f29e7f6f31f5c01d79d2dbf" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "employment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid, "updated_by" uuid, "deleted_at" TIMESTAMP, "deleted_by" uuid, "company" character varying NOT NULL, "city" character varying NOT NULL, "country" character varying NOT NULL, "title" character varying NOT NULL, "from_month" integer NOT NULL, "from_year" integer NOT NULL, "to_month" integer NOT NULL, "to_year" integer NOT NULL, "is_currently" boolean NOT NULL, "description" character varying NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "PK_80e1cceae89697b78db5c953776" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "project" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid, "updated_by" uuid, "deleted_at" TIMESTAMP, "deleted_by" uuid, "title" character varying NOT NULL, "completed_date" character varying NOT NULL, "template" character varying NOT NULL, "attachments" character varying NOT NULL, "url" character varying NOT NULL, "description" character varying NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "PK_4d68b1358bb5b766d3e78f32f57" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "experiences" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid, "updated_by" uuid, "deleted_at" TIMESTAMP, "deleted_by" uuid, "subject" character varying NOT NULL, "description" character varying NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "PK_884f0913a63882712ea578e7c85" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "languages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid, "updated_by" uuid, "deleted_at" TIMESTAMP, "deleted_by" uuid, "name" character varying NOT NULL, CONSTRAINT "PK_b517f827ca496b29f4d549c631d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "mapping_user_languages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid, "updated_by" uuid, "deleted_at" TIMESTAMP, "deleted_by" uuid, "user_id" uuid NOT NULL, "language_id" uuid NOT NULL, "level" character varying NOT NULL, CONSTRAINT "PK_33ebf5e62c70e022287aacb8c84" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "project_milestones" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid, "updated_by" uuid, "deleted_at" TIMESTAMP, "deleted_by" uuid, "title" character varying(255) NOT NULL, "description" character varying(1000) NOT NULL, "amount" double precision NOT NULL, "due_date" TIMESTAMP WITH TIME ZONE NOT NULL, "contract_id" uuid NOT NULL, "is_paid" boolean NOT NULL DEFAULT false, "freelancer_confirm_status" "public"."project_milestones_freelancer_confirm_status_enum" NOT NULL DEFAULT 'pending', "status" "public"."project_milestones_status_enum" NOT NULL, CONSTRAINT "PK_0c561300a12c6ba3ad793dff4b8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "contracts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid, "updated_by" uuid, "deleted_at" TIMESTAMP, "deleted_by" uuid, "contract_id" uuid NOT NULL, "freelancer_id" uuid NOT NULL, "job_id" uuid NOT NULL, "pay_type" "public"."contracts_pay_type_enum" NOT NULL, "due_date" TIMESTAMP WITH TIME ZONE, "pay_fixed_price" double precision, "offer_status" "public"."contracts_offer_status_enum" NOT NULL, "deposit" double precision NOT NULL, "fee" double precision, "taxes" double precision, "total" double precision, "pay_status" "public"."contracts_pay_status_enum" NOT NULL, "status" "public"."contracts_status_enum" NOT NULL, CONSTRAINT "PK_2c7b8f3a7b1acdd49497d83d0fb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid, "updated_by" uuid, "deleted_at" TIMESTAMP, "deleted_by" uuid, "password" character varying(255), "email" character varying(100) NOT NULL, "first_name" character varying(50) NOT NULL, "last_name" character varying(50) NOT NULL, "avatar_url" character varying(255) NOT NULL DEFAULT 'https://media.istockphoto.com/id/1016744004/vector/profile-placeholder-image-gray-silhouette-no-photo.jpg?s=612x612&w=0&k=20&c=mB6A9idhtEtsFXphs1WVwW_iPBt37S2kJp6VpPhFeoA=', "is_active" boolean NOT NULL DEFAULT false, "role" "public"."users_role_enum", "stripe_customer_id" character varying(50), "address" character varying(255), "city" character varying(20), "country" character varying(20), "line_1" character varying(50), "line_2" character varying(50), "phone" character varying(20), "state" character varying(50), "balance" double precision NOT NULL DEFAULT '0', "coin" double precision NOT NULL DEFAULT '0', "title" character varying(70), "hourly_rate" double precision NOT NULL DEFAULT '0', "overview" text, "video_overview" character varying(500), "hours_per_week" "public"."users_hours_per_week_enum", "login_by" character varying NOT NULL, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "sessions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid, "updated_by" uuid, "deleted_at" TIMESTAMP, "deleted_by" uuid, "access_token" character varying NOT NULL, "refresh_token" character varying NOT NULL, "expired_at" TIMESTAMP, "user_id" uuid, CONSTRAINT "PK_3238ef96f18b355b671619111bc" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "files" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid, "updated_by" uuid, "deleted_at" TIMESTAMP, "deleted_by" uuid, "type" character varying NOT NULL, "size" integer NOT NULL, "url" character varying NOT NULL, "key" character varying NOT NULL, "status" "public"."files_status_enum" NOT NULL, CONSTRAINT "PK_6c16b9093a142e0e7613b04a3d9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "sub_categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid, "updated_by" uuid, "deleted_at" TIMESTAMP, "deleted_by" uuid, "name" character varying NOT NULL, "category_id" uuid NOT NULL, CONSTRAINT "PK_f319b046685c0e07287e76c5ab1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid, "updated_by" uuid, "deleted_at" TIMESTAMP, "deleted_by" uuid, "name" character varying NOT NULL, CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`,
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
      `ALTER TABLE "mapping_user_skills" ADD CONSTRAINT "FK_03d669dd083b9d9eff359ffa354" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "mapping_user_skills" ADD CONSTRAINT "FK_0e8120f49f3df2de9203bdae0ec" FOREIGN KEY ("sub_skill_id") REFERENCES "sub_skills"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
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
      `ALTER TABLE "employment" ADD CONSTRAINT "FK_881c23453e324de0a66c3c16f14" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" ADD CONSTRAINT "FK_1cf56b10b23971cfd07e4fc6126" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "experiences" ADD CONSTRAINT "FK_99646b65b428fe670f2dc5aac77" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "mapping_user_languages" ADD CONSTRAINT "FK_a372fe3845fd868012524f2a587" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "mapping_user_languages" ADD CONSTRAINT "FK_1663b2dff75dbbe9486b1c20604" FOREIGN KEY ("language_id") REFERENCES "languages"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_milestones" ADD CONSTRAINT "FK_2b21da3b280a42e980f5ce717b0" FOREIGN KEY ("contract_id") REFERENCES "contracts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "contracts" ADD CONSTRAINT "FK_a94ffd0b1a052fddaa84d4cb186" FOREIGN KEY ("freelancer_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sessions" ADD CONSTRAINT "FK_085d540d9f418cfbdc7bd55bb19" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
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
      `ALTER TABLE "sessions" DROP CONSTRAINT "FK_085d540d9f418cfbdc7bd55bb19"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contracts" DROP CONSTRAINT "FK_a94ffd0b1a052fddaa84d4cb186"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_milestones" DROP CONSTRAINT "FK_2b21da3b280a42e980f5ce717b0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mapping_user_languages" DROP CONSTRAINT "FK_1663b2dff75dbbe9486b1c20604"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mapping_user_languages" DROP CONSTRAINT "FK_a372fe3845fd868012524f2a587"`,
    );
    await queryRunner.query(
      `ALTER TABLE "experiences" DROP CONSTRAINT "FK_99646b65b428fe670f2dc5aac77"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" DROP CONSTRAINT "FK_1cf56b10b23971cfd07e4fc6126"`,
    );
    await queryRunner.query(
      `ALTER TABLE "employment" DROP CONSTRAINT "FK_881c23453e324de0a66c3c16f14"`,
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
      `ALTER TABLE "mapping_user_skills" DROP CONSTRAINT "FK_0e8120f49f3df2de9203bdae0ec"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mapping_user_skills" DROP CONSTRAINT "FK_03d669dd083b9d9eff359ffa354"`,
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
    await queryRunner.query(`DROP TABLE "categories"`);
    await queryRunner.query(`DROP TABLE "sub_categories"`);
    await queryRunner.query(`DROP TABLE "files"`);
    await queryRunner.query(`DROP TABLE "sessions"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "contracts"`);
    await queryRunner.query(`DROP TABLE "project_milestones"`);
    await queryRunner.query(`DROP TABLE "mapping_user_languages"`);
    await queryRunner.query(`DROP TABLE "languages"`);
    await queryRunner.query(`DROP TABLE "experiences"`);
    await queryRunner.query(`DROP TABLE "project"`);
    await queryRunner.query(`DROP TABLE "employment"`);
    await queryRunner.query(`DROP TABLE "educations"`);
    await queryRunner.query(`DROP TABLE "proposals"`);
    await queryRunner.query(`DROP TABLE "jobs"`);
    await queryRunner.query(`DROP TABLE "mapping_job_skills"`);
    await queryRunner.query(`DROP TABLE "sub_skills"`);
    await queryRunner.query(`DROP TABLE "mapping_user_skills"`);
    await queryRunner.query(`DROP TABLE "skills"`);
    await queryRunner.query(`DROP TABLE "coins"`);
    await queryRunner.query(`DROP TABLE "payment_methods"`);
    await queryRunner.query(`DROP TABLE "transaction"`);
  }
}
