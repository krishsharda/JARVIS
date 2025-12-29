exports.handler = async function (event) {
  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const apiKey = process.env.GROQ_API_KEY;
    console.log('GROQ API key present:', !!apiKey);
    console.log('GROQ API key length:', apiKey ? apiKey.length : 0);
    
    if (!apiKey) {
      return { 
        statusCode: 500, 
        body: JSON.stringify({ error: 'Missing GROQ_API_KEY environment variable' })
      };
    }

    const { history = [], userMessage = '' } = JSON.parse(event.body || '{}');

    const resp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'mixtral-8x7b-32768',
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
      return { 
        statusCode: resp.status, 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: `GROQ error: ${err}` })
      };
    }

    const data = await resp.json();
    const text = data.choices?.[0]?.message?.content || '';

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    };
  } catch (e) {
    console.error('Function error:', e);
    return { 
      statusCode: 500, 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: e.message })
    };
  }
};
