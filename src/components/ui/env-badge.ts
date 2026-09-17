import type { AppEnvironment } from '@/context/environment-context';

/**
 * Deploy-environment colours — the one documented exception to the fixed status
 * vocabulary (see DESIGN.md → Environment Badge). These say *where* something
 * runs, not how it is doing, so Prod is Emerald rather than Success Green and
 * Local is Violet: neither hue is used for entity state anywhere else.
 *
 * Kept in its own constants module, like `status-config.ts`, so both the header
 * indicator and the Hub catalogue read the same map instead of drifting apart.
 */
export const ENV_BADGE_STYLES: Record<AppEnvironment, string> = {
  local:
    'border border-violet-200 bg-violet-100 text-violet-700 dark:border-violet-900/30 dark:bg-violet-500/10 dark:text-violet-400',
  dev: 'border border-blue-200 bg-blue-100 text-blue-700 dark:border-blue-900/30 dark:bg-blue-500/10 dark:text-blue-400',
  stg: 'border border-amber-200 bg-amber-100 text-amber-700 dark:border-amber-900/30 dark:bg-amber-500/10 dark:text-amber-500',
  prod: 'border border-emerald-200 bg-emerald-100 text-emerald-700 dark:border-emerald-900/30 dark:bg-emerald-500/10 dark:text-emerald-400',
};
