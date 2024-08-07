import fs from 'fs';
import path from 'path';

function logDirectoryContents(dir, level = 0) {
  const indent = '  '.repeat(level);
  console.log(`${indent}${dir}:`);
  
  try {
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const itemPath = path.join(dir, item);
      const stats = fs.statSync(itemPath);
      
      if (stats.isDirectory()) {
        logDirectoryContents(itemPath, level + 1);
      } else {
        console.log(`${indent}  ${item}`);
      }
    }
  } catch (error) {
    console.error(`${indent}Error reading ${dir}: ${error.message}`);
  }
}

export function logNetlifyEnvironment() {
  console.log('Netlify Environment Directory Structure:');
  console.log('Current working directory:', process.cwd());
  logDirectoryContents('/var/task');
  logDirectoryContents(process.cwd());
  
  console.log('Environment Variables:');
  console.log('NETLIFY:', process.env.NETLIFY);
  console.log('CONTEXT:', process.env.CONTEXT);
  console.log('DEPLOY_PRIME_URL:', process.env.DEPLOY_PRIME_URL);
}