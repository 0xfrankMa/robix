# Robix — site v3

Real-world robot learning data collection, for buyers in Japan. Japanese by default with
a one-click English switch. The old Bay Area repair site lives on as a sub-site, linked
from the footer. No build step, no dependencies. Drag the folder onto any static host.

Design: `docs/superpowers/specs/2026-09-25-robix-data-collection-japan-design.md`

```
index.html       Home — hero, partner wall, in-the-wild gallery, methods, phases, pledges
service.html     Capture kits, scenes, deliverables, QC, process
facility.html    Facilities we run + the Japan site (in preparation) + early partners
security.html    The six data-handling commitments
company.html     Company facts and team
privacy.html     Contact-form privacy policy (discloses Formspree / US)
contact.html     Inquiry — 3-step wizard (form_type=data_inquiry, records lang)

repair.html      ┐
platforms.html   │
repairs.html     │ Robix Repair sub-site — English only, unchanged apart from
bench.html       │ its brand link and a "← Robix data collection" footer link
quote.html       │
join.html        ┘

assets/
  i18n.js        English strings for the bilingual pages (Japanese is in the HTML)
  data.js        LOGOS + SCENES + GALLERY for the main site; repair data below
  app.js         i18n, renderers, wizard, theme, nav
  styles.css     design system
  img/, video/   processed media — generate with tools/prep-media.py
tools/
  check-i18n.js  node tools/check-i18n.js — fails if any key lacks English
  prep-media.py  crops/blurs signage, compresses photos, cuts the teleop clip
```

## Editing copy

- **Japanese**: edit the text in the HTML directly.
- **English**: edit `assets/i18n.js` under the same `data-i18n` key. Run
  `node tools/check-i18n.js` after adding any new `data-i18n` attribute.
- `?lang=en` on any URL opens the English version — use it in English emails.

## Rules for this site (from the design)

- Never say or imply we already have a site in Japan. Photo captions name the scene
  type, never the place.
- Data-handling commitments are exactly the six on `security.html`. Nothing else
  (no ISO 27001) until it's true.
- Partner names: only real, confirmed collaborations. Universities stay as text.
  To swap a company name for its logo, add `img:"assets/logos/<name>.svg"` in `LOGOS`
  — ideally a file the company sent you, which doubles as permission.
- New photos go through `tools/prep-media.py` and get checked by eye for readable
  signage before they ship.

## Waiting on

- Japan contact (name, title, email) — slot is commented out in `company.html`
- Japan site timeline — `facility.html` says details will follow
- Contracting entity / company facts for `company.html`
- Japanese copy review by a native speaker before sharing the link

---

# Robix Repair sub-site (v2 notes)


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
      `repair.html`, `repairs.html`, `quote.html`). High enough to filter tyre-kickers, low
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
