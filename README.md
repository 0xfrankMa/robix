# Robix — site v2

Managed marketplace for humanoid robot repair, SF Bay Area. Six pages, no build step,
no dependencies. Drag the folder onto any static host.

```
index.html       Home — hero, finder, featured platforms, coverage
platforms.html   All 8 platforms + 4 component classes, with schematics & specs
repairs.html     Filterable repair catalog, 14 services
bench.html       Coverage board + capability groups + who we recruit
quote.html       Work order — 4-step wizard
join.html        Bench roster — 3-step wizard
assets/
  data.js        ← the only file you edit day to day
  app.js         renderers, wizard, theme, nav
  styles.css     design system
```

---

## Go live

1. **Wire the forms.** `assets/data.js` -> `CONFIG.ENDPOINT`. Formspree is fastest
   (formspree.io -> new form -> paste the endpoint). Or any webhook that accepts a JSON POST.
   Left unset, forms open a pre-filled email to `CONFIG.FALLBACK_EMAIL`
   (`hello@robix.one`) -- **that mailbox must exist before you share the link.**
2. **Deploy.** Live on GitHub Pages from `main`. Push to `main` redeploys.
3. **Domain.** `robix.one` -- see `DEPLOY.md` for the DNS cutover.

---

## Everything you edit lives in `assets/data.js`

| Block | Drives | Edit when |
|---|---|---|
| `CONFIG` | Form endpoint, fallback email, diagnosis fee | Once, at setup |
| `SPRITE` | The schematic line drawings | Only to redraw art |
| `PLATFORMS` | Platform cards, specs, failure modes | New platform, corrected spec |
| `SERVICES` | Repair catalog + filters | Prices change, new repair type |
| `ZONES` | Coverage board | Engineer lands in a new zone → `live:true` |
| `BENCH` | Capability cards | A group fills → `live:true` |

### Swapping schematics for photos

The figures are original line drawings, one per platform class — joints as orange dots.
No manufacturer imagery, so no licensing question.

To use real photos: drop files in `assets/img/` and add `photo:"assets/img/g1.jpg"` to a
platform in `PLATFORMS`. That card renders the photo and ignores the schematic. Only use
images you have the right to publish — a scraped product shot is a takedown waiting to happen.

### Two rules about the data

**Never invent a spec.** Every number in `PLATFORMS` is manufacturer-published or `—`.
A lab engineer will check the DOF count against the datasheet.

**Never invent people.** The bench shows *capability groups* with Active / Recruiting
status, not profiles with names and ratings. Flip `live:true` only when someone real is on
the roster. Recruiting is the honest state and it doubles as engineer recruitment.

---

## Why the forms are wizards

The work order collects ~30 fields — that's the Bay Area fleet census, and it's the reason
to build this before it's a real business. Shown at once it reads as a wall. Split across
four screens with a progress bar it reads as four questions. Contact details come **last**
on purpose: someone who has described their broken robot across three screens finishes.

Fields that look excessive but aren't:

- `platform` + `end_effectors` → whether this unit costs ~$3,600/yr or ~$9,200/yr to service
- `acquired` + `usage_hours` → fleet age, and eventually time-to-failure by subsystem
- `symptoms` → seeds the failure taxonomy; ~30 coded jobs makes it the only humanoid
  failure dataset in North America
- `disposition` → whether your pitch is "we can fix it" or "we're fast"
- `budget_band` → live price elasticity, three points, no guessing
- `approver` + `procurement` → the most common reason a warm lead quietly dies

Drafts autosave to `localStorage` and restore on return, so a closed tab doesn't cost a lead.

---

## Before you send this to a real lab

- [ ] Set `FALLBACK_EMAIL` — it's a placeholder domain
- [ ] Wire `ENDPOINT`, submit both forms end to end
- [ ] Buy the domain
- [ ] Confirm **$450** is the diagnosis fee you want (`CONFIG.DIAG_FEE`, and the copy in
      `index.html`, `repairs.html`, `quote.html`). High enough to filter tyre-kickers, low
      enough to skip approval at most labs — but it's my guess, not your decision.
- [ ] Sanity-check every `from` price in `SERVICES` against what you'd actually quote
- [ ] Add a privacy page — the consent checkbox already asks to keep fault data
- [ ] Leave the footer disclaimer alone. You aren't authorised by Unitree, and saying so
      plainly is what keeps this clean.

## Deliberately not built

- **Engineer logins, bidding, ratings.** At 100–250 jobs/year each engineer sees 7–16 jobs
  — not enough to sustain a profile. You dispatch by phone. The two-sidedness stays
  internal; the site only makes supply *visible*.
- **Payments, scheduling, customer portal.** Email and a written quote handle the first 50 jobs.
- **Anything multi-city.** The whole thesis is Bay Area density.
