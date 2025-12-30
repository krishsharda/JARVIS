export default async function handler(req, res) {
  try {
    const apiKey = process.env.SEARCH_API_KEY || process.env.SERPAPI_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Missing SEARCH_API_KEY environment variable' });
    }

    const query = req.query.q || req.query.query || '';
    if (!query) {
      return res.status(400).send('Missing query');
    }

    const resp = await fetch(`https://serpapi.com/search?q=${encodeURIComponent(query)}&api_key=${apiKey}`);
    if (!resp.ok) {
      const err = await resp.text();
      return res.status(resp.status).send(err);
    }

    const data = await resp.json();
    const results = data.organic_results || [];

    if (results.length === 0) {
      return res.status(200).json({ summary: `I couldn't find any results for "${query}".` });
    }

    const top = results.slice(0, 3);
    const summary = `Here's what I found about ${query}: ` + top.map(r => `${r.title}. ${r.snippet}`).join(' ');

    return res.status(200).json({ summary, results: top });
  } catch (e) {
    return res.status(500).send(e.message);
  }
}
