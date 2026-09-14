import { env } from '@/utils/env';

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
