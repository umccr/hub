/**
 * Runtime configuration, merged over the values Vite inlined at build time.
 *
 * The portal builds this app once and promotes the same artifact from dev to prod, so nothing
 * environment-specific may be baked in. Each environment's S3 bucket gets its own `env.js`, written
 * by the portal's config Lambda, which sets `window.config` before the app module runs
 * (see the script tag in index.html).
 *
 * `window.config` is merged **per key** rather than replacing the whole object: a partially
 * populated `env.js` must not silently revert every other key to whatever the build inlined, since
 * on the portal that would mean falling back to a different environment's settings.
 */

type EnvRecord = Record<string, string | undefined>;

declare global {
  interface Window {
    /** The portal's runtime config, set by this app's env.js. */
    config?: EnvRecord;
  }
}

const buildTimeEnv = import.meta.env as unknown as EnvRecord;

export const env: EnvRecord = {
  ...buildTimeEnv,
  // Drop undefined values so a key present-but-unset in env.js does not mask the build-time one.
  ...Object.fromEntries(
    Object.entries((typeof window === 'undefined' ? undefined : window.config) ?? {}).filter(
      ([, value]) => value !== undefined && value !== ''
    )
  ),
};

/** Names from `required` that are absent or empty, in the order given. */
export function missingEnv(required: readonly string[]): string[] {
  return required.filter((name) => !env[name]);
}
