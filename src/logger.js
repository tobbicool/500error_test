import fs from 'fs';
import path from 'path';

function logDirectoryContents(dir, level = 0, maxDepth = 3) {
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

export function logNetlifyEnvironment() {
  console.log('Netlify Environment Directory Structure:');
  console.log('Current working directory:', process.cwd());
  
  const dirsToCheck = [
    '/var/task',
    process.cwd(),
    '/var/runtime',
    '/opt',
    '/var/lang',
    '/',
    '.netlify',
    '.netlify/functions-internal',
    '.netlify/functions-internal/ssr',
    'dist',
    'public'
  ];

  dirsToCheck.forEach(dir => {
    console.log(`\nChecking directory: ${dir}`);
    logDirectoryContents(dir, 0, 4);  // Increased max depth to 4
  });
  
  console.log('\nEnvironment Variables:');
  console.log('NETLIFY:', process.env.NETLIFY);
  console.log('CONTEXT:', process.env.CONTEXT);
  console.log('DEPLOY_PRIME_URL:', process.env.DEPLOY_PRIME_URL);
  console.log('LAMBDA_TASK_ROOT:', process.env.LAMBDA_TASK_ROOT);
  console.log('AWS_LAMBDA_FUNCTION_NAME:', process.env.AWS_LAMBDA_FUNCTION_NAME);
  console.log('AWS_LAMBDA_FUNCTION_MEMORY_SIZE:', process.env.AWS_LAMBDA_FUNCTION_MEMORY_SIZE);
  console.log('AWS_LAMBDA_FUNCTION_VERSION:', process.env.AWS_LAMBDA_FUNCTION_VERSION);
  
  console.log('\nAll Environment Variables:');
  console.log(JSON.stringify(process.env, null, 2));
}