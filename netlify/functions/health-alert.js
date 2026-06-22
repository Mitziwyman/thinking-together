exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  let subject, summary;
  try {
    ({ subject, summary } = JSON.parse(event.body));
  } catch {
    return { statusCode: 400, body: 'Invalid request' };
  }

  if (!subject || !summary) {
    return { statusCode: 400, body: 'Missing subject or summary' };
  }

  const html = `<div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;color:#2C3E50;">
    <h2 style="margin:0 0 16px;">${subject}</h2>
    <pre style="white-space:pre-wrap;font-family:Georgia,serif;font-size:15px;line-height:1.7;">${summary}</pre>
  </div>`;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM_EMAIL || 'Wyman Tools Health Check <mitzi@mitziwyman.com>',
      to: ['mitzi@mitziwyman.com'],
      subject,
      html
    })
  });

  if (!response.ok) {
    return { statusCode: 500, body: 'Send failed' };
  }

  return { statusCode: 200, body: 'OK' };
};
