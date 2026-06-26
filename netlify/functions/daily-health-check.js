const { getStore } = require('@netlify/blobs');

const HISTORY_LIMIT = 90;

function evaluate(tool, ok, text, keywords, minLen) {
  if (!ok) return { tool, pass: false, reason: 'HTTP error / non-200 response', excerpt: '' };
  if (!text || text.length < minLen) {
    return { tool, pass: false, reason: 'empty or too short', excerpt: (text || '').slice(0, 150) };
  }
  const lower = text.toLowerCase();
  const hit = keywords.some((k) => lower.includes(k.toLowerCase()));
  if (!hit) {
    return { tool, pass: false, reason: 'looks generic — no scenario-specific detail found', excerpt: text.slice(0, 150) };
  }
  return { tool, pass: true, reason: 'ok', excerpt: text.slice(0, 150) };
}

async function testMII() {
  const keywords = ['Priya', 'budget', 'finance team', 'silent', 'dominated', 'Manchester'];
  const jobId = `health-check-${Date.now()}`;
  try {
    const submitRes = await fetch('https://meetings-culture.netlify.app/.netlify/functions/claude-background', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jobId,
        prompt: "You are Mitzi Wyman, an executive coach trained in Nancy Kline's Thinking Environment. Write a short reflection (3-4 sentences) for a leader named Priya who just ran a budget reprioritisation meeting with her finance team in Manchester, where two people stayed silent the whole time and one person dominated. Reference the specific scenario."
      })
    });
    if (!submitRes.ok) return { tool: 'MII', pass: false, reason: 'HTTP error / non-200 response submitting job', excerpt: '' };

    // claude-background runs async; poll claude-status until the job finishes.
    let job = null;
    for (let i = 0; i < 15; i++) {
      await new Promise((r) => setTimeout(r, 2000));
      const statusRes = await fetch(`https://meetings-culture.netlify.app/.netlify/functions/claude-status?jobId=${jobId}`);
      job = await statusRes.json().catch(() => null);
      if (job?.status === 'done' || job?.status === 'error') break;
    }

    if (!job || job.status === 'pending') {
      return { tool: 'MII', pass: false, reason: 'job did not complete in time', excerpt: '' };
    }
    if (job.status === 'error') {
      return { tool: 'MII', pass: false, reason: 'job reported an error', excerpt: String(job.error || '') };
    }
    const text = job.data?.content?.[0]?.text || '';
    return evaluate('MII', true, text, keywords, 100);
  } catch (e) {
    return { tool: 'MII', pass: false, reason: 'no response / connection error', excerpt: String(e) };
  }
}

async function testOII() {
  const keywords = ['Tariq', 'Bridgeview', 'relational value', 'financial value'];
  try {
    const res = await fetch('https://organisational-intelligence-index.netlify.app/.netlify/functions/reflect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: "You are an organisational diagnostic assistant. Write a short reflection (3-4 sentences) for someone named Tariq at a healthcare nonprofit called Bridgeview Trust, who scored low on 'visibility of relational value' and high on 'visibility of financial value' in a recent assessment. Reference the specific scores and organisation."
      })
    });
    const data = await res.json().catch(() => ({}));
    const text = data?.text || '';
    return evaluate('OII', res.ok, text, keywords, 100);
  } catch (e) {
    return { tool: 'OII', pass: false, reason: 'no response / connection error', excerpt: String(e) };
  }
}

