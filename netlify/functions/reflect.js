exports.handler = async (event) => {
  const { answers } = JSON.parse(event.body);
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
      system: answers.system,
      messages: [{ role: 'user', content: answers.prompt }]
    })
  });
  const data = await response.json();
  return {
    statusCode: 200,
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify(data)
  };
};
