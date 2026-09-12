# Deploy

Static site. No build step. GitHub Pages serves `main` at the repo root.

## Current state

- **Live:** https://0xfrankma.github.io/robix/
- **Target domain:** `robix.one` — *not yet registered* (verified available via RDAP).

Push to `main` redeploys. No CI, no build.

## Buying robix.one

Cloudflare Registrar does not carry `.one`, so use one of:

| Registrar | Notes |
|---|---|
| Porkbun | Low renewal, free WHOIS privacy. Good default. |
| Spaceship | Cheapest first year, check the renewal rate. |
| Namecheap | Promo first year, higher renewal. |
| Dynadot | Bundles email hosting if you want `hello@robix.one` in one place. |

Check the **renewal** price, not just year one.

## DNS cutover (after purchase)

Two steps, both required.

### 1. At the registrar — point DNS at GitHub

Apex `robix.one`, four A records:

    185.199.108.153
    185.199.109.153
    185.199.110.153
    185.199.111.153

And a CNAME for `www`:

    www  ->  0xfrankma.github.io

(If you prefer AAAA/IPv6 too: 2606:50c0:8000::153, ...8001::153, ...8002::153, ...8003::153)

### 2. In this repo — claim the domain

    echo "robix.one" > CNAME
    git add CNAME && git commit -m "Point Pages at robix.one" && git push

Then in repo Settings -> Pages, set the custom domain to `robix.one` and tick
**Enforce HTTPS** once the certificate provisions (can take up to ~15 min after
DNS propagates).

**Do not commit `CNAME` before the domain resolves.** GitHub Pages redirects the
`github.io` URL to the custom domain as soon as it sees that file, so committing
early takes the live site down until DNS is working.

## Before sharing the link publicly

- [ ] `assets/data.js` -> `CONFIG.ENDPOINT` is still `PASTE_YOUR_ENDPOINT_HERE`.
      Until it's set, both wizards fall back to a `mailto:` to `hello@robix.one`.
- [ ] `hello@robix.one` mailbox exists (needs the domain first).
- [ ] Prices in `SERVICES` and specs in `PLATFORMS` are current.
