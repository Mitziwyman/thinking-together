exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  let scores;
  try {
    ({ scores } = JSON.parse(event.body));
  } catch {
    return { statusCode: 400, body: 'Invalid request' };
  }

  const questions = [
    { key: 'hc1', label: 'naming where your best thinking went', score: scores.hc1 || 0 },
    { key: 'hc2', label: 'matching your thinking to the question it was asking', score: scores.hc2 || 0 },
    { key: 'hc3', label: 'noticing the pull of the present back into the old', score: scores.hc3 || 0 },
    { key: 'hc4', label: 'protecting time from the immediate and urgent', score: scores.hc4 || 0 },
    { key: 'hc5', label: 'carrying a clear question forward into next week', score: scores.hc5 || 0 }
  ];

  const answered = questions.filter(q => q.score > 0);
  const total = answered.reduce((sum, q) => sum + q.score, 0);
  const max = answered.length * 5;
  const pct = max > 0 ? Math.round((total / max) * 100) : 0;

  const lowest = answered.reduce((a, b) => (b.score < a.score ? b : a), answered[0]);
  const highest = answered.reduce((a, b) => (b.score > a.score ? b : a), answered[0]);

  const prompt = `You are Mitzi Wyman, a leadership consultant and Time to Think Faculty member. Someone has just completed a five-question Horizon Check at the end of their working week, rating themselves 1-5 on each statement.

Their answers:
${questions.map(q => `- ${q.label}: ${q.score > 0 ? q.score + '/5' : 'not answered'}`).join('\n')}

Highest-scoring area: ${highest.label} (${highest.score}/5)
Lowest-scoring area: ${lowest.label} (${lowest.score}/5)

Write a response in two parts, separated by a line containing only "---".

Part one (3-4 sentences): Notice something specific that is emerging across this particular pattern of scores — not a generic comment about reflection in general. Reference the actual highest and lowest areas by name. Stay with what's opening up rather than what's weighing them down.

Part two (2-3 sentences): Speak directly and specifically to their lowest-scoring area, "${lowest.label}". Offer one small, concrete thing they could notice or try next week in relation to it — not generic advice, something that follows from this specific score and area.

Rules for both parts:
- Warm and direct — peer to peer, not coach to client
- No bullet points, prose only
- No affirmations, no motivational language, no "well done"
- Never end either part on a question
- Do not start with "I"
- Keep the whole response under 110 words total`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 300,
      messages: [{ role: 'user', content: prompt }]
    })
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error('Anthropic API error:', response.status, errorBody);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Horizon check failed' })
    };
  }

  const data = await response.json();
  const fullText = data.content[0].text;
  const [main, focus] = fullText.split('---').map(s => s.trim());

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      main: main || fullText.trim(),
      focus: focus || '',
      pct
    })
  };
};
