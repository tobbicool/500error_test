const fs = require('fs');
const path = require('path');

function logFolderContents(dir, logFile, indent = '') {
  fs.appendFileSync(logFile, `${indent}Contents of ${dir}:\n`);
  try {
    const items = fs.readdirSync(dir);
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const stats = fs.statSync(fullPath);
      if (stats.isDirectory()) {
        fs.appendFileSync(logFile, `${indent}  [DIR] ${item}\n`);
        logFolderContents(fullPath, logFile, indent + '  ');
      } else {
        fs.appendFileSync(logFile, `${indent}  [FILE] ${item}\n`);
      }
    });
  } catch (error) {
    fs.appendFileSync(logFile, `${indent}  Error reading directory: ${error.message}\n`);
  }
}

module.exports = { logFolderContents };