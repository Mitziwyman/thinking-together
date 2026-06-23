const { getStore } = require('@netlify/blobs');

exports.handler = async () => {
  const store = getStore({
    name: 'usage-tracking',
    siteID: process.env.SITE_ID || process.env.NETLIFY_SITE_ID || 'acaba2aa-a05f-4c3d-abab-43b2b9fc26be',
    token: process.env.NETLIFY_BLOBS_TOKEN
  });
  const { blobs } = await store.list();

  const totals = {};
  for (const { key } of blobs) {
    const [day, tool, eventName] = key.split('/');
    const count = parseInt(await store.get(key, { type: 'text' }), 10);
    totals[tool] = totals[tool] || {};
    totals[tool][eventName] = (totals[tool][eventName] || 0) + count;
    totals[tool]._byDay = totals[tool]._byDay || {};
    totals[tool]._byDay[day] = totals[tool]._byDay[day] || {};
    totals[tool]._byDay[day][eventName] = (totals[tool]._byDay[day][eventName] || 0) + count;
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(totals, null, 2)
  };
};
