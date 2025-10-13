const { writeFileSync } = require('fs');
const base = process.env.REACT_APP_SITE_URL || 'https://mvassociates.org';

const routes = [
  '/',
  '/customers',
  '/login',
  '/register',
  '/profile'
];

const urls = routes.map(r => `  <url><loc>${base}${r}</loc></url>`).join('\n');
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
writeFileSync('public/sitemap.xml', xml);
console.log('sitemap.xml written to public/sitemap.xml');
