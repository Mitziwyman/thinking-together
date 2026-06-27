# Mitzi Wyman's Thinking Tools — Technical & Functional Summary

*Prepared 27 June 2026. Covers five tools across two repos: the two flagship diagnostics (MII, OII) and three lighter companion tools built into the Thinking Together website.*

## How these tools are built (shared pattern)

All five are single HTML pages with embedded JavaScript, each hosted on its own Netlify site. When a user submits something, the page calls a small server-side "Netlify Function" (a short script that runs on Netlify's servers, not in the browser). That function holds the Anthropic API key privately and calls Claude to generate a response. The two flagship tools (MII, OII) also write to Airtable and email a report via Resend; the three lighter companion tools do not — they just show a response on screen.

---

## 1. Meeting Intelligence Index (MII)

**What it is:** A diagnostic for measuring meeting culture, based on Nancy Kline's Thinking Environment framework. It scores meetings across four dimensions — Preparation & Structure, Participation & Listening, Quality of Thinking, and Decisions & Follow-Through. Built for leaders and teams who want a clear, evidenced picture of where their meetings are working and where they're quietly wasting thinking time.

**What the user provides:** Answers to a structured diagnostic (Likert-scale questions mapped to the four dimensions), plus name, email, organisation, and role.

**What happens on submit:**
1. Page sends the scores to a Netlify Function which calls **Claude Sonnet 4.6** (max 600 tokens) to write a bespoke narrative report in Mitzi's voice — careful, reflective language, not generic templated text
2. A second function emails the report (as an HTML attachment) to the respondent via **Resend**, and a copy to Mitzi
3. A third function writes the full response — scores, reflections, metadata — to **Airtable** (base `appAwcR1pHnjA1NHQ`, table `tblFV252lUBQ7aSK6`)

**Output:** A personalised HTML report, emailed to the respondent and copied to Mitzi. Contains the four dimension scores, a written narrative reflection specific to that respondent's pattern of answers, and two suggested next steps (a facilitated team conversation, or a one-to-one). Branded navy/gold, serif typography.

**Notable technical details:** Model `claude-sonnet-4-6`; env vars `ANTHROPIC_API_KEY`, `RESEND_API_KEY`, `AIRTABLE_API_KEY` (Netlify); no PDF generation — HTML attachment only; private GitHub repo `github.com/Mitziwyman/mii`.

---

## 2. Organisational Intelligence Index (OII)

**What it is:** A reflective diagnostic for senior NHS and public-sector leaders, measuring the *visibility* of six forms of value (financial resources, people and capability, relationships and trust, knowledge and expertise, community context, natural environment) at the point decisions get made. It does not measure performance or value creation — only whether leaders can *see* these forms of value when deciding. Part of the same Wyman Intelligence Index suite as MII; commercial model is individual report → facilitated team conversation.

**What the user provides:** 11 questions — Q1–10 scored on a Likert scale with free-text observations, Q11 a freeform reflection on a real decision (skippable). Plus name, email, organisation, role, sector, and optional research consent / facilitated-session interest. Links can carry a `cohort` URL parameter to track which group a respondent came from.

**What happens on submit:**
1. Page sends the Q11 reflection to a Netlify Function (`reflect.js`) which calls **Claude Sonnet 4.6** (max 600 tokens) to generate an AI reflection on that decision, mapping the respondent's answers to one of five descriptive (not evaluative) decision patterns — e.g. Compressed Horizon, Well-Managed Silo, The Eloquent Gap, Emerging Integrator, The Long View
2. A second function (`submit.js`) runs the Airtable write and the Resend email in parallel, fail-quiet: if either fails, the respondent still sees their report immediately — nothing blocks on the back end succeeding
3. Writes to **Airtable** base `appccB3cZnnnI0Djb`, table `tblqSsPJKxHPKSJP7`, workspace `wspcQ7lfIHOpHvGN3`

**Output:** An individual HTML report (`OII_Report.html`), emailed as an attachment, containing the Q1–10 score bars, the Q11 decision reflection plus Claude's AI reflection on it, and which of the five decision patterns the respondent's answers map to. Same navy/serif branding as MII. Respondents can also self-print to PDF via the browser (print CSS added 10 June 2026 to fix Firefox background-colour stripping and A4 sizing).

**Notable technical details:** Model `claude-sonnet-4-6`; env vars `ANTHROPIC_API_KEY`, `AIRTABLE_API_KEY`, `RESEND_API_KEY` (Netlify); an exposed API key was found and fixed 10 June 2026 (rotated in the Anthropic console, removed from client-side code); deployed via Netlify CLI/MCP, not drag-and-drop; private GitHub repo `github.com/Mitziwyman/oii`; custom domain `oii.mitziwyman.com` is parked but not yet activated.

---

## 3. MII Companion

**What it is:** A weekly meeting-readiness companion — a lighter, faster sibling to the full MII diagnostic, also built on Nancy Kline's Thinking Environment approach. Walks a leader through preparing for a meeting across three areas: personal presence, preparation, and how they'll lead in the room.

**What the user does:**
- Works through six reflective prompts (answers saved only in their own browser via localStorage — not sent anywhere unless they choose)
- Rates themselves on five "Meeting Readiness Check" statements (1–5 scale), e.g. "I have a clear question at heart," "I'm arriving with genuine attention"

**What happens on submit:** Page calls the `assess` Netlify Function with the five scores, which sends them to **Claude Sonnet 4.6** with a coach-like system prompt in Mitzi's voice, returning a short personalised response (~80 words) based on whether scores were low, mid, or high. Response is shown directly on the page — nothing is emailed or stored centrally.

**Output:** A short warm written reflection, displayed inline. No numeric score is shown to the user.

**Other:** There's a separate email signup on this page (MailerLite) — unrelated to the assessment itself.

---

## 4. 3 Horizons

**What it is:** A weekly review tool for strategic leaders, based on Bill Sharpe's Three Horizons framework (H1 = running today's business, H2 = managing transition, H3 = the emerging future). Helps someone notice where their attention actually went that week, and whether innovative thinking is quietly being pulled back into "business as usual."

