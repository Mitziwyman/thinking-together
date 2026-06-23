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
    const { tool, event: eventName } = JSON.parse(event.body);

    if (!tool || !eventName) {
      return { statusCode: 400, body: 'Missing tool or event' };
    }

    const store = getStore('usage-tracking');
    const day = new Date().toISOString().slice(0, 10);
    const key = `${day}/${tool}/${eventName}`;

    const current = await store.get(key, { type: 'text' });
    const count = current ? parseInt(current, 10) + 1 : 1;
    await store.set(key, String(count));

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: 'OK'
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
