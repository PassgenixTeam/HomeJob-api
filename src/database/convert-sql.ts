import { join } from 'path';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

let skillSubs = fs
  .readFileSync(join(__dirname, '/src/database/sql/skillsubcategories.sql'))
  .toString()
  .replace(/(\r\n|\n|\r)/gm, ' ') // remove newlines
  .replace(/\s+/g, ' ');

const regex = /NULL, '([^']*)',/g;
const matches = [...skillSubs.matchAll(regex)];
const values = matches.map((match) => match[1]);

values.forEach((value) => {
  skillSubs = skillSubs.replace(value, uuidv4());
});

async function example(content: string) {
  try {
    fs.writeFileSync('test.sql', content);
  } catch (err) {
    console.log(err);
  }
}
example(skillSubs);
