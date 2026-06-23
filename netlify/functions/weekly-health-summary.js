const { getStore } = require('@netlify/blobs');

const DAYS = 7;

exports.handler = async function () {
  const now = new Date();
  const cutoff = new Date(now.getTime() - DAYS * 24 * 60 * 60 * 1000);

  let history = [];
  try {
    const store = getStore('tool-health-history');
    const existing = await store.get('history', { type: 'json' });
    if (Array.isArray(existing)) history = existing;
  } catch (e) {
    console.error('Failed to read health-check history blob', e);
  }

  const recent = history.filter((entry) => new Date(entry.date) >= cutoff);

  const byTool = {};
  for (const entry of recent) {
    for (const r of entry.results) {
      if (!byTool[r.tool]) byTool[r.tool] = { pass: 0, fail: 0, failures: [] };
      if (r.pass) {
        byTool[r.tool].pass += 1;
      } else {
        byTool[r.tool].fail += 1;
        byTool[r.tool].failures.push({ date: entry.date, reason: r.reason, excerpt: r.excerpt });
      }
    }
  }

  const toolNames = Object.keys(byTool).sort();
  const totalRuns = recent.length;
  const totalFailures = toolNames.reduce((sum, t) => sum + byTool[t].fail, 0);

  let summary = `Weekly tool health summary — ${now.toISOString().slice(0, 10)}\n`;
  summary += `Covers the last ${DAYS} days (${totalRuns} daily check${totalRuns === 1 ? '' : 's'} run, ${totalFailures} failure${totalFailures === 1 ? '' : 's'} total)\n\n`;

  if (totalRuns === 0) {
    summary += 'No health-check runs were recorded this week — the daily check may not have run.\n';
  } else {
    for (const tool of toolNames) {
      const t = byTool[tool];
      summary += `${tool}: ${t.pass}/${t.pass + t.fail} passed\n`;
      for (const f of t.failures) {
        summary += `  - ${f.date.slice(0, 10)}: ${f.reason} (excerpt: ${f.excerpt})\n`;
      }
    }
    if (totalFailures === 0) {
      summary += '\nEverything passed every day this week — no action needed.';
    }
  }

  try {
    await fetch('https://mitziwyman.com/api/health-alert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subject: totalFailures > 0
          ? `📊 Weekly tool health summary — ${totalFailures} issue(s) this week`
          : '📊 Weekly tool health summary — all clear',
        summary
      })
    });
  } catch (e) {
    console.error('Failed to send weekly health summary email', e);
  }

  return { statusCode: 200, body: JSON.stringify({ ranAt: now.toISOString(), totalRuns, totalFailures }) };
};
