import { env, missingEnv } from '@/utils/env';

/**
 * Cognito settings, read from the runtime config rather than baked into the bundle, so one build can
 * be promoted from dev to prod. See `src/utils/env.ts` for where the values come from.
 */

/** Settings sign-in cannot work without. */
const REQUIRED_AUTH_KEYS = [
  'VITE_REGION',
  'VITE_OAUTH_DOMAIN',
  'VITE_COG_USER_POOL_ID',
  'VITE_COG_APP_CLIENT_ID',
  'VITE_OAUTH_REDIRECT_IN',
  'VITE_OAUTH_REDIRECT_OUT',
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

const config = {
  region: REGION,
  cognito: {
    REGION: REGION,
    USER_POOL_ID: env.VITE_COG_USER_POOL_ID as string,
    APP_CLIENT_ID: env.VITE_COG_APP_CLIENT_ID as string,
    OAUTH: {
      domain: OAUTH_DOMAIN,
      scopes: ['email', 'openid', 'aws.cognito.signin.user.admin', 'profile'],
      redirectSignIn: [env.VITE_OAUTH_REDIRECT_IN as string],
      redirectSignOut: [env.VITE_OAUTH_REDIRECT_OUT as string],
      responseType: 'code' as const,
    },
  },
};

export default config;

export { REGION };
