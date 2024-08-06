const fs = require('fs-extra');
const path = require('path');

exports.handler = async function(event, context) {
  const sourceDir = path.join(__dirname, '../../public/locales');
  const targetDir = path.join(__dirname, '../functions/ssr/public/locales');

  try {
    await fs.copy(sourceDir, targetDir);
    console.log('Locales copied successfully');
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Locales copied successfully' }),
    };
  } catch (err) {
    console.error('Error copying locales:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to copy locales' }),
    };
  }
};