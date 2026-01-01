export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      return res.status(500).send('Missing ELEVENLABS_API_KEY');
    }

    const { text = '' } = req.body;

    const resp = await fetch(
      'https://api.elevenlabs.io/v1/text-to-speech/s3TPKV1kjDlVtZbl4Ksh',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': apiKey,
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: { stability: 0.5, similarity_boost: 0.75 },
        }),
      }
    );

    if (!resp.ok) {
      const err = await resp.text();
      return res.status(resp.status).send(err);
    }

    const buf = Buffer.from(await resp.arrayBuffer());
    
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).send(buf.toString('base64'));
  } catch (e) {
    return res.status(500).send(e.message);
  }
}
