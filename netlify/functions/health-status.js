const { getStore } = require('@netlify/blobs');

// Reads the history that the daily 7am health check writes, and hands it to the
// status page. Read-only — it never runs the tools itself, so it's fast and cheap.
exports.handler = async function () {
  let history = [];
  try {
    const store = getStore('tool-health-history');
    const existing = await store.get('history', { type: 'json' });
    if (Array.isArray(existing)) history = existing;
  } catch (e) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Could not read health history' })
    };
  }

  const recent = history.slice(-14);
  const latest = recent.length ? recent[recent.length - 1] : null;

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ latest, recent })
  };
};
