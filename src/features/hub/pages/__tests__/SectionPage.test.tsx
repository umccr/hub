import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import {
  EnvironmentContext,
  type AppEnvironment,
  type EnvironmentContextValue,
} from '@/context/environment-context';
import { SectionPage } from '../SectionPage';
import {
  CATALOG,
  CATALOG_SECTIONS,
  entriesInSection,
  resolveCatalogUrl,
  type CatalogSection,
} from '../../data/catalog';

vi.mock('@/context/app-shell-context', () => ({ useAppShellHeader: vi.fn() }));

function render(section: CatalogSection, environment: AppEnvironment = 'dev') {
  const env = { environment, label: 'Dev' } as EnvironmentContextValue;
  return renderToStaticMarkup(
    <MemoryRouter>
      <EnvironmentContext.Provider value={env}>
        <SectionPage section={section} />
      </EnvironmentContext.Provider>
    </MemoryRouter>
  );
}

describe('SectionPage', () => {
  it.each(CATALOG_SECTIONS)('renders the $label section heading and blurb', (section) => {
    const html = render(section.section);
    expect(html).toContain(section.label);
    expect(html).toContain(section.blurb);
  });

  it.each(CATALOG_SECTIONS)('shows only $label entries', (section) => {
    const html = render(section.section);

    for (const entry of entriesInSection(section.section)) {
      expect(html).toContain(resolveCatalogUrl(entry.url, 'dev'));
    }

    // Nothing from the other sections leaks in.
    const others = CATALOG.filter((e) => e.section && e.section !== section.section);
    expect(others.length).toBeGreaterThan(0);
    for (const entry of others) {
      expect(html).not.toContain(`>${entry.name}<`);
    }
  });

  it('excludes entries that belong to no section', () => {
    const html = render('orcabus');
    expect(html).not.toContain('>RNAsum<');
    expect(html).not.toContain('>UMCCR on GitHub<');
  });

  it('resolves entry urls for the current environment', () => {
    expect(render('orcabus', 'prod')).toContain('metadata.prod.umccr.org');
    expect(render('orcabus', 'stg')).toContain('metadata.stg.umccr.org');
  });

  it('opens destinations in a new tab, safely', () => {
    const html = render('orcahouse');
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
  });
});
