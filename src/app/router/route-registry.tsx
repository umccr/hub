import { RouteErrorFallbackPage } from '@/features/errors/pages/RouteErrorFallbackPage';
import type { RouteObject } from 'react-router';

// The Hub's index route ('/') is registered directly in `app/router/index.ts`.
// Add additional feature routes here as new apps/sections are introduced.
const registeredRoutes: { route: RouteObject; featureName: string }[] = [];

const routeRegistry: RouteObject[] = registeredRoutes.map(({ route, featureName }) => ({
  ...route,
  errorElement: <RouteErrorFallbackPage featureName={featureName} />,
}));

export default routeRegistry;
