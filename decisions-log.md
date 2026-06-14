# Decisions Log — thinking-together / mitziwyman.com

A record of decisions made about the site's setup, not the day-to-day content. The why, not the code.

---

## 14 June 2026 — Domain redirect: thinking.mitziwyman.com → mitziwyman.com

### Context
Both `mitziwyman.com` and `thinking.mitziwyman.com` were configured as custom domains on the same Netlify site (`jocular-salmiakki-17943d`), both serving the live `thinking-together` site. Mitzi reported that `thinking.mitziwyman.com` appeared to be "serving its own version" of the site, with fonts and elements noticeably larger than on `mitziwyman.com`.

### Investigation
- Confirmed via Netlify API and direct HTTP checks that both domains were pointing to the same site and, at the time of checking, serving byte-identical HTML/CSS across all major pages (`/`, `/courses`, `/companion`, `/about`, `/you`).
- No hostname-based logic exists anywhere in the codebase (`index.html`, `nav.js`) that would vary font size or layout by domain.
- Conclusion: the visual size difference Mitzi saw was most likely a **stale cached copy** of an older deploy on `thinking.mitziwyman.com` (browser or CDN edge cache), left over from before that domain pointed at the current site. There was no live code-level cause for the sizing difference.
- However, there was a real underlying issue: no redirect rule existed to make `thinking.mitziwyman.com` canonical. With no redirect, Netlify happily serves the same site on both domains — duplicate content, no single canonical URL, and the door left open for exactly this kind of "two versions" confusion in future.

### Decision
`mitziwyman.com` is the canonical/public domain. `thinking.mitziwyman.com` should always 301-redirect to it, not serve its own copy.

### Change made
Added to `netlify.toml`:

```toml
[[redirects]]
  from = "https://thinking.mitziwyman.com/*"
  to = "https://mitziwyman.com/:splat"
  status = 301
  force = true
```

Committed as `6b66862` and deployed to production. Verified `thinking.mitziwyman.com` now returns `301 → https://mitziwyman.com/`.

### Note for future sessions
~~This Netlify site (`jocular-salmiakki-17943d`) deploys via direct API push, not an auto-build triggered by `git push` to GitHub. After pushing changes to `main`, a manual deploy trigger is needed for the live site to update.~~

**Update, same day:** GitHub → Netlify auto-deploy was set up on 14 June 2026. Confirmed working — the push of commit `85a2db9` ("Add decisions log") triggered an automatic production deploy on `mitziwyman.com` within seconds, with no manual deploy step. From now on, `git push` to `main` is sufficient to go live.
