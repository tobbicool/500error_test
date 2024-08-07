import { logFolderContents } from './folder-tracker.mjs';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const logFile = path.join(__dirname, 'post-build-tracker.log');
await fs.writeFile(logFile, 'Post-Build Folder Structure\n');
await logFolderContents(__dirname, logFile);
await logFolderContents(path.join(__dirname, 'dist'), logFile);
await logFolderContents(path.join(__dirname, '.netlify'), logFile);