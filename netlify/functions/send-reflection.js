const INTRO = "You filled in a short reflection on the Wyman Associates website — thinking.mitziwyman.com/you. This is what came back.";

const FRAME = "Most leaders know the gap intimately — between the organisation they're working in and the one they sense could exist. It doesn't close. That's not a counsel of despair; it's just the truth of the work. The question is how to stand in it without burning out or giving up — and that, in the end, is rarely something anyone manages alone. Dialogue, when the conditions are right, moves people past the assumptions they've made about each other. And in that movement, the thinking in the room changes. That's where this work begins.";

const PROFILE_COPY = {
  A: [
    "Something I see a lot in the organisations I work with: people carrying an enormous amount. Pressure, scrutiny, the emotional weight of decisions that affect other people's lives. It doesn't leave much room for anything else.",
    "What tends to go first is the thinking — not because people stop caring about it, but because there's nowhere to put it. Conversations stay on the surface. Decisions get made fast, on partial information. The people with the most useful things to say go quiet, or don't get asked. And the organisation gets better and better at managing its problems without ever quite resolving them.",
    "The Meeting Intelligence Index is a short diagnostic that holds up a mirror to what's happening when your people are in the room together. What it tends to surface are things people have sensed but haven't been able to name — and that shift, from something felt to something understood, is usually where the movement begins.",
    "If any of this resonates, I'd be glad to talk."
  ],
  B: [
    "Something I notice with a lot of senior leaders who are doing the job well: there's a point where doing more of the same stops producing different results. The organisation is functioning. People are committed. And yet something isn't quite moving.",
    "What I tend to find underneath it is a narrowing of horizon — not always visible from inside it. The conversations are happening, but they're close in. The thinking is good, but it's working on what's already known rather than reaching toward what isn't yet clear. And the relationships that might open that up — with people who think differently, who see further, who ask the uncomfortable question — don't quite have the conditions they need.",
    "That's the territory the Thinking Environment courses work in. Not skills or frameworks in the conventional sense — more the quality of what becomes possible when people feel genuinely heard, and when the conversation can afford to go somewhere new.",
    "If that question feels live for you, I'd be glad to think it through."
  ],
  C: [
    "The organisations I find most interesting to work with are the ones asking this question — not because something is wrong, but because they've built something that works and they want to understand what takes it further.",
    "What I've come to think, after twenty years of this work, is that the answer is almost never structural. It's about horizon — whether the organisation can see far enough, think expansively enough, operate relationally rather than just transactionally. Those things sound abstract until you sit in a room where they're present, or absent. The difference is not subtle.",
    "What makes that possible is the quality of the thinking the organisation can generate together — whether people are doing their best thinking in the room, whether the conversations are producing something genuinely new, whether there's enough trust for the difficult thing to be said. Building that kind of range is slower work than most organisations expect. But it compounds.",
    "If you're sitting with that question, I'd be glad to have the conversation."
  ]
};

const SIGNPOST = {
  B: 'The courses page is the most direct route in — <a href="https://thinking.mitziwyman.com/courses">thinking.mitziwyman.com/courses</a>',
  C: 'The organisations page sets out how this work tends to unfold — <a href="https://thinking.mitziwyman.com/organisations">thinking.mitziwyman.com/organisations</a>'
};

const CALENDLY = 'https://calendly.com/mitziw/discovery-call';

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  let email, profile, opening;
  try {
    ({ email, profile, opening } = JSON.parse(event.body));
  } catch {
    return { statusCode: 400, body: 'Invalid request' };
  }

  if (!email || !email.includes('@')) {
    return { statusCode: 400, body: 'Invalid email' };
  }

  if (!PROFILE_COPY[profile]) {
    return { statusCode: 400, body: 'Invalid profile' };
  }

  const paragraphs = [
    INTRO,
    FRAME,
    opening || '',
    ...PROFILE_COPY[profile],
    SIGNPOST[profile],
    `I'd be glad to talk — you can book a call here: <a href="${CALENDLY}">${CALENDLY}</a>`
  ].filter(Boolean);

  const html = paragraphs.map(p => `<p style="margin:0 0 1em;line-height:1.7;color:#2C3E50;font-family:Georgia,serif;">${p}</p>`).join('\n');

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
