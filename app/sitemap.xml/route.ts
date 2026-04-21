import { getBaseUrl } from "@/lib/site-config";
import { getSitemapData, slugifyCategory } from "@/lib/storefront-data";

export async function GET() {
  const baseUrl = getBaseUrl();
  const { categories, productSlugs } = await getSitemapData();

  const urls = [
    `${baseUrl}/`,
    `${baseUrl}/catalog`,
    `${baseUrl}/cart`,
    `${baseUrl}/favorites`,
    `${baseUrl}/contact`,
    `${baseUrl}/delivery-payment`,
    ...categories.map((cat) => `${baseUrl}/catalog/${slugifyCategory(cat.name)}`),
    ...productSlugs.map((slug) => `${baseUrl}/product/${slug}`),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${url}</loc>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}