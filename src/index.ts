import * as fs from 'fs';
import * as Handlebars from 'handlebars';
import * as dotenv from 'dotenv';
import axios from 'axios';
import FormData from 'form-data';
import { getFics } from './RatingFetcher';

dotenv.config();

function help() {
  console.log('Syntax:');
  console.log(`${process.argv[0]} ${process.argv[1]} <command>`);
  console.log('Commands:');
  console.log('print             renders the page to the command line');
  console.log('save <file name>  saves the page to a file');
  console.log('update            updates the rendered page on the site');
}

async function render(): Promise<string> {
  const templateStr = fs.readFileSync('./src/templates/index.html.hb', { encoding: 'utf-8' });
  Handlebars.registerHelper('round', (num: number, precision: number) => num.toPrecision(precision));
  Handlebars.registerHelper('slugify', (str: string) => (str
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')));
  const template = Handlebars.compile(templateStr);
  const data = await getFics();
  return template({
    data,
    date: new Date(),
  });
}

async function print(): Promise<void> {
  console.log(await render());
}

async function save(fileName: string): Promise<void> {
  const rendered = await render();
  await fs.promises.writeFile(fileName, rendered);
}

async function update(): Promise<void> {
  const apiKey = process.env.NEOCITIES_API_KEY;
  if (!apiKey) {
    console.log('ERROR: Add NEOCITIES_API_KEY to .env.\n');
    process.exit(1);
  }
  const rendered = await render();

  const form = new FormData();
  form.append('nasu_ranking.html', rendered, {
    contentType: 'text/html',
    filename: 'test.html',
  });

  try {
    await axios({
      method: 'POST',
      url: 'https://neocities.org/api/upload',
      data: form,
      headers: {
        ...form.getHeaders(),
        Authorization: `Bearer ${apiKey}`,
      },
    });
  } catch (e) {
    console.log('ERROR');
    console.log(e);
    process.exit(1);
  }
}

if (process.argv.length < 3) {
  help();
  process.exit(1);
}

void (async () => {
  switch (process.argv[2]) {
    case 'print':
      await print();
      break;
    case 'save':
      if (!process.argv[3]) {
        help();
        break;
      }
      await save(process.argv[3]);
      break;
    case 'update':
      await update();
      break;
    default:
      help();
  }
})();
