const { getStore } = require('@netlify/blobs');

exports.handler = async () => {
  const store = getStore('usage-tracking');
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
