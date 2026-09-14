import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import { AuthContext, type AuthContextValue } from '@/context/auth-context';
import { HubPage } from '../HubPage';
import { CATALOG } from '../../data/catalog';
import { COLLABORATIVE_CENTRE, ORG, ORG_LINKS } from '../../data/organisation';

// The header is shell state, not page content — stub the registration hook so
// the page can render standalone.
vi.mock('@/context/app-shell-context', () => ({
  useAppShellHeader: vi.fn(),
}));

function renderHub(user: AuthContextValue['user'] = {}) {
  const auth: AuthContextValue = {
    isAuthenticated: true,
    user,
    groups: [],
    isLoading: false,
    signInWithGoogle: vi.fn(),
    logout: vi.fn(),
  };

  return renderToStaticMarkup(
    <MemoryRouter>
      <AuthContext.Provider value={auth}>
        <HubPage />
      </AuthContext.Provider>
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

  it('renders every catalogue entry', () => {
    const html = renderHub();
    for (const entry of CATALOG) {
      expect(html).toContain(entry.url);
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

  it('marks which deployment an API reference points at', () => {
    const html = renderHub();
    // The catalogue mixes dev and prod hosts, so the distinction has to be visible.
    expect(CATALOG.some((e) => e.env === 'dev')).toBe(true);
    expect(CATALOG.some((e) => e.env === 'prod')).toBe(true);
    expect(html).toContain('>dev<');
    expect(html).toContain('>prod<');
  });
});
