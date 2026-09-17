import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import type { ReactNode } from 'react';
import { Sidebar } from '../Sidebar';
import { AppShellContext, type AppShellContextValue } from '../../../context/app-shell-context';
import { CATALOG_SECTIONS } from '@/features/hub/data/catalog';

function render(collapsed = false) {
  const value = {
    isSidebarCollapsed: collapsed,
    toggleSidebar: vi.fn(),
  } as unknown as AppShellContextValue;

  return renderToStaticMarkup(
    <MemoryRouter initialEntries={['/']}>
      <AppShellContext.Provider value={value}>
        {(<Sidebar />) as ReactNode}
      </AppShellContext.Provider>
    </MemoryRouter>
  );
}

describe('Sidebar', () => {
  it('places About us on the nav side of the divider, above the collapse control', () => {
    const markup = render();

    const aboutAt = markup.indexOf('href="/about"');
    const dividerAt = markup.indexOf('border-t');
    const collapseAt = markup.indexOf('Collapse sidebar');

    expect(aboutAt).toBeGreaterThan(-1);
    expect(dividerAt).toBeGreaterThan(-1);
    // About us → divider → collapse control.
    expect(aboutAt).toBeLessThan(dividerAt);
    expect(dividerAt).toBeLessThan(collapseAt);
  });

  it('orders Overview, then the platform sections, then About us', () => {
    const markup = render();
    const at = (href: string) => markup.indexOf(`href="${href}"`);

    expect(at('/')).toBeLessThan(at('/orcabus'));
    expect(at('/orcabus')).toBeLessThan(at('/orcahouse'));
    expect(at('/orcahouse')).toBeLessThan(at('/about'));
  });

  it('groups the platform sections under a Sections label', () => {
    const markup = render();
    expect(markup).toContain('Sections');
    for (const section of CATALOG_SECTIONS) {
      expect(markup).toContain(`href="${section.path}"`);
      expect(markup).toContain(section.label);
    }
  });

  it('drops the group label when collapsed, keeping the links', () => {
    const markup = render(true);
    expect(markup).not.toContain('>Sections<');
    expect(markup).toContain('href="/orcabus"');
  });

  it('marks Hub as the current page at the index route', () => {
    expect(render()).toContain('aria-current="page"');
  });

  it('still renders both destinations when collapsed', () => {
    const markup = render(true);
    expect(markup).toContain('href="/"');
    expect(markup).toContain('href="/about"');
    expect(markup).toContain('Expand sidebar');
  });
});
