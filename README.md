# UMCCR HUB

The entry point for UMCCR's internal software: one catalogue of the **apps,
tools, projects and organisation sites** used across the
[University of Melbourne Centre for Cancer Research](https://umccr.org/about/),
plus a short overview of the organisation itself.

Two surfaces:

- **Hub** (`/`) — searchable, filterable catalogue of everything staff can open,
  grouped by what it is: an app you work in, a tool you run once, a project's
  code or docs, or an organisation site.
- **Organisation** (`/about`) — who UMCCR is, the
  [Collaborative Centre for Genomic Cancer Medicine](https://genomic-cancer-medicine.unimelb.edu.au/)
  it works within, and links out to the public sites.

## Adding something to the Hub

Add an entry to `src/features/hub/data/catalog.ts`. There is no other
registration step — the Hub groups it by `kind` and it appears. Set
`local: true` for anything that only resolves on a developer machine so the UI
can flag it.

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
