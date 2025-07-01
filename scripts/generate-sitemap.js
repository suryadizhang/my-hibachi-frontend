// Sitemap generation for SEO and performance
const fs = require('fs');
const path = require('path');

const baseUrl = 'https://myhibachichef.com';
const currentDate = new Date().toISOString();

// Define all pages
const pages = [
  { url: '/', priority: '1.0', changefreq: 'weekly' },
  { url: '/about', priority: '0.9', changefreq: 'monthly' },
  { url: '/menu', priority: '0.9', changefreq: 'weekly' },
  { url: '/contact', priority: '0.8', changefreq: 'monthly' },
  { url: '/reviews', priority: '0.7', changefreq: 'weekly' },
  { url: '/faqs', priority: '0.6', changefreq: 'monthly' },
  { url: '/admin', priority: '0.1', changefreq: 'never' },
];

// Generate sitemap XML
const generateSitemap = () => {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  // Write sitemap to public directory
  const sitemapPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
  fs.writeFileSync(sitemapPath, sitemap);
  
  console.log('✅ Sitemap generated successfully!');
  console.log(`📍 Location: ${sitemapPath}`);
  console.log(`🔗 URL: ${baseUrl}/sitemap.xml`);
};

// Generate robots.txt with sitemap reference
const generateRobotsTxt = () => {
  const robotsContent = `# Robots.txt for My Hibachi Chef - Performance Optimized
User-agent: *
Allow: /

# Sitemap location for faster indexing
Sitemap: ${baseUrl}/sitemap.xml

# Optimize crawl budget
User-agent: Googlebot
Crawl-delay: 1

User-agent: Bingbot
Crawl-delay: 2

# Block unnecessary paths for performance
Disallow: /admin/
Disallow: /_next/
Disallow: /api/internal/
Disallow: *.json$
Disallow: /logs/

# Allow important assets
Allow: /assets/
Allow: /_next/static/
`;

  const robotsPath = path.join(__dirname, '..', 'public', 'robots.txt');
  fs.writeFileSync(robotsPath, robotsContent);
  
  console.log('✅ Robots.txt updated successfully!');
};

// Run generation
if (require.main === module) {
  generateSitemap();
  generateRobotsTxt();
}

module.exports = { generateSitemap, generateRobotsTxt };
