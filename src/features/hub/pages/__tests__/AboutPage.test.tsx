import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import { AboutPage } from '../AboutPage';
import { COLLABORATIVE_CENTRE, ORG, ORG_LINKS } from '../../data/organisation';

vi.mock('@/context/app-shell-context', () => ({
  useAppShellHeader: vi.fn(),
}));

function renderAbout() {
  return renderToStaticMarkup(
    <MemoryRouter>
      <AboutPage />
    </MemoryRouter>
  );
}

describe('AboutPage', () => {
  it('introduces the centre by its full name and mission', () => {
    const html = renderAbout();
    expect(html).toContain(ORG.name);
    expect(html).toContain(ORG.mission);
  });

  it('describes the partner centre', () => {
    const html = renderAbout();
    expect(html).toContain(COLLABORATIVE_CENTRE.name);
    expect(html).toContain(COLLABORATIVE_CENTRE.summary);
  });

  it('renders the supporting facts for both organisations', () => {
    const html = renderAbout();
    for (const fact of [...ORG.facts, ...COLLABORATIVE_CENTRE.facts]) {
      expect(html).toContain(fact.label);
      expect(html).toContain(fact.value);
    }
  });

  it('hands off to both public sites, safely', () => {
    const html = renderAbout();
    for (const link of ORG_LINKS) {
      expect(html).toContain(`href="${link.url}"`);
    }
    expect(html).toContain('rel="noopener noreferrer"');
  });
});
