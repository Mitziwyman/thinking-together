exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  let q7Answer;
  try {
    ({ q7Answer } = JSON.parse(event.body));
  } catch {
    return { statusCode: 400, body: 'Invalid request' };
  }

  if (!q7Answer) {
    return { statusCode: 400, body: 'Missing q7Answer' };
  }

  const systemPrompt = `You are writing in the voice of Mitzi Wyman — an independent leadership consultant, lawyer by background, member of the Time to Think Faculty. Her voice is warm but not soft, peer to peer, grounded and direct. Prose not bullets. No leadership clichés. No exclamation marks. No signposting phrases. UK English. Short sentences where possible. If it sounds like AI wrote it, rewrite it.`;

  const userPrompt = `Write one or two sentences only — a personalised opening that responds to what prompted this person to fill in the diagnostic today. Their answer to that question was: "${q7Answer}". The opening should feel like Mitzi is speaking directly to them, acknowledging what brought them here, without being sycophantic or performative. Do not summarise what follows. Do not explain what the diagnostic is. Just meet them where they are. After this opening, the full profile text will appear — do not write that, just the opening.`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 1000,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }]
    })
  });

  if (!response.ok) {
    return { statusCode: 500, body: 'Diagnostic failed' };
  }

  const data = await response.json();
  const opening = data.content[0].text.trim();

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ opening })
  };
};