**What the user does:**
- Reflects on three open prompts (optional, local-only)
- Rates five "Horizon Check" statements (1–5), e.g. "I can name where my best thinking went," "I protected time from the immediate"
- Occasionally (every 4th visit) gets a rotating bonus reflective prompt

**What happens on submit:** Page calls the `horizon` Netlify Function with the five scores, which sends them to **Claude Sonnet 4.6** (peer-to-peer voice this time), returning a two-part answer: a general insight, plus specific guidance focused on whichever horizon scored lowest (~110 words total).

**Output:** A two-part written reflection shown on the page. No numeric score, no email, nothing stored.

---

## 5. Sunday Reset

**What it is:** A short Sunday-evening ritual to close out the week and open into the next one — five questions, then an AI-generated reflection that mirrors back what's actually been said.

**What the user does, step by step:**
1. What's weighing on you
2. What's yours to act on
3. Where your attention keeps pulling
4. What a good week would look like
5. What's exciting you right now

After all five, the page shows the user's own answers back to them in cards, then generates a closing reflection.

**What happens on submit:** Page calls the `reflect` Netlify Function with all five answers, which calls **Claude Sonnet 4.6** — the most capable model of the three companion tools — with a system prompt instructing it to notice patterns across the five answers, focus on what's *opening up* rather than what's weighing the person down, use a warm peer voice, give no advice or affirmations, and close with "stillness, not an opening." Usage is logged (anonymised, via Netlify Blobs) for Mitzi's own cost tracking — the only one of the three companion tools that logs usage this way.

**Output:** A 3–4 sentence reflection, shown gold-on-navy, after the user's own five answers are displayed back to them. Nothing is emailed; nothing persists once the browser session ends.

---

## At a glance

| | MII | OII | MII Companion | 3 Horizons | Sunday Reset |
|---|---|---|---|---|---|
| Framework | Nancy Kline's Thinking Environment | Six forms of value visibility | Nancy Kline's Thinking Environment | Bill Sharpe's Three Horizons | Mitzi's own weekly reset ritual |
| Audience | Leaders/teams, general | Senior NHS/public-sector leaders | Leaders, weekly | Strategic leaders, weekly | Anyone, Sunday evening |
| Input | 4-dimension diagnostic + contact details | 11 questions (10 scored + 1 freeform) + contact details | 6 prompts + 5 ratings | 3 prompts + 5 ratings | 5 open questions |
| Model used | Claude Sonnet 4.6 | Claude Sonnet 4.6 | Claude Sonnet 4.6 | Claude Sonnet 4.6 | Claude Sonnet 4.6 |
| Writes to Airtable? | Yes (`appAwcR1pHnjA1NHQ`) | Yes (`appccB3cZnnnI0Djb`) | No | No | No |
| Emails a report? | Yes (Resend) | Yes (Resend) | No | No | No |
| Output | Personalised HTML report, 4 scores + narrative + next steps | Personalised HTML report, score bars + decision pattern + AI reflection | Short personalised text (~80 words) | Two-part text (~110 words) | 3–4 sentence reflection |
| Commercial model | Individual report → facilitated conversation/1:1 | Individual report → facilitated team conversation | Free-standing engagement tool | Free-standing engagement tool | Free-standing engagement tool |

**Note on cost/model choice:** All five tools now use Claude Sonnet 4.6. At this volume — short, occasional reflective responses rather than high-traffic API calls — the cost difference between Haiku and Sonnet is negligible, so all tools were moved to Sonnet for the deeper, more considered quality of writing it produces. The few extra seconds of response time read as the tool taking the reflection seriously, which fits the tone of these tools well.
