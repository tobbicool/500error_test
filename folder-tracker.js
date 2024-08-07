// folder-tracker.js
const fs = require('fs');
const path = require('path');

function logFolderContents(dir, logFile) {
  fs.appendFileSync(logFile, `\nContents of ${dir}:\n`);
  try {
    const items = fs.readdirSync(dir);
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const stats = fs.statSync(fullPath);
      if (stats.isDirectory()) {
        fs.appendFileSync(logFile, `  [DIR] ${item}\n`);
        logFolderContents(fullPath, logFile);
      } else {
        fs.appendFileSync(logFile, `  [FILE] ${item}\n`);
      }
    });
  } catch (error) {
    fs.appendFileSync(logFile, `  Error reading directory: ${error.message}\n`);
  }
}