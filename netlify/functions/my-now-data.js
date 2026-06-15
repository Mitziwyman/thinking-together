const { getStore } = require('@netlify/blobs');

exports.handler = async function(event) {
  try {
    const store = getStore('my-now');

    if (event.httpMethod === 'GET') {
      const data = await store.get('data', { type: 'json' });
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data || {})
      };
    }

    if (event.httpMethod === 'POST') {
      let body;
      try {
        body = JSON.parse(event.body);
      } catch {
        return { statusCode: 400, body: 'Invalid JSON' };
      }

      if (!body || typeof body.key !== 'string') {
        return { statusCode: 400, body: 'Missing key' };
      }

      const existing = (await store.get('data', { type: 'json' })) || {};
      existing[body.key] = body.value;
      await store.setJSON('data', existing);

      return { statusCode: 200, body: 'OK' };
    }

    return { statusCode: 405, body: 'Method not allowed' };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: err.message })
    };
  }
};
