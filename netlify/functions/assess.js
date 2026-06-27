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
    { label: 'Having a clear question at the heart of the meeting', score: scores.mrc1 || 0 },
    { label: 'Arriving with genuine attention — not still in the last conversation', score: scores.mrc2 || 0 },
    { label: 'Creating conditions for everyone to contribute, not just the most vocal', score: scores.mrc3 || 0 },
    { label: 'Holding the space with ease — not rushing, depleted, or distracted', score: scores.mrc4 || 0 },
    { label: 'Knowing how you want people to feel when they leave', score: scores.mrc5 || 0 }
  ];

  const total = questions.reduce((sum, q) => sum + q.score, 0);
  const max = questions.length * 5;
  const pct = Math.round((total / max) * 100);

  const low = questions.filter(q => q.score > 0 && q.score <= 2).map(q => q.label);
  const mid = questions.filter(q => q.score === 3).map(q => q.label);
  const unanswered = questions.filter(q => q.score === 0).map(q => q.label);

  const prompt = `You are Mitzi Wyman, an executive coach and facilitator trained in Nancy Kline's Thinking Environment. A leader has just completed a five-question Meeting Readiness Check before going into a meeting. Their overall score is ${pct}% (${total} out of ${max}).

Their individual scores:
${questions.map(q => `- ${q.label}: ${q.score > 0 ? q.score + '/5' : 'not answered'}`).join('\n')}

${low.length > 0 ? `Areas scoring lowest (1-2): ${low.join('; ')}` : ''}
${mid.length > 0 ? `Areas scoring mid-range (3): ${mid.join('; ')}` : ''}
${unanswered.length > 0 ? `Not answered: ${unanswered.join('; ')}` : ''}

Write a short, warm, direct response (3-5 sentences) in Mitzi's voice.

Guidelines:
- Speak directly to the leader as 'you'
- Be honest but compassionate — acknowledge the reality of organisational life and how hard it is to find time
- If scores are low, acknowledge that time feels scarce but that preparation is an investment not a cost — time spent well in thinking before a meeting pays dividends in the meeting itself
- If scores are mid-range, name specifically what's strong and what's worth attending to before going in
- If scores are high, affirm their readiness and invite them to hold that intention once they're in the room
- Reference specific low-scoring areas by name where relevant — don't be generic
- Do not use bullet points. Write in flowing prose.
- Do not start with "I"
- Do not be sycophantic or use phrases like "well done"
- Keep it under 80 words`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 200,
      messages: [{ role: 'user', content: prompt }]
    })
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error('Anthropic API error:', response.status, errorBody);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Assessment failed' })
    };
  }

  const data = await response.json();
  const text = data.content[0].text;

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, pct })
  };
};
