# Deploy

Static site. No build step. GitHub Pages serves `main` at the repo root.

## Current state

- **Live:** https://robix.one (HTTPS enforced, Let's Encrypt, auto-renews)
- `www.robix.one` and the old `0xfrankma.github.io/robix/` both 301 to the apex.
- Registrar: Porkbun. Registered 2026-09-12, **expires 2027-09-12** -- keep auto-renew on.
- DNS: four A records at the apex + `www` CNAME -> `0xfrankma.github.io`.

Push to `main` redeploys. No CI, no build. A push takes ~1-2 min to go live.

## Buying robix.one

Cloudflare Registrar does not carry `.one`, so use one of:

| Registrar | Notes |
|---|---|
| Porkbun | Low renewal, free WHOIS privacy. Good default. |
| Spaceship | Cheapest first year, check the renewal rate. |
| Namecheap | Promo first year, higher renewal. |
| Dynadot | Bundles email hosting if you want `hello@robix.one` in one place. |

Check the **renewal** price, not just year one.

## DNS cutover -- DONE

Kept for reference. Records currently live at Porkbun:

    A      @      185.199.108.153
    A      @      185.199.109.153
    A      @      185.199.110.153
    A      @      185.199.111.153
    CNAME  www    0xfrankma.github.io

The repo's `CNAME` file contains `robix.one`; that is what binds Pages to the
domain. Deleting it would revert the site to the github.io URL.

## Before sharing the link publicly

- [x] `CONFIG.ENDPOINT` wired to Formspree (`f/xkjnlwyg`). Both wizards POST JSON
      and were verified end to end against the live site on 2026-09-12.
- [ ] **Delete the 3 test submissions** in the Formspree inbox (1 connectivity
      check, 1 work order, 1 bench application -- all marked "TEST").
- [ ] `hello@robix.one` mailbox exists. Only used as the failure fallback now,
      but the error message tells people to email it, so it must work.
- [ ] Formspree free tier caps at 50 submissions/month. Watch it, or upgrade
      before running any campaign.
- [ ] Prices in `SERVICES` and specs in `PLATFORMS` are current.
