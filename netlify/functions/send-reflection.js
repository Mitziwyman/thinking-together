const INTRO = "You filled in a short reflection on the Wyman Associates website — thinking.mitziwyman.com/you. This is what came back.";
const INVITE = "If anything here feels worth exploring further, you're welcome to get in touch.";

function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  let email, opening, reflection;
  try {
    ({ email, opening, reflection } = JSON.parse(event.body));
  } catch {
    return { statusCode: 400, body: 'Invalid request' };
  }

  if (!email || !email.includes('@')) {
    return { statusCode: 400, body: 'Invalid email' };
  }
  if (!reflection || !reflection.trim()) {
    return { statusCode: 400, body: 'Missing reflection' };
  }

  const paragraphs = [INTRO];
  if (opening && opening.trim()) paragraphs.push(opening.trim());
  reflection.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean).forEach(p => paragraphs.push(p));
  paragraphs.push(INVITE);
  paragraphs.push('— Mitzi');

  const html = paragraphs
    .map(p => `<p style="margin:0 0 1em;line-height:1.7;color:#2C3E50;font-family:Georgia,serif;">${escapeHtml(p)}</p>`)
    .join('\n');

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM_EMAIL || 'Mitzi Wyman <mitzi@mitziwyman.com>',
      to: [email],
      bcc: ['mitzi@mitziwyman.com'],
      subject: 'A reflection from Wyman Associates',
      html
    })
  });

  if (!response.ok) {
    return { statusCode: 500, body: 'Send failed' };
  }

  return { statusCode: 200, body: 'OK' };
};
