import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { EnvironmentContext, type EnvironmentContextValue } from '@/context/environment-context';
import { CatalogCard } from '../CatalogCard';
import type { CatalogEntry } from '../../data/catalog';

const baseEntry: CatalogEntry = {
  id: 'fixture',
  name: 'Fixture App',
  description: 'A fixture entry for the card in isolation.',
  kind: 'app',
  url: 'https://example.{env}.umccr.org/',
  initials: 'FX',
  accent: 'bg-blue-600',
};

function render(entry: CatalogEntry) {
  const env = { environment: 'dev', label: 'Dev' } as EnvironmentContextValue;
  return renderToStaticMarkup(
    <EnvironmentContext.Provider value={env}>
      <CatalogCard entry={entry} />
    </EnvironmentContext.Provider>
  );
}

describe('CatalogCard', () => {
  it('flags an entry that only resolves on a developer machine', () => {
    const html = render({ ...baseEntry, local: true, url: 'http://localhost:3002/' });
    expect(html).toContain('Local');
  });

  it('does not show the Local flag for a deployed entry', () => {
    const html = render(baseEntry);
    expect(html).not.toContain('Local');
  });

  it('shows the resolved environment tag for an environment-bound host', () => {
    const html = render(baseEntry);
    expect(html).toContain('>dev<');
  });

  it('resolves the url before linking to it', () => {
    const html = render(baseEntry);
    expect(html).toContain('href="https://example.dev.umccr.org/"');
    expect(html).not.toContain('{env}');
  });
});
