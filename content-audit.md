# Content audit — live site vs. new homepage draft

*22 August 2026. Comparison only — no copy rewritten, no code changed.*

Live site checked: main-home.html (homepage), organisations.html, suite.html,
courses.html, you.html, about.html — confirmed identical between the live `main`
branch and this working branch, except `you.html` (see note below).

| Content / idea | Current site | New draft | Keep/Move/Rewrite/New | Comments |
|---|---|---|---|---|
| **Hero headline & positioning** | "Better thinking changes everything." + full Nancy Kline quote in a box (`main-home.html`) | "Leadership. Thinking. Technology." + video, no quote | Rewrite (direction already agreed) | Current headline is soft/generic; new direction is deliberate. But the full Nancy Kline quote loses its most prominent placement — draft only carries a different, truncated Kline line further down the page. |
| **Three "doors" — Courses / MII / Organisations cards** | `main-home.html`: sharp, specific headlines — e.g. *"Are you spending or investing your time in meetings?"* | "What I offer" — three cards, flatter, more generic copy | Move | The existing card headlines are punchier than the new draft's. Worth reusing rather than writing fresh. |
| **Meeting Intelligence Index — full description** | `suite.html` has a considered, complete description | One thin sentence in an offer-card | Keep (don't rewrite) | Clearest case of strong existing IP not yet reflected in the new draft. |
| **Organisational Intelligence Index — full description** | `suite.html` only | Not named at all | Keep (don't rewrite) | OII isn't even mentioned by name on the new draft currently. |
| **Thinking Environment Companion / Horizons Companion — descriptions** | `suite.html`, plus the tools themselves are live (`companion.html`, `horizons.html`) | Not mentioned | Keep (don't rewrite) | Real, working tools with existing descriptions, currently invisible on the new homepage. |
| **"Working with Organisations" — how it works** | `organisations.html`: facilitation photo, a second video ("What happens when leaders stop listening"), the frameworks (Thinking Environment / Three Horizons / Six Capitals), and the line *"the quality of thinking behind decisions matters as much as the decisions themselves"* (used twice) | One short generic sentence in a card | Move | Probably the single strongest, most distinctive block of existing copy in the whole project, and currently absent from the new draft entirely. |
| **About / Mitzi — bio and credentials** | No live About page (`about.html` is a stub that redirects home). No bio or credentials block published anywhere. A first-person paragraph + credentials line ("Time to Think Faculty, trained in organisational psychiatry and psychology, facilitator with Windsor Leadership") was drafted in `homepage-rebuild-brief.md` on 21 June but never actually published. | Same gap — `/about` also loops back to the homepage | New (but a draft already exists, unused) | Not "lost" — it was never live. Worth knowing the raw material already exists rather than starting from nothing. |
| **"For You" personalised reflection copy** | Live `you.html` uses a generic fail-quiet fallback message | This working branch has a *different, unmerged* version of `you.html` with three richer, personalised reflections that explicitly reference MII and the Thinking Environment | Keep (once merged) | Not part of the homepage draft itself, but worth knowing it exists — already speaks in the new direction's language, just not live yet. |
| **Fresh Thinking** | Not present anywhere on the live homepage | Present as an external link to `thinking.mitziwyman.com`, which may currently loop back to the homepage rather than showing anything | New | Not a "lost" item — this is a new intention that isn't functioning yet, not a regression. |
| **Testimonials (18 confirmed)** | 6 of 18 are live, all on `courses.html` only: Nancy Kline, Kay Wren, Professor Deborah Christie, Fleur McDonnell, Janet Thornley, Gillian Fawcett | 1 of 18 appears: Nancy Kline, in a different truncated form than the `courses.html` version | Move (wording untouched) | 12 of 18 aren't published anywhere on the site yet: Ryder, Buggins, Bleasby, Karmel, Jamohed, Wright, Doran, Clarke, Glanville, Lyne, MaCapra, Goldie. This is a placement decision, not a writing task. |
| **Organisation / client names** | Not displayed as a list anywhere — names only appear incidentally inside testimonial attributions on `courses.html` | Not displayed | New (names already known, just not placed) | Confirmed list: Arup, Skanska, Health Innovation Network, Sony Pictures, UCLH, Princess Alexandra NHS Trust, NHS NLFT, Mazars, KPMG. |
| **Fulcrum essay & related ideas** | Not on the live site | Not on the new draft | *(Not a section — per your instruction)* | The essay's core idea — attention as investment, generative listening — already overlaps naturally with `organisations.html`'s existing "quality of thinking behind decisions" language. Flagged as available continuity, not a new section. |
| **Images & video** | `organisations.html` uses a second, distinct video ("What happens when leaders stop listening") and `mitzi-facilitation.jpg`, neither used in the new draft | Uses only the "I work at the intersection" video + one lectern photo | Keep/decide | The second video is a real, existing asset not yet considered for the new homepage — worth a conscious decision either way. |

---

## The 5–10 most important content decisions

1. Does *"the quality of thinking behind decisions matters as much as the decisions themselves"* — the strongest distinctive line on the live site — come back into the new homepage, and where?
2. Do the existing sharper card headlines (e.g. *"Are you spending or investing your time in meetings?"*) replace the new draft's flatter offer-card copy, or does that get written fresh?
3. Does `suite.html`'s MII/OII/Companion copy move wholesale into the new Technology page, or get adapted?
4. Does `organisations.html`'s richer content (frameworks, second video, closing statement) fold into the new homepage, stay as its own page, or both?
5. Is now the moment to finally publish a real About/Mitzi page — the draft paragraph and credentials line already exist, just never went live?
6. Beyond the homepage placement question already flagged, where do the 12 unused testimonials go — inner pages, a dedicated page, or nowhere yet?
7. Does the second existing video on `organisations.html` have a place in the new homepage structure?
8. Should the richer, MII-referencing "For You" copy already sitting unmerged on this branch be treated as part of this redesign pass, or handled separately?
9. How does Fresh Thinking actually get built as a real destination, given it doesn't exist anywhere yet — live or draft — beyond an external link?
10. Does the Fulcrum "attention is the currency" language get woven into the territory/philosophy copy already under discussion, given how naturally it overlaps with what `organisations.html` already says?

No code changed. No copy rewritten.
