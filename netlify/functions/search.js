exports.handler = async function (event) {
  try {
    const apiKey = process.env.SEARCH_API_KEY || process.env.SERPAPI_KEY;
    if (!apiKey) {
      return { statusCode: 500, body: JSON.stringify({ error: 'Missing SEARCH_API_KEY environment variable' }) };
    }

    const query = new URLSearchParams(event.queryStringParameters || {}).get('q') || new URLSearchParams(event.queryStringParameters || {}).get('query') || '';
    if (!query) {
      return { statusCode: 400, body: 'Missing query' };
    }

    const resp = await fetch(`https://serpapi.com/search?q=${encodeURIComponent(query)}&api_key=${apiKey}`);
    if (!resp.ok) {
      const err = await resp.text();
      return { statusCode: resp.status, body: err };
    }

    const data = await resp.json();
    const results = data.organic_results || [];

    if (results.length === 0) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ summary: `I couldn't find any results for "${query}".` }),
      };
    }

    const top = results.slice(0, 3);
    const summary = `Here's what I found about ${query}: ` + top.map(r => `${r.title}. ${r.snippet}`).join(' ');

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ summary, results: top }),
    };
  } catch (e) {
    return { statusCode: 500, body: e.message };
  }
};
