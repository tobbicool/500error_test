// src/pages/api/translations/[lang]/[ns].js
import fs from 'fs/promises';
import path from 'path';

export async function get({ params }) {
  const { lang, ns } = params;
  const filePath = path.resolve(`public/locales/${lang}/${ns}.json`);

  try {
    const data = await fs.readFile(filePath, 'utf8');
    return new Response(data, {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to load translations' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}