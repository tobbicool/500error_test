////// Count amount of characters (persons) in the js and use the number on the front page
import fs from 'fs';
import path from 'path';

export async function countCharacters() {
  try {
    let filePath;
    if (import.meta.env.PROD) {
      // In production, use a path relative to the built files
      filePath = path.join(process.cwd(), 'dist', 'locales', 'en', 'char-info.json');
    } else {
      // In development, use the path in the public folder
      filePath = path.join(process.cwd(), 'public', 'locales', 'en', 'char-info.json');
    }
    
    const data = await fs.promises.readFile(filePath, 'utf-8');
    const json = JSON.parse(data);
    return Object.keys(json.characters).length;
  } catch (error) {
    console.error('Error reading char-info.json:', error);
    return 0; // Return a default value or handle the error as needed
  }
}