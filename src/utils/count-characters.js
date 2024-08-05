import fs from 'fs';
import path from 'path';

console.log('Current working directory:', process.cwd());
console.log('Contents of public folder:', fs.readdirSync(path.join(process.cwd(), 'public')));
console.log('Contents of public/locales folder:', fs.readdirSync(path.join(process.cwd(), 'public', 'locales')));
console.log('Contents of public/locales/en folder:', fs.readdirSync(path.join(process.cwd(), 'public', 'locales', 'en')));

export function countCharacters() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'locales', 'en', 'char-info.json');
    console.log('Attempting to read file from:', filePath);
    
    if (!fs.existsSync(filePath)) {
      console.error('File does not exist:', filePath);
      return 0;
    }

    const data = fs.readFileSync(filePath, 'utf-8');
    console.log('File contents:', data.substring(0, 100) + '...'); // Log the first 100 characters

    const json = JSON.parse(data);
    const count = Object.keys(json.characters).length;
    console.log('Character count:', count);
    
    return count;
  } catch (error) {
    console.error('Error in countCharacters:', error);
    return 0;
  }
}