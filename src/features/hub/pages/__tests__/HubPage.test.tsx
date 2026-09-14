import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import { AuthContext, type AuthContextValue } from '@/context/auth-context';
import { HubPage } from '../HubPage';
import { CATALOG, CATALOG_SECTIONS, resolveCatalogUrl } from '../../data/catalog';
import {
  EnvironmentContext,
  type AppEnvironment,
  type EnvironmentContextValue,
} from '@/context/environment-context';
import { COLLABORATIVE_CENTRE, ORG, ORG_LINKS } from '../../data/organisation';

// The header is shell state, not page content — stub the registration hook so
// the page can render standalone.
vi.mock('@/context/app-shell-context', () => ({
  useAppShellHeader: vi.fn(),
}));

function renderHub(user: AuthContextValue['user'] = {}, environment: AppEnvironment = 'dev') {
  const auth: AuthContextValue = {
    isAuthenticated: true,
    user,
    groups: [],
    isLoading: false,
    signInWithGoogle: vi.fn(),
    logout: vi.fn(),
  };
  const env = { environment, label: 'Dev' } as EnvironmentContextValue;

  return renderToStaticMarkup(
    <MemoryRouter>
      <EnvironmentContext.Provider value={env}>
        <AuthContext.Provider value={auth}>
          <HubPage />
        </AuthContext.Provider>
      </EnvironmentContext.Provider>
    </MemoryRouter>
  );
}

describe('HubPage', () => {
  it('greets the signed-in user by name when one is available', () => {
    expect(renderHub({ name: 'Ray' })).toContain('Welcome, Ray');
  });

  it('still greets when the profile carries no name', () => {
    const html = renderHub();
    expect(html).toContain('Welcome');
    expect(html).not.toContain('Welcome,');
  });

  it('renders every catalogue entry, resolved for the current environment', () => {
    const html = renderHub({}, 'stg');
    for (const entry of CATALOG) {
      expect(html).toContain(resolveCatalogUrl(entry.url, 'stg'));
    }
  });

  it('groups entries under all four section headings', () => {
    const html = renderHub();
    for (const heading of ['Apps', 'Tools', 'Projects', 'Organisation']) {
      expect(html).toContain(`>${heading}</h3>`);
    }
  });

  it('carries both organisation links inline in the welcome copy', () => {
    const html = renderHub();
    const intro = html.slice(0, html.indexOf('Search the catalogue'));
    for (const link of ORG_LINKS) {
      expect(intro).toContain(`href="${link.url}"`);
    }
  });

  it('names the organisations rather than showing bare urls', () => {
    const html = renderHub();
    expect(html).toContain(ORG.name);
    expect(html).toContain(COLLABORATIVE_CENTRE.name);
  });

  it('names the partnership behind the partner centre', () => {
    expect(renderHub()).toContain(COLLABORATIVE_CENTRE.partnership);
  });

  it('opens external destinations safely in a new tab', () => {
    const html = renderHub();
    expect(html).toContain('rel="noopener noreferrer"');
    expect(html).toContain('target="_blank"');
  });

  it('flags entries that only resolve on a developer machine', () => {
    const html = renderHub();
    expect(CATALOG.some((e) => e.local)).toBe(true);
    expect(html).toContain('Local');
  });

  it('marks which deployment each environment-bound entry reaches', () => {
    // The catalogue mixes environment-bound and prod-pinned hosts, so the
    // distinction has to be visible on the tile.
    const html = renderHub();
    expect(html).toContain('>dev<');
    expect(html).toContain('>prod<');
  });

  it('follows the environment the Hub is running in', () => {
    expect(renderHub({}, 'stg')).toContain('workflow.stg.umccr.org');
    expect(renderHub({}, 'prod')).toContain('workflow.prod.umccr.org');
    // Local has no deployment of its own, so it reads dev.
    expect(renderHub({}, 'local')).toContain('workflow.dev.umccr.org');
  });

  it('links to each platform section', () => {
    const html = renderHub();
    for (const section of CATALOG_SECTIONS) {
      expect(html).toContain(`href="${section.path}"`);
      expect(html).toContain(section.label);
    }
  });
});
