// app/api/debug-feed/route.ts
// Drop this file into your project to inspect how the Prom XML is structured.
// Then open: http://localhost:3000/api/debug-feed

export async function GET() {
  const url = process.env.PROM_FEED_URL;

  if (!url) {
    return Response.json(
      { error: "PROM_FEED_URL is not set" },
      { status: 500 }
    );
  }

  const res = await fetch(url, { headers: { "User-Agent": "AlitekDebug/1.0" } });
  if (!res.ok) {
    return Response.json(
      { error: `Failed to load feed: ${res.status}` },
      { status: 500 }
    );
  }

  const xml = await res.text();

  // grab first few categories
  const categories = (xml.match(/<category\b[\s\S]*?<\/category>/gi) || [])
    .slice(0, 10);

  // grab first offer
  const offer = (xml.match(/<offer\b[\s\S]*?<\/offer>/i) || [null])[0];

  return Response.json({
    categories,
    offer,
  });
}
