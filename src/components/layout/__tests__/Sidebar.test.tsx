import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import type { ReactNode } from 'react';
import { Sidebar } from '../Sidebar';
import { AppShellContext, type AppShellContextValue } from '../../../context/app-shell-context';

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

  it('keeps Hub above About us', () => {
    const markup = render();
    expect(markup.indexOf('href="/"')).toBeLessThan(markup.indexOf('href="/about"'));
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
