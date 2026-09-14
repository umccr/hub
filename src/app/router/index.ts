import { createElement, lazy } from 'react';
import { createBrowserRouter } from 'react-router';
import { Root } from '@/components/layout/Root';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import authRoutes from '@/features/auth/routes';
import { RouteErrorFallbackPage } from '@/features/errors/pages/RouteErrorFallbackPage';

import { CATALOG_SECTIONS } from '@/features/hub/data/catalog';

import routeRegistry from './route-registry';

const HubPage = lazy(() =>
  import('@/features/hub/pages/HubPage').then((m) => ({ default: m.HubPage }))
);

const SectionPage = lazy(() =>
  import('@/features/hub/pages/SectionPage').then((m) => ({ default: m.SectionPage }))
);

const AboutPage = lazy(() =>
  import('@/features/hub/pages/AboutPage').then((m) => ({ default: m.AboutPage }))
);

const NotFoundPage = lazy(() =>
  import('@/features/errors/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage }))
);

export const router = createBrowserRouter(
  [
    // Public routes — accessible without authentication
    authRoutes,

    // Protected routes — requires authenticated session
    {
      Component: ProtectedRoute,
      children: [
        {
          path: '/',
          Component: Root,
          children: [
            {
              index: true,
              Component: HubPage,
              errorElement: createElement(RouteErrorFallbackPage, { featureName: 'Overview' }),
            },
            ...CATALOG_SECTIONS.map((section) => ({
              path: section.path.replace(/^\//, ''),
              element: createElement(SectionPage, { section: section.section }),
              errorElement: createElement(RouteErrorFallbackPage, { featureName: section.label }),
            })),
            {
              path: 'about',
              Component: AboutPage,
              errorElement: createElement(RouteErrorFallbackPage, { featureName: 'Organisation' }),
            },
            ...routeRegistry,
          ],
        },
      ],
    },

    // Catch-all — unknown routes
    { path: '*', Component: NotFoundPage },
  ],
  { basename: '/v2/' }
);
