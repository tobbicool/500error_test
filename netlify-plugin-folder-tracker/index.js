const fs = require('fs');
const path = require('path');

module.exports = {
  onPreBuild: ({ utils }) => {
    utils.status.show({ summary: 'Tracking folders pre-build' });
    const logFile = path.join(process.cwd(), 'netlify-folder-tracker.log');
    fs.writeFileSync(logFile, 'Netlify Pre-Build\n');
    require('../folder-tracker.mjs').logFolderContents(process.cwd(), logFile);
  },
  onBuild: ({ utils }) => {
    utils.status.show({ summary: 'Tracking folders post-build' });
    const logFile = path.join(process.cwd(), 'netlify-folder-tracker.log');
    fs.appendFileSync(logFile, '\nNetlify Post-Build\n');
    require('../folder-tracker.mjs').logFolderContents(process.cwd(), logFile);
    require('../folder-tracker.mjs').logFolderContents(path.join(process.cwd(), 'dist'), logFile);
  },
};