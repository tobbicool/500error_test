////// Count amount of characters (persons) in the js and use the number on the front page
import fs from 'fs';
import path from 'path';

export async function countCharacters() {
  const filePath = path.resolve('public/locales/en/char-info.json');
  const data = await fs.promises.readFile(filePath, 'utf-8');
  const json = JSON.parse(data);
  return Object.keys(json.characters).length;
}

