module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: { message: 'Method not allowed' } });
    return;
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
  const provider = body.provider || '';
  const apiStyle = body.apiStyle || '';
  const apiKey = body.apiKey || '';
  const baseUrlRaw = (body.baseUrl || '').trim();

  const allowedProviders = new Set([
    'ollama-cloud', 'ollama-local', 'openai', 'openrouter', 'gemini', 'mistral', 'custom-openai'
  ]);

  if (!allowedProviders.has(provider)) {
    res.status(400).json({ error: { message: 'Model discovery is not enabled for this provider.' } });
    return;
  }

  if (!baseUrlRaw) {
    res.status(400).json({ error: { message: 'Base URL is empty.' } });
    return;
  }

  let base;
  try {
    base = new URL(baseUrlRaw);
  } catch {
    res.status(400).json({ error: { message: 'Base URL is invalid.' } });
    return;
  }

  const isLocal = ['localhost', '127.0.0.1'].includes(base.hostname);
  if (!(base.protocol === 'https:' || (base.protocol === 'http:' && isLocal))) {
    res.status(400).json({ error: { message: 'Only HTTPS URLs or localhost HTTP URLs are allowed.' } });
    return;
  }

  try {
    let upstream;
    if (apiStyle === 'gemini') {
      const url = `${base.origin}${base.pathname.replace(/\/+$/, '')}/models?key=${encodeURIComponent(apiKey)}`;
      upstream = await fetch(url);
    } else {
      const headers = {};
      if (apiKey) headers.Authorization = `Bearer ${apiKey}`;
      const url = `${base.origin}${base.pathname.replace(/\/+$/, '')}/models`;
      upstream = await fetch(url, { headers });
    }

    const text = await upstream.text();
    let payload;
    try {
      payload = JSON.parse(text);
    } catch {
      payload = { error: { message: text || upstream.statusText } };
    }

    if (!upstream.ok) {
      res.status(upstream.status).json(payload);
      return;
    }

    res.status(200).json(payload);
  } catch (error) {
    res.status(502).json({ error: { message: error.message || 'Upstream request failed.' } });
  }
};
