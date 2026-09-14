import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import { AuthContext, type AuthContextValue } from '@/context/auth-context';
import { HubPage } from '../HubPage';
import { CATALOG } from '../../data/catalog';
import { ORG_LINKS } from '../../data/organisation';

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

  it('surfaces both organisation links above the catalogue', () => {
    const html = renderHub();
    for (const link of ORG_LINKS) {
      expect(html).toContain(link.url);
      expect(html).toContain(link.host);
    }
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

  it('links through to the fuller organisation overview', () => {
    expect(renderHub()).toContain('href="/about"');
  });
});
