import fs from 'fs';
import path from 'path';

function logDirectoryContents(dir, level = 0, maxDepth = 5) {
  if (level > maxDepth) return;
  
  const indent = '  '.repeat(level);
  console.log(`${indent}${dir}:`);
  
  try {
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const itemPath = path.join(dir, item);
      const stats = fs.statSync(itemPath);
      
      if (stats.isDirectory()) {
        logDirectoryContents(itemPath, level + 1, maxDepth);
      } else {
        console.log(`${indent}  ${item}`);
      }
    }
  } catch (error) {
    console.error(`${indent}Error reading ${dir}: ${error.message}`);
  }
}

export function logUsrDirectory() {
  console.log('Logging /usr directory structure:');
  logDirectoryContents('/usr', 0, 5);  // Increased max depth to 5 for more detailed exploration
  
  // Specifically check for i18n or locales directories
  const dirsToCheck = [
    '/usr/i18n',
    '/usr/locales',
    '/usr/src/i18n',
    '/usr/src/locales',
    '/usr/app/i18n',
    '/usr/app/locales'
  ];

  dirsToCheck.forEach(dir => {
    console.log(`\nChecking specific directory: ${dir}`);
    logDirectoryContents(dir, 0, 3);
  });

  console.log('\nEnvironment Variables:');
  console.log('NETLIFY:', process.env.NETLIFY);
  console.log('CONTEXT:', process.env.CONTEXT);
  console.log('DEPLOY_PRIME_URL:', process.env.DEPLOY_PRIME_URL);
  console.log('LAMBDA_TASK_ROOT:', process.env.LAMBDA_TASK_ROOT);
}