async function testCompanion() {
  try {
    const res = await fetch('https://mitziwyman.com/api/assess', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scores: { mrc1: 1, mrc2: 3, mrc3: 2, mrc4: 3, mrc5: 2 } })
    });
    const data = await res.json().catch(() => ({}));
    const text = data?.text || '';
    const pct = data?.pct;
    if (!res.ok) return { tool: 'Companion', pass: false, reason: 'HTTP error / non-200 response', excerpt: '' };
    if (!text || text.length < 80 || typeof pct !== 'number') {
      return { tool: 'Companion', pass: false, reason: 'missing text/pct or text too short', excerpt: text.slice(0, 150) };
    }
    if (/assessment failed|something went wrong/i.test(text)) {
      return { tool: 'Companion', pass: false, reason: 'error placeholder text returned', excerpt: text.slice(0, 150) };
    }
    return { tool: 'Companion', pass: true, reason: 'ok', excerpt: text.slice(0, 150) };
  } catch (e) {
    return { tool: 'Companion', pass: false, reason: 'no response / connection error', excerpt: String(e) };
  }
}

async function testSundayReset() {
  const keywords = ['backlog', 'client', 'Wednesday', 'deadline', 'Thursday', 'coaching'];
  try {
    const res = await fetch('https://mitziwyman.com/.netlify/functions/reflect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: '1. What I am carrying: a heavy backlog of unanswered emails and a difficult client conversation postponed twice\n2. What is mine to act on: replying to the client by Wednesday\n3. Where my attention is going: a project deadline that keeps slipping\n4. What a good week looks like: getting ahead of the backlog and feeling less reactive\n5. The opportunity I am looking forward to: a coaching session with a new client on Thursday',
        system: 'You are a thinking partner inside a Sunday evening reflection tool. Read the five answers as a whole and write a response of three to four sentences. Notice something specific that is emerging across what they wrote. Warm and direct, prose only, no bullets, never end on a question.'
      })
    });
    const data = await res.json().catch(() => ({}));
    const text = data?.content?.[0]?.text || '';
    return evaluate('Sunday Reset', res.ok, text, keywords, 100);
  } catch (e) {
    return { tool: 'Sunday Reset', pass: false, reason: 'no response / connection error', excerpt: String(e) };
  }
}

async function testHorizons() {
  try {
    const res = await fetch('https://mitziwyman.com/horizons');
    const body = await res.text();
    if (!res.ok) return { tool: 'Horizons', pass: false, reason: 'HTTP error / non-200 response', excerpt: '' };
    if (body.length < 2000 || !body.includes('calculateHorizonCheck')) {
      return { tool: 'Horizons', pass: false, reason: 'page looks broken or script missing', excerpt: body.slice(0, 150) };
    }
    return { tool: 'Horizons', pass: true, reason: 'ok', excerpt: '' };
  } catch (e) {
    return { tool: 'Horizons', pass: false, reason: 'no response / connection error', excerpt: String(e) };
  }
}

exports.handler = async function () {
  const results = await Promise.all([
    testMII(),
    testOII(),
    testCompanion(),
    testSundayReset(),
    testHorizons()
  ]);

  const now = new Date().toISOString();
  const failed = results.filter((r) => !r.pass);

  try {
    const store = getStore('tool-health-history');
    let history = [];
    try {
      const existing = await store.get('history', { type: 'json' });
      if (Array.isArray(existing)) history = existing;
    } catch {
      // no history yet
    }
    history.push({ date: now, results });
    if (history.length > HISTORY_LIMIT) history = history.slice(-HISTORY_LIMIT);
    await store.setJSON('history', history);
  } catch (e) {
    console.error('Failed to write health-check history blob', e);
  }

  if (failed.length > 0) {
    const summary =
      `Health check run at ${now}\n\n` +
      results
        .map((r) => `${r.tool}: ${r.pass ? 'PASS' : 'FAIL'} — ${r.reason}\nExcerpt: ${r.excerpt}\n`)
        .join('\n');
    try {
      await fetch('https://mitziwyman.com/api/health-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: `⚠️ Tool health check — ${failed.length} issue(s) found`,
          summary
        })
      });
    } catch (e) {
      console.error('Failed to send health-alert email', e);
    }
  }

  return { statusCode: 200, body: JSON.stringify({ ranAt: now, failed: failed.length, results }) };
};
