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

- [ ] `assets/data.js` -> `CONFIG.ENDPOINT` is still `PASTE_YOUR_ENDPOINT_HERE`.
      Until it's set, both wizards fall back to a `mailto:` to `hello@robix.one`.
- [ ] `hello@robix.one` mailbox exists (needs the domain first).
- [ ] Prices in `SERVICES` and specs in `PLATFORMS` are current.
