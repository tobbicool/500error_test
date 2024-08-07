// folder-tracker.mjs
import fs from 'fs/promises';
import path from 'path';

async function logFolderContents(dir, logFile, indent = '') {
  await fs.appendFile(logFile, `${indent}Contents of ${dir}:\n`);
  try {
    const items = await fs.readdir(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stats = await fs.stat(fullPath);
      if (stats.isDirectory()) {
        await fs.appendFile(logFile, `${indent}  [DIR] ${item}\n`);
        await logFolderContents(fullPath, logFile, indent + '  ');
      } else {
        await fs.appendFile(logFile, `${indent}  [FILE] ${item}\n`);
      }
    }
  } catch (error) {
    await fs.appendFile(logFile, `${indent}  Error reading directory: ${error.message}\n`);
  }
}

export { logFolderContents };