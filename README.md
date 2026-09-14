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
make start
```

`make start` sources `start.sh`, which pulls Cognito config from AWS SSM — you
need an active AWS session (`aws sso login --profile dev && export AWS_PROFILE=dev`).

### Checks

```sh
make check   # lint, format, audit, pre-commit hooks
make test    # vitest
```

### Deploy

`make deploy-dev` needs the target bucket, which is not committed:

```sh
make deploy-dev DEPLOY_BUCKET=orcaui-v2-cloudfront-<account-id>
```
