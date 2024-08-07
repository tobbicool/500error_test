// folder-tracker.mjs
import fs from 'fs/promises';
import path from 'path';

async function logFolderContents(dir, indent = '') {
  console.log(`${indent}Contents of ${dir}:`);
  try {
    const items = await fs.readdir(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stats = await fs.stat(fullPath);
      if (stats.isDirectory()) {
        console.log(`${indent}  [DIR] ${item}`);
        await logFolderContents(fullPath, indent + '  ');
      } else {
        console.log(`${indent}  [FILE] ${item}`);
      }
    }
  } catch (error) {
    console.error(`${indent}  Error reading directory: ${error.message}`);
  }
}

export { logFolderContents };