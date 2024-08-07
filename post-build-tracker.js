const { logFolderContents } = require('./folder-tracker.js');
const path = require('path');
const fs = require('fs');

const logFile = path.join(__dirname, 'post-build-tracker.log');
fs.writeFileSync(logFile, 'Post-Build Folder Structure\n');
logFolderContents(__dirname, logFile);
logFolderContents(path.join(__dirname, 'dist'), logFile);
logFolderContents(path.join(__dirname, '.netlify'), logFile);