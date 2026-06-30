const { getStore } = require('@netlify/blobs');

exports.handler = async () => {
  const store = getStore({
    name: 'usage-tracking',
    siteID: process.env.SITE_ID || process.env.NETLIFY_SITE_ID || 'acaba2aa-a05f-4c3d-abab-43b2b9fc26be',
    token: process.env.NETLIFY_BLOBS_TOKEN
  });
  const { blobs } = await store.list();

  const totals = {};
  const visitorSets = {};      // tool -> Set of all-time unique visitor ids
  const dayVisitorSets = {};   // tool -> day -> Set of unique visitor ids

  const ensureTool = (tool) => {
    totals[tool] = totals[tool] || { _byDay: {} };
    return totals[tool];
  };

  for (const { key } of blobs) {
    const parts = key.split('/');

    if (parts[0] === 'visitors') {
      // visitors/<day>/<tool>/<visitorId>
      const [, day, tool, visitorId] = parts;
      ensureTool(tool);
      visitorSets[tool] = visitorSets[tool] || new Set();
      visitorSets[tool].add(visitorId);
      dayVisitorSets[tool] = dayVisitorSets[tool] || {};
      dayVisitorSets[tool][day] = dayVisitorSets[tool][day] || new Set();
      dayVisitorSets[tool][day].add(visitorId);
    } else {
      // <day>/<tool>/<eventName>
      const [day, tool, eventName] = parts;
      const t = ensureTool(tool);
      const count = parseInt(await store.get(key, { type: 'text' }), 10) || 0;
      t[eventName] = (t[eventName] || 0) + count;
      t._byDay[day] = t._byDay[day] || {};
      t._byDay[day][eventName] = (t._byDay[day][eventName] || 0) + count;
    }
  }

  // Fold the unique-people counts in alongside the event counts.
  for (const tool of Object.keys(visitorSets)) {
    totals[tool].uniqueVisitors = visitorSets[tool].size;
    for (const day of Object.keys(dayVisitorSets[tool])) {
      totals[tool]._byDay[day] = totals[tool]._byDay[day] || {};
      totals[tool]._byDay[day].uniqueVisitors = dayVisitorSets[tool][day].size;
    }
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(totals, null, 2)
  };
};
