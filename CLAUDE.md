# What Mitzi is building with Claude — the whole picture

*A context file, written in plain English, so any part of Claude picking up my work
can understand the full landscape: the big diagnostic tools, the lighter thinking
tools, the ideas still forming, and the back-office "four rooms" I want to automate.
Last updated 1 July 2026.*

---

## Who I am (short version)

Mitzi Wyman — independent leadership consultant, Wyman Associates Ltd. Not a
developer. I use Claude to build and maintain web tools and, increasingly, to run the
business behind them. Always explain things in plain English, avoid jargon, and don't
ask for the same permission twice. My careful, hedged, reflective voice matters in
everything client-facing — never blunt.

**How to talk about my tools collectively:** the **Wyman Intelligence Index (WII)** is
the family. Inside it sit the two flagship diagnostics, **MII** and **OII**.

---

## How everything is built (the shared pattern)

Every tool follows the same shape, so once you understand one you understand them all:

- A single web page (one HTML file) that the person sees in their browser.
- **Netlify** hosts each site and redeploys automatically whenever code is pushed to GitHub.
- Small server-side scripts ("Netlify Functions") do anything private — calling the
  Anthropic API to generate a reflection, sending an email, writing to Airtable. The
  API key lives in Netlify's environment variables, never in the code.
- **Airtable** stores responses (only the two flagship tools do this).
- **Resend** sends the report emails (again, only the two flagship tools).
- All tools currently use **Claude Sonnet 4.6** — at my low volume the cost difference
  is negligible, and Sonnet's writing is warmer and more considered, which suits the tone.

---

# PART ONE — The tools that exist and are live

## The two flagship diagnostics

### 1. Meeting Intelligence Index (MII)
- **What it is:** a diagnostic for meeting culture, based on Nancy Kline's Thinking
  Environment approach. Scores meetings across four dimensions — Preparation &
  Structure, Participation & Listening, Quality of Thinking, and Decisions &
  Follow-Through.
- **Who it's for:** leaders and teams who want an evidenced picture of where their
  meetings work and where thinking time is quietly wasted.
- **What happens:** the person answers a scored diagnostic; Claude writes a bespoke
  narrative report in my voice; the report is emailed to them (and copied to me) and
  saved to Airtable.
- **Commercial model:** individual report → facilitated team conversation or 1:1.
- **Lives at:** `~/Sites/mii` · meetings-culture.netlify.app · github.com/Mitziwyman/mii
- Airtable base `appAwcR1pHnjA1NHQ`.

### 2. Organisational Intelligence Index (OII)
- **What it is:** a reflective diagnostic for senior NHS and public-sector leaders. It
  measures the *visibility* of six forms of value (financial resources; people and
  capability; relationships and trust; knowledge and expertise; community context;
  natural environment) **at the point decisions are made**. Crucially, it does *not*
  measure performance or value creation — only whether leaders can *see* these forms of
  value when they decide.
- **What happens:** 11 questions (10 scored with free-text, 1 open reflection on a real
  decision). Claude reflects on that decision and maps the answers to one of five
  descriptive (never judgemental) patterns — e.g. Compressed Horizon, Well-Managed Silo,
  The Eloquent Gap, Emerging Integrator, The Long View. The report is emailed and saved
  to Airtable, fail-quiet (if the back end hiccups the person still sees their report).
- **Commercial model:** individual report → facilitated team conversation.
- **Lives at:** `~/Sites/oii` · organisational-intelligence-index.netlify.app ·
  github.com/Mitziwyman/oii · custom domain `oii.mitziwyman.com` parked, not yet live.
- Airtable base `appccB3cZnnnI0Djb`.

## The Ratio Suite

### 3. The Ratio Suite
- **What it is:** five short "leadership ratio" tools, built into the Thinking Together
  website. Each one takes a genuine tension a leader feels and helps them *see* it more
  clearly by scoring two things separately — it doesn't resolve the tension, it makes it
  visible without making it personal.
- **The five ratios:** Care : Consequence · Closeness : Consequence ·
  Intervention : Ownership · Values : Impact · Uniqueness : Accessibility.
- **What happens:** the person scores each side; Claude gives a short reflection in my
  voice. Nothing is emailed or stored — the response just appears on the page.
- **Lives at:** the Thinking Together site (`ratio-suite.html`). Reference document in
  `reference/Ratio_Suite_Reference_1.docx`.

## The three companion tools (lighter, weekly, nothing stored)

These live on the Thinking Together website. They show a reflection on screen — no
email, no Airtable (Sunday Reset logs anonymised usage only, for my cost tracking).

### 4. MII Companion
A weekly meeting-readiness companion — a faster sibling to the full MII. Walks a leader
through six reflective prompts (saved only in their own browser) plus five
"readiness" ratings, then Claude returns a short, warm, coach-like reflection (~80 words).

### 5. 3 Horizons
A weekly review tool based on Bill Sharpe's Three Horizons (H1 running today's business,
H2 managing transition, H3 the emerging future). Helps someone notice where their
attention actually went, and whether new thinking is being pulled back into
business-as-usual. Five ratings → a two-part reflection focused on the lowest horizon.

