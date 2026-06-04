exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  let name, email;
  try {
    ({ name, email } = JSON.parse(event.body));
  } catch {
    return { statusCode: 400, body: 'Invalid request' };
  }

  if (!email || !email.includes('@')) {
    return { statusCode: 400, body: 'Invalid email' };
  }

  const GROUP_ID = '189373650929976519';
  const API_KEY = process.env.MAILERLITE_API_KEY;

  const response = await fetch('https://connect.mailerlite.com/api/subscribers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${API_KEY}`
    },
    body: JSON.stringify({
      email,
      fields: { name: name || '' },
      groups: [GROUP_ID]
    })
  });

  if (!response.ok && response.status !== 409) {
    return { statusCode: 500, body: 'Signup failed' };
  }

  return { statusCode: 200, body: 'OK' };
};
