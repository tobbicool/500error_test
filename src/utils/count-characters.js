////// Count amount of characters (persons) in the js and use the number on the front page
import fs from 'fs';
import path from 'path';

export function countCharacters() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'locales', 'en', 'char-info.json');
    // console.log('Attempting to read file from:', filePath);
    
    if (!fs.existsSync(filePath)) {
      console.error('File does not exist:', filePath);
      return 0;
    }

    const data = fs.readFileSync(filePath, 'utf-8');
    // console.log('File contents:', data.substring(0, 100) + '...'); // Log the first 100 characters

    const json = JSON.parse(data);
    const count = Object.keys(json.characters).length;
    // console.log('Character count:', count);
    
    return count;
  } catch (error) {
    console.error('Error in countCharacters:', error);
    return 0;
  }
}

export const CHARACTER_COUNT = countCharacters();
// console.log('Exported CHARACTER_COUNT:', CHARACTER_COUNT);