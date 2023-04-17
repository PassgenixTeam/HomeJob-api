import { MigrationInterface, QueryRunner } from 'typeorm';
import * as fs from 'fs';
import { join } from 'path';

const skills = fs
  .readFileSync(join(__dirname, '../sql/skillmaincategories.sql'))
  .toString()
  .replace(/(\r\n|\n|\r)/gm, ' ') // remove newlines
  .replace(/\s+/g, ' ');

const skillSubs = fs
  .readFileSync(join(__dirname, '../sql/skillsubcategories.sql'))
  .toString()
  .replace(/(\r\n|\n|\r)/gm, ' ') // remove newlines
  .replace(/\s+/g, ' ');

export class seed1681704850512 implements MigrationInterface {
  name = 'seed1681704850512';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(skills.toString());
    // await queryRunner.query(skillSubs.toString());
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('');
  }
}