### 6. Sunday Reset
A Sunday-evening ritual: five open questions (what's weighing on you, what's yours to
act on, where attention keeps pulling, what a good week looks like, what's exciting
you). Claude mirrors back what's *opening up* rather than what's weighing you down —
warm, no advice, closing with "stillness, not an opening."

---

# PART TWO — Ideas still forming (not built yet)

### The LII (Leadership Intelligence Index) — an idea, not a tool yet
A third diagnostic I've been thinking about to sit alongside MII and OII in the WII
family. It doesn't exist in any code or file yet — there's no page, no repo, no
Airtable base. If anyone picks this up, treat it as a concept under discussion, not
something to maintain. When it firms up, it would follow the same shared pattern as the
others.

### The case-study flywheel — a new weekly routine I want to start
Each week: interpret a report for a *hypothetical* organisation → surface "what's on
people's minds" → use those insights to (a) improve MII/OII/the companion tools and
(b) become user-story narratives for marketing and teaching. It's a flywheel: cases →
real-need insight → tool improvements → stories → audience → more input → more cases.
**Integrity flag:** these must always be framed as **composite / illustrative, grounded
in real patterns** — never "based on real data," which could mislead clients. This is
separate from the daily health check.

---

# PART THREE — The back office: the "four rooms" (last night's conversation)

Everything above is client-facing *thinking* tools. What I want to open up next is the
**back-office and workflow layer** I haven't touched — using Claude to run the business,
not just build tools. I mapped this as **four rooms** (saved in `claude-automation-map.html`).
The goal isn't a tidy bureaucratic back office — it's a system that **sends as well as
receives, manages the money, and gives me one overview where I feel on top of it all —
"like having a whole team."** Always human-in-the-loop: draft-and-approve, never
autonomous movement of money.

### Room 1 · Back office — *money & admin handled (FreeAgent, Outlook)*
A monthly money summary in plain English (invoiced / owed to me / due to the taxman);
spotting overdue invoices and drafting courteous reminders in my voice; logging an
expense by forwarding a receipt. **Highest relief for least effort — already connected.**
This is where to start: one small thing first (likely the monthly money summary), see how
it feels, then build.

### Room 2 · Daily drumbeat — *briefings & inbox triage*
A morning briefing waiting when I sit down: today's calendar, the three emails that
actually need me, what I said I'd do. Pulls from my calendar and **Outlook** (my work
email is Outlook/Microsoft 365, not Gmail). An end-of-week wind-down mirrors it.

### Room 3 · Client delivery — *reports & proposals, faster (Airtable, MII, OII)*
The tools are polished; the behind-the-scenes isn't. Team reports are still hand-built
from Airtable. I want Claude to pull the raw responses and give me a first draft in my
careful voice, which I then shape. Removes the assembly, not the judgement.

### Room 4 · Business development — *prospects & follow-ups, nothing slips*
Pricing and proposals currently live in scattered chats. One BD project plus a gentle
weekly nudge — "these three prospects have gone quiet, want to follow up?" — turns
memory-and-luck into a system.

**The glue that makes the rooms run on their own:** a **Routine** runs any of these on a
schedule · a **Project** keeps each strand's history in one place · **Memory** means once
I've said how I like something, Claude doesn't ask again.

---

# PART FOUR — The July plan around all this

Through about 2 July 2026 I'm focused on client work. After that I want to "drill down"
and streamline. Two themes:

**Theme A — be clear about the tools.** Every tool (MII, OII, Ratio Suite, companions)
clearly described and easy to explain to anyone interested. A modern **SOP for each
tool**, plus a **fallback that still works if Claude is ever down** — the documentation
must be **human-runnable, not Claude-dependent**, so I'm never stranded if the assistant
is offline. Builds on `tools-summary-for-chatgpt.md` and the review printouts in this folder.

**Theme B — streamline the four processes:** (1) back office, (2) business development
including marketing and posting, (3) finances, (4) management of courses (a newer strand
— I run leadership courses). These overlap the four rooms: back office + finances ≈ Room
1, BD/marketing/posting ≈ Room 4. Courses is a new strand not yet on the map.

---

## Where things live (quick reference)

| Tool | Local folder | Live site | GitHub |
|---|---|---|---|
| MII | `~/Sites/mii` | meetings-culture.netlify.app | Mitziwyman/mii |
| OII | `~/Sites/oii` | organisational-intelligence-index.netlify.app | Mitziwyman/oii |
| Ratio Suite + 3 companions | `~/thinking-together` | mitziwyman.com | Mitziwyman/thinking-together |
| Working Surface (dashboard) | `~/working-surface` | working-surface.netlify.app | Mitziwyman/working-surface |

Each project folder has its own CLAUDE.md with full detail — read that first when working
on a specific tool. The daily health check (8am) tests MII / OII / Companion / Sunday
Reset / Horizons and stays silent unless something breaks.
