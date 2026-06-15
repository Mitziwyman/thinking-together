import { getStore } from '@netlify/blobs';

export default async (req) => {
  try {
    const store = getStore('my-now');

    if (req.method === 'GET') {
      const data = await store.get('data', { type: 'json' });
      return new Response(JSON.stringify(data || {}), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (req.method === 'POST') {
      let body;
      try {
        body = await req.json();
      } catch {
        return new Response('Invalid JSON', { status: 400 });
      }

      if (!body || typeof body.key !== 'string') {
        return new Response('Missing key', { status: 400 });
      }

      const existing = (await store.get('data', { type: 'json' })) || {};
      existing[body.key] = body.value;
      await store.setJSON('data', existing);

      return new Response('OK');
    }

    return new Response('Method not allowed', { status: 405 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
