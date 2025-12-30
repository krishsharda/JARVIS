export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const apiKey = process.env.GROQ_API_KEY;
    console.log('GROQ API key present:', !!apiKey);
    
    if (!apiKey) {
      return res.status(500).json({ error: 'Missing GROQ_API_KEY environment variable' });
    }

    const { history = [], userMessage = '' } = req.body;

    const resp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content:
              'You are JARVIS, an intelligent AI assistant inspired by Iron Man. You are helpful, witty, and professional. Keep responses concise and friendly. When answering questions, be accurate and thorough.',
          },
          ...history,
          { role: 'user', content: userMessage },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!resp.ok) {
      const err = await resp.text();
      console.error('GROQ API error:', resp.status, err);
      return res.status(resp.status).json({ error: `GROQ error: ${err}` });
    }

    const data = await resp.json();
    const text = data.choices?.[0]?.message?.content || '';

    return res.status(200).json({ text });
  } catch (e) {
    console.error('Function error:', e);
    return res.status(500).json({ error: e.message });
  }
}
