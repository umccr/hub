// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

/**
 * `src/utils/env.ts` resolves its value once at module load, so each case re-imports it with a fresh
 * module registry after setting up `window.config`.
 *
 * These merge semantics are what let the portal build this app once and promote the same artifact
 * from dev to prod: build-time values are only ever a fallback, and a partially populated `env.js`
 * must not drag unrelated keys back to whatever the build inlined.
 */
async function loadEnv(config?: Record<string, string | undefined>) {
  vi.resetModules();
  if (config === undefined) {
    delete (window as { config?: unknown }).config;
  } else {
    window.config = config;
  }
  return import('../env');
}

let originalConfig: unknown;

beforeEach(() => {
  originalConfig = (window as { config?: unknown }).config;
  vi.stubEnv('VITE_REGION', 'build-time-region');
  vi.stubEnv('VITE_COG_USER_POOL_ID', 'build-time-pool');
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
  if (originalConfig === undefined) {
    delete (window as { config?: unknown }).config;
  } else {
    (window as { config?: unknown }).config = originalConfig;
  }
});

describe('env', () => {
  it('falls back to build-time values when env.js has not populated window.config', async () => {
    const { env } = await loadEnv({});

    expect(env.VITE_REGION).toBe('build-time-region');
    expect(env.VITE_COG_USER_POOL_ID).toBe('build-time-pool');
  });

  it('falls back to build-time values when window.config is absent entirely', async () => {
    const { env } = await loadEnv(undefined);

    expect(env.VITE_REGION).toBe('build-time-region');
  });

  it('prefers runtime values over build-time ones', async () => {
    const { env } = await loadEnv({
      VITE_REGION: 'runtime-region',
      VITE_COG_USER_POOL_ID: 'runtime-pool',
    });

    expect(env.VITE_REGION).toBe('runtime-region');
    expect(env.VITE_COG_USER_POOL_ID).toBe('runtime-pool');
  });

  it('merges per key, so a partial env.js does not revert the other keys', async () => {
    // The regression this guards: replacing the whole object instead of merging meant one missing
    // key in env.js silently reverted every other key to the build-time value, which on the portal
    // is a different environment's configuration.
    const { env } = await loadEnv({ VITE_REGION: 'runtime-region' });

    expect(env.VITE_REGION).toBe('runtime-region');
    expect(env.VITE_COG_USER_POOL_ID).toBe('build-time-pool');
  });

  it('ignores empty runtime values rather than masking a usable build-time one', async () => {
    const { env } = await loadEnv({ VITE_REGION: '', VITE_COG_USER_POOL_ID: undefined });

    expect(env.VITE_REGION).toBe('build-time-region');
    expect(env.VITE_COG_USER_POOL_ID).toBe('build-time-pool');
  });
});

describe('missingEnv', () => {
  it('reports nothing when every name is populated at runtime', async () => {
    const { missingEnv } = await loadEnv({ VITE_OAUTH_DOMAIN: 'domain' });

    expect(missingEnv(['VITE_REGION', 'VITE_OAUTH_DOMAIN'])).toEqual([]);
  });

  it('names the absent and the empty, in the order given', async () => {
    const { missingEnv } = await loadEnv({ VITE_OAUTH_DOMAIN: '' });

    expect(missingEnv(['VITE_OAUTH_DOMAIN', 'VITE_OAUTH_REDIRECT_IN'])).toEqual([
      'VITE_OAUTH_DOMAIN',
      'VITE_OAUTH_REDIRECT_IN',
    ]);
  });
});
