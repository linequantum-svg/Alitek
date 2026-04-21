ALITEK — LAUNCH READY CHECKLIST

1. Copy .env.example into .env.local

2. Fill in .env.local:
   NEXT_PUBLIC_SITE_URL=https://your-domain.com
   SITE_URL=https://your-domain.com
   PROM_FEED_URL=your real Prom XML feed

3. Open lib/site-config.ts and replace:
   - phoneDisplay
   - phoneHref
   - telegramUsername
   - telegramDisplay
   - email
   - address

4. Restart the project

5. Check locally:
   /robots.txt
   /sitemap.xml
   /manifest.webmanifest
   /contact
   /delivery-payment
   /catalog
   /product/...

6. Before publish:
   - test cart
   - test favorites
   - test Telegram order
   - test mobile version
   - test search and brand filter

7. After deploy:
   - open your real domain
   - re-check robots.txt
   - re-check sitemap.xml
   - submit sitemap to Google Search Console
