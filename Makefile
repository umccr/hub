.PHONY: *

# Dev server port (Vite). Override when 3001 is in use, e.g. `make start PORT=3000` or `make start-3000`.
PORT ?= 3001
export PORT

# Deploy target. Contains an AWS account ID, so it is not committed: set it in your
# shell or CI, e.g. `make deploy-dev DEPLOY_BUCKET=orcaui-v2-cloudfront-<account-id>`.
DEPLOY_BUCKET ?=
DEPLOY_PREFIX ?= v2/
DEPLOY_ENV_LAMBDA ?= CodeBuildEnvConfigLambdaBeta

start: 
	@pnpm run start

# Convenience: `make start-3001` is equivalent to `make start PORT=3001` (delegates to `start`, so OpenAPI runs once)
start-%:
	@$(MAKE) start PORT=$*

deploy-dev:
	@test -n "$(DEPLOY_BUCKET)" || { \
	  echo "DEPLOY_BUCKET is not set. e.g. make deploy-dev DEPLOY_BUCKET=orcaui-v2-cloudfront-<account-id>"; \
	  exit 1; \
	}
	@pnpm build
	@aws s3 cp ./build s3://$(DEPLOY_BUCKET)/$(DEPLOY_PREFIX) --recursive
	@aws lambda invoke \
    --function-name $(DEPLOY_ENV_LAMBDA) \
    response.json

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
