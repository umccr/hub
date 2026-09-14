import { describe, expect, it } from 'vitest';
import { CATALOG, CATALOG_KINDS, groupCatalog, type CatalogEntry } from '../catalog';

const entries: CatalogEntry[] = [
  {
    id: 'alpha',
    name: 'Alpha Console',
    description: 'Runs the lab.',
    kind: 'app',
    url: 'https://example.org/alpha',
    initials: 'AC',
    accent: 'bg-blue-600',
  },
  {
    id: 'beta',
    name: 'Beta Checker',
    description: 'Validates sheets.',
    kind: 'tool',
    url: 'https://example.org/beta',
    initials: 'BC',
    accent: 'bg-amber-500',
  },
  {
    id: 'gamma',
    name: 'Gamma Docs',
    description: 'Documentation for Alpha.',
    kind: 'project',
    url: 'https://example.org/gamma',
    initials: 'GD',
    accent: 'bg-purple-600',
  },
];

describe('groupCatalog', () => {
  it('returns every kind present when unfiltered', () => {
    const groups = groupCatalog('', 'all', entries);
    expect(groups.map((g) => g.kind)).toEqual(['app', 'tool', 'project']);
  });

  it('drops groups that end up empty rather than showing a bare heading', () => {
    const groups = groupCatalog('', 'tool', entries);
    expect(groups).toHaveLength(1);
    expect(groups[0].entries.map((e) => e.id)).toEqual(['beta']);
  });

  it('matches on name, case-insensitively', () => {
    const groups = groupCatalog('BETA', 'all', entries);
    expect(groups.flatMap((g) => g.entries).map((e) => e.id)).toEqual(['beta']);
  });

  it('matches on description, so a remembered word still finds the entry', () => {
    const groups = groupCatalog('validates', 'all', entries);
    expect(groups.flatMap((g) => g.entries).map((e) => e.id)).toEqual(['beta']);
  });

  it('matches on kind, so typing a category works like a filter', () => {
    const groups = groupCatalog('project', 'all', entries);
    expect(groups.flatMap((g) => g.entries).map((e) => e.id)).toEqual(['gamma']);
  });

  it('applies search and kind filter together', () => {
    // "alpha" appears in Alpha Console's name and Gamma Docs' description,
    // but the kind filter should keep only the project.
    const groups = groupCatalog('alpha', 'project', entries);
    expect(groups.flatMap((g) => g.entries).map((e) => e.id)).toEqual(['gamma']);
  });

  it('ignores surrounding whitespace in the query', () => {
    expect(groupCatalog('   ', 'all', entries)).toHaveLength(3);
    expect(groupCatalog('  beta  ', 'all', entries).flatMap((g) => g.entries)).toHaveLength(1);
  });

  it('returns no groups when nothing matches', () => {
    expect(groupCatalog('nonexistent', 'all', entries)).toEqual([]);
  });

  it('preserves the declared section order regardless of entry order', () => {
    const shuffled = [entries[2], entries[0], entries[1]];
    expect(groupCatalog('', 'all', shuffled).map((g) => g.kind)).toEqual([
      'app',
      'tool',
      'project',
    ]);
  });
});

describe('CATALOG', () => {
  it('has unique ids', () => {
    const ids = CATALOG.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('only uses kinds that have a section to render them', () => {
    const known = new Set(CATALOG_KINDS.map((k) => k.kind));
    for (const entry of CATALOG) {
      expect(known.has(entry.kind)).toBe(true);
    }
  });

  it('points every entry at an absolute http(s) url', () => {
    for (const entry of CATALOG) {
      expect(entry.url).toMatch(/^https?:\/\//);
    }
  });

  it('flags localhost entries as local so the UI can warn about them', () => {
    for (const entry of CATALOG) {
      if (entry.url.includes('localhost')) {
        expect(entry.local).toBe(true);
      }
    }
  });
});

describe('catalogue sections', () => {
  const byKind = (kind: string) => CATALOG.filter((e) => e.kind === kind);

  it('lists every documentation site', () => {
    expect(byKind('docs').map((e) => e.url)).toEqual([
      'https://umccr.github.io/guardians-doc/',
      'https://umccr.github.io/orcahouse-doc/dbt/',
      'https://umccr.github.io/orcahouse-doc/dbt/orcavault/#!/overview',
    ]);
  });

  it('lists every service API reference', () => {
    expect(
      byKind('api')
        .map((e) => e.url)
        .sort()
    ).toEqual([
      'https://case.dev.umccr.org/schema/swagger-ui/#/',
      'https://deploy-status.prod.umccr.org/schema/swagger-ui#/',
      'https://fastq.dev.umccr.org/schema/swagger-ui#/',
      'https://file.dev.umccr.org/schema/swagger-ui/#/',
      'https://metadata.dev.umccr.org/schema/swagger-ui/#/',
      'https://sequence.dev.umccr.org/schema/swagger-ui/#/',
      'https://workflow.dev.umccr.org/schema/swagger-ui/#/',
    ]);
  });

  it('tags every API reference with the deployment it points at', () => {
    for (const entry of byKind('api')) {
      expect(entry.env).toBeDefined();
    }
  });

  it('derives that tag from the host, so the label cannot contradict the url', () => {
    for (const entry of CATALOG) {
      if (!entry.env) continue;
      expect(new URL(entry.url).hostname).toContain(`.${entry.env}.`);
    }
  });

  it('files GitHub Explorer under projects', () => {
    const gh = CATALOG.find((e) => e.id === 'github-explorer');
    expect(gh?.name).toBe('GitHub Explorer');
    expect(gh?.kind).toBe('project');
  });

  it('gives every declared section at least one entry', () => {
    for (const { kind } of CATALOG_KINDS) {
      expect(byKind(kind).length).toBeGreaterThan(0);
    }
  });
});
