.PHONY: *

# Dev server port (Vite). The app serves at http://localhost:$(PORT)/hub/.
# Override when 3000 is in use, e.g. `make start PORT=3001` or `make start-3001`.
PORT ?= 3000
export PORT

# Deployment is owned by umccr/frontend-infrastructure-pipelines: a push to main runs
# HubAppCICDPipeline, which builds and deploys to dev, then prod behind a manual approval.
# There is deliberately no deploy target here. A hand-rolled `aws s3 cp` would differ from the
# pipeline in ways that are easy to miss and hard to debug: it would not prune the previous build,
# would not set the Cache-Control headers that stop a deploy breaking an open session, and would
# rewrite every portal app's env.js rather than only this app's.

start: 
	@pnpm run start

# Convenience: `make start-3001` is equivalent to `make start PORT=3001` (delegates to `start`, so OpenAPI runs once)
start-%:
	@$(MAKE) start PORT=$*

storybook:
	@pnpm run storybook

install:
	@pnpm install
	@pre-commit install

lint:
	@pnpm lint

lint-fix:
	@pnpm lint:fix

format:
	@pnpm format

format-check:
	@pnpm format:check

check: lint format-check
	@pnpm audit
	@if command -v pre-commit >/dev/null 2>&1; then pre-commit run --all-files; else echo "pre-commit not installed; skipping pre-commit hooks"; fi

test:
	@pnpm test

fix: lint-fix format

audit-fix:
	@pnpm audit --fix=override
