import * as fs from 'fs';
import * as Handlebars from 'handlebars';
import { getFics } from './RatingFetcher';

function help() {
  console.log('Syntax:');
  console.log(`${process.argv[0]} ${process.argv[1]} <command>`)
  console.log('Commands:');
  console.log('print\trenders the page to the command line');
  console.log('save <file name>\trenders the page to the command line');
}

async function render(): Promise<string> {
  const templateStr = fs.readFileSync('./src/templates/index.html.hb', { encoding: 'utf-8' });
  Handlebars.registerHelper('round', function (num, precision) {
    return num.toPrecision(precision);
  });
  Handlebars.registerHelper('slugify', function (str) {
    return str
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");;
  });
  const template = Handlebars.compile(templateStr);
  const data = await getFics();
  return template({ data });
}

async function print(): Promise<void> {
  console.log(await render());
}

async function save(fileName: string): Promise<void> {
  const rendered = await render();
  await fs.promises.writeFile(fileName, rendered);
}

if (process.argv.length < 3) {
  help();
}

switch (process.argv[2]) {
  case 'print':
    print();
    break;
  case 'save':
    if (!process.argv[3]) {
      help();
      break;
    }
    save(process.argv[3]);
    break;
  default:
    help();
}
