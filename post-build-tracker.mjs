// post-build-tracker.mjs
import { logFolderContents } from './folder-tracker.mjs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function runTracker() {
  console.log('Post-Build Folder Structure:');
  await logFolderContents(__dirname);
  console.log('\nDist Folder Structure:');
  await logFolderContents(path.join(__dirname, 'dist'));
  console.log('\nNetlify Folder Structure:');
  await logFolderContents(path.join(__dirname, '.netlify'));
}

runTracker().catch(console.error);