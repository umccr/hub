# UMCCR HUB

The entry point for UMCCR's internal software: one catalogue of the **apps,
tools, projects and organisation sites** used across the
[University of Melbourne Centre for Cancer Research](https://umccr.org/about/),
plus a short overview of the organisation itself.

Surfaces:

- **Overview** (`/`) — the whole catalogue, searchable and filterable, grouped by
  what each thing is: an app you work in, a tool or library, a repository, docs,
  an API reference, or an organisation site.
- **Sections** (`/orcabus`, `/orcahouse`) — the same browser narrowed to one
  platform.
- **About us** (`/about`) — who UMCCR is, the
  [Collaborative Centre for Genomic Cancer Medicine](https://genomic-cancer-medicine.unimelb.edu.au/)
  it works within, and links out to the public sites.

## Adding something to the Hub

Add an entry to `src/features/hub/data/catalog.ts`. There is no other
registration step — the Hub groups it by `kind` and it appears.

- `section` — `'orcabus'` or `'orcahouse'` puts it on that platform's page too.
  Leave it unset for anything that belongs to neither; it still shows on the
  Overview.
- `local: true` — flags anything that only resolves on a developer machine.
- **Environment placeholders in `url`** are resolved against the environment the
  Hub is running in, so a link never sends you to the wrong deployment:
  - `{env}` → `dev` / `stg` / `prod`, for `service.{env}.umccr.org` hosts
  - `{portal}` → the portal hostname, which is `portal.umccr.org` in prod rather
    than `portal.prod.umccr.org`

  Running locally targets `dev`. A URL with neither placeholder is used as
  written. The dev/stg/prod tag on a tile is read back off the resolved
  hostname, so it cannot disagree with the link.

Adding a new platform section means one entry in `CATALOG_SECTIONS`: the route
and the sidebar link are both derived from it.

Organisation copy and outbound links live in
`src/features/hub/data/organisation.ts`, and should stay verifiable against the
public pages it cites.

## Setup

### Requirements

```sh
node --version
v22.15.0

# Update corepack if necessary (from pnpm docs)
npm install --global corepack@latest

# Enable corepack
corepack enable pnpm
```

### Install Dependencies

To install all required dependencies, run:

```sh
make install
```

Start Front-end Development Server

```sh
make start          # http://localhost:3000/hub/
make start PORT=3001   # if 3000 is taken
```

`make start` sources `start.sh`, which pulls Cognito config from AWS SSM — you
need an active AWS session (`aws sso login --profile dev && export AWS_PROFILE=dev`).

### Base path

The app is served under `/hub/`, not at the domain root —
`https://portal.umccr.org/hub/` deployed, `http://localhost:3000/hub/` in dev.
It is set once as Vite's `base` in `vite.config.ts`; the router reads it back
through `import.meta.env.BASE_URL`, so there is no second copy to keep in step.

Two things follow from sharing a domain with the other portal apps:

- **Reference `public/` assets through `BASE_URL`,** not with a leading slash. Vite rewrites URLs in
  `index.html` but not string literals in TSX, and `/assets/x.png` resolves to the portal root, which
  is a different app's bucket.
- **The OAuth redirect is derived, not configured.** `src/app/config.ts` builds it from the current
  origin plus `BASE_URL`, so sign-in returns here rather than to the portal home page, in every
  environment. That exact URL must be registered on the Cognito app client; the `cognito_aai`
  Terraform stack generates it from its `portal_app_paths` list. **Apply that stack before changing
  the base path**, or the hosted UI rejects sign-in with `redirect_mismatch`.

### Checks

```sh
make check   # lint, format, audit, pre-commit hooks
make test    # vitest
```

### Deploy

Deployment is owned by
[umccr/frontend-infrastructure-pipelines](https://github.com/umccr/frontend-infrastructure-pipelines),
not by this repository. A push to `main` runs `HubAppCICDPipeline`, which runs `pnpm build`, syncs
`build/` to `s3://hub-cloudfront-<account>/hub/` and invokes the portal's config Lambda to write
`env.js`. Dev deploys automatically; prod is behind a manual approval.

There is deliberately no `make deploy` target: a hand-rolled upload would not prune the previous
build, would not set the `Cache-Control` headers that keep an open session working through a deploy,
and would rewrite every portal app's `env.js` instead of only this one's.

Runtime configuration comes from `env.js`, written per environment by that Lambda, so one build is
promoted from dev to prod unchanged. `public/env.js` is a local-development placeholder and is
excluded from the upload.
