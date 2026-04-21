ALITEK PRODUCTION PREP

1. Copy .env.example into .env.local
2. Set NEXT_PUBLIC_SITE_URL and SITE_URL to your real domain
3. Set PROM_FEED_URL to your real Prom XML feed
4. Open lib/site-config.ts and replace:
   - phoneDisplay
   - phoneHref
   - telegramUsername
   - telegramDisplay
   - email
   - address
5. Replace public/logo.svg and public/favicon.svg if needed
6. Restart the project
7. Check:
   /robots.txt
   /sitemap.xml
   /contact
   /delivery-payment
   /launch-checklist
8. Test order flow from phone and desktop
