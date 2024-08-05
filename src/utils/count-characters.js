////// Count amount of characters (persons) in the js and use the number on the front page
import fs from 'fs';
import path from 'path';

export function countCharacters() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'locales', 'en', 'char-info.json');
    const data = fs.readFileSync(filePath, 'utf-8');
    const json = JSON.parse(data);
    return Object.keys(json.characters).length;
  } catch (error) {
    console.error('Error reading char-info.json:', error);
    return 0; // Return a default value or handle the error as needed
  }
}

export const CHARACTER_COUNT = countCharacters();