exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  let responses;
  try {
    ({ responses } = JSON.parse(event.body));
  } catch {
    return { statusCode: 400, body: 'Invalid request' };
  }

  if (!Array.isArray(responses) || responses.length === 0) {
    return { statusCode: 400, body: 'Missing responses' };
  }

  const answersBlock = responses
    .map((r, i) => `Q${i + 1}. ${r.question}\nTheir answer: ${r.answer}`)
    .join('\n\n');

  const systemPrompt = `You are writing in the voice of Mitzi Wyman — an independent leadership consultant, lawyer by background, member of the Time to Think Faculty. Her voice is warm but not soft, peer to peer, grounded and direct. Prose, never bullets. No leadership clichés, no jargon, no exclamation marks, no signposting phrases. UK English. Short sentences where they help. If it sounds like AI wrote it, rewrite it.

You are writing a private reflection back to a leader who has just answered seven honest questions about how things really are for them right now. Your job is to be a genuine mirror — to notice something specific and true across what they said, and to reflect it back in a way that helps them see it more clearly. This is for them, not a sales page. Do not mention Mitzi's tools, courses, diagnostics, or booking a call. Do not pitch anything. Do not flatter or reassure emptily. Do not give advice or a to-do list. Draw only on what they actually told you, and meet them honestly where they are.`;

  const userPrompt = `Here is what the person answered. Read all seven together as a whole — notice the pattern across them, not each one in isolation.

${answersBlock}

Write a reflection in Mitzi's voice, as valid JSON only, with exactly these two keys:
- "opening": one or two sentences that meet them where they are — the first line they read. Personal and specific, not a summary of the questions.
- "reflection": three short paragraphs, roughly 150 to 220 words in total, separated by blank lines, noticing something specific and true across their answers and holding it up to them honestly. End on a settled statement, never a question.

Return only the JSON object, nothing before or after it.`;

  let opening = '';
  let reflection = '';

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1200,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }]
      })
    });

    if (!response.ok) {
      return { statusCode: 500, body: 'Diagnostic failed' };
    }

    const data = await response.json();
    const raw = ((data.content && data.content[0] && data.content[0].text) || '').trim();

    // Pull the JSON object out even if the model wrapped it in prose or code fences.
    const match = raw.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        const parsed = JSON.parse(match[0]);
        opening = (parsed.opening || '').trim();
        reflection = (parsed.reflection || '').trim();
      } catch {
        // fall through to raw handling
      }
    }

    // If parsing didn't yield a reflection, use the whole reply as the reflection —
    // unless it looks like a broken JSON fragment, in which case leave it empty so
    // the page falls back gracefully rather than showing raw braces.
    if (!reflection) {
      reflection = raw.startsWith('{') ? '' : raw;
    }
  } catch (e) {
    return { statusCode: 500, body: 'Diagnostic failed' };
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ opening, reflection })
  };
};
