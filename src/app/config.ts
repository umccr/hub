import { env, missingEnv } from '@/utils/env';

/**
 * Cognito settings, read from the runtime config rather than baked into the bundle, so one build can
 * be promoted from dev to prod. See `src/utils/env.ts` for where the values come from.
 */

/**
 * Settings sign-in cannot work without.
 *
 * The OAuth redirect URLs are absent on purpose: this app derives them from its own location rather
 * than reading `VITE_OAUTH_REDIRECT_IN`/`_OUT`, which name the portal root. See `APP_URL` below.
 */
const REQUIRED_AUTH_KEYS = [
  'VITE_REGION',
  'VITE_OAUTH_DOMAIN',
  'VITE_COG_USER_POOL_ID',
  'VITE_COG_APP_CLIENT_ID',
] as const;

/** Names of the required settings that are missing, empty when sign-in is fully configured. */
export const missingAuthConfig = missingEnv(REQUIRED_AUTH_KEYS);

export const isAuthConfigured = missingAuthConfig.length === 0;

if (!isAuthConfigured && typeof window !== 'undefined') {
  // Say so plainly and once. Without this, missing values reach Amplify as `undefined` and the only
  // symptom is a hosted-UI redirect to `undefined.auth.undefined.amazoncognito.com`, which gives no
  // clue that the cause is an env.js that did not load or did not contain these keys.
  console.error(
    `[hub] Sign-in is not configured: missing ${missingAuthConfig.join(', ')}. ` +
      'Deployed, these come from env.js written by the portal config Lambda; ' +
      'locally, from the VITE_* variables that start.sh exports.'
  );
}

const REGION = env.VITE_REGION as string;
const OAUTH_DOMAIN = `${env.VITE_OAUTH_DOMAIN as string}.auth.${REGION}.amazoncognito.com`;

/**
 * Where Cognito returns the user after sign-in and sign-out: this app's own root, not the portal's.
 *
 * Derived from the current origin plus Vite's base path, so it is correct in every environment and on
 * both prod hostnames without any per-environment configuration. The runtime config's
 * `VITE_OAUTH_REDIRECT_IN`/`_OUT` are deliberately not used: they name the portal root, which is a
 * different app, so sign-in from here would land the user in OrcaUI.
 *
 * This exact string must be registered as a callback and logout URL on the Cognito app client. It is
 * generated from `portal_app_paths` in the cognito_aai Terraform stack, so **apply that stack before
 * shipping a change to this value**, or the hosted UI rejects sign-in with `redirect_mismatch`.
 * `BASE_URL` already ends in a slash, matching the registered form.
 */
const APP_URL =
  typeof window === 'undefined' ? '' : `${window.location.origin}${import.meta.env.BASE_URL}`;

const config = {
  region: REGION,
  cognito: {
    REGION: REGION,
    USER_POOL_ID: env.VITE_COG_USER_POOL_ID as string,
    APP_CLIENT_ID: env.VITE_COG_APP_CLIENT_ID as string,
    OAUTH: {
      domain: OAUTH_DOMAIN,
      scopes: ['email', 'openid', 'aws.cognito.signin.user.admin', 'profile'],
      redirectSignIn: [APP_URL],
      redirectSignOut: [APP_URL],
      responseType: 'code' as const,
    },
  },
};

export default config;

export { REGION };
