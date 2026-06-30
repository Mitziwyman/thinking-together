const { getStore } = require('@netlify/blobs');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  try {
    const { tool, event: eventName, visitorId } = JSON.parse(event.body);

    if (!tool || !eventName) {
      return { statusCode: 400, body: 'Missing tool or event' };
    }

    const store = getStore({
      name: 'usage-tracking',
      siteID: process.env.SITE_ID || process.env.NETLIFY_SITE_ID || 'acaba2aa-a05f-4c3d-abab-43b2b9fc26be',
      token: process.env.NETLIFY_BLOBS_TOKEN
    });
    const day = new Date().toISOString().slice(0, 10);

    // Event counter — same key format as before, so existing history is preserved.
    const key = `${day}/${tool}/${eventName}`;
    const current = await store.get(key, { type: 'text' });
    const count = current ? parseInt(current, 10) + 1 : 1;
    await store.set(key, String(count));

    // Unique-visitor record — one key per visitor, per tool, per day.
    // Writing the same key again does nothing, so repeat clicks from the
    // same browser are only ever counted once.
    if (visitorId) {
      await store.set(`visitors/${day}/${tool}/${visitorId}`, '1');
    }

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: 'OK'
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
