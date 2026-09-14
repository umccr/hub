import { describe, expect, it } from 'vitest';
import {
  CATALOG,
  CATALOG_KINDS,
  CATALOG_SECTIONS,
  catalogEnvironment,
  entriesInSection,
  groupCatalog,
  resolveCatalogEnv,
  resolveCatalogUrl,
  type CatalogEntry,
} from '../catalog';

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

  it('points every entry at an absolute http(s) url once resolved', () => {
    for (const entry of CATALOG) {
      for (const env of ['local', 'dev', 'stg', 'prod'] as const) {
        const url = resolveCatalogUrl(entry.url, env);
        expect(url).toMatch(/^https?:\/\//);
        expect(() => new URL(url)).not.toThrow();
        // No placeholder may survive resolution.
        expect(url).not.toContain('{');
      }
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

  it('lists every service API reference, resolved for dev', () => {
    expect(
      byKind('api')
        .map((e) => resolveCatalogUrl(e.url, 'dev'))
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

  it('moves the environment-bound API references with the environment', () => {
    const workflow = CATALOG.find((e) => e.id === 'api-workflow')!;
    expect(resolveCatalogUrl(workflow.url, 'local')).toContain('workflow.dev.umccr.org');
    expect(resolveCatalogUrl(workflow.url, 'dev')).toContain('workflow.dev.umccr.org');
    expect(resolveCatalogUrl(workflow.url, 'stg')).toContain('workflow.stg.umccr.org');
    expect(resolveCatalogUrl(workflow.url, 'prod')).toContain('workflow.prod.umccr.org');
  });

  it('keeps the deploy-status API pinned to prod, the only host it was given for', () => {
    const deploy = CATALOG.find((e) => e.id === 'api-deploy-status')!;
    for (const env of ['local', 'dev', 'stg', 'prod'] as const) {
      expect(resolveCatalogUrl(deploy.url, env)).toContain('deploy-status.prod.umccr.org');
    }
  });

  it('files the new tool and project links where they were asked for', () => {
    const byId = (id: string) => CATALOG.find((e) => e.id === id);
    expect(byId('wrapica')?.kind).toBe('tool');
    expect(byId('wrapica')?.url).toBe('https://wrapica.readthedocs.io/en/latest/');
    expect(byId('libica')?.kind).toBe('tool');
    expect(byId('libica')?.url).toBe('https://umccr.github.io/libica/openapi/');
    expect(byId('rnasum')?.kind).toBe('tool');
    expect(byId('rnasum')?.url).toBe('https://umccr.github.io/RNAsum/');
    expect(byId('orcabus-github')?.kind).toBe('project');
    expect(byId('orcabus-github')?.url).toBe('https://github.com/OrcaBus');
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

describe('environment resolution', () => {
  it('targets dev from local, since these services have no local deployment', () => {
    expect(catalogEnvironment('local')).toBe('dev');
    expect(catalogEnvironment('dev')).toBe('dev');
    expect(catalogEnvironment('stg')).toBe('stg');
    expect(catalogEnvironment('prod')).toBe('prod');
  });

  it('resolves the portal placeholder, which drops the label in prod', () => {
    const lims = CATALOG.find((e) => e.id === 'orcabus-lims')!;
    expect(resolveCatalogUrl(lims.url, 'dev')).toBe('https://portal.dev.umccr.org/');
    expect(resolveCatalogUrl(lims.url, 'stg')).toBe('https://portal.stg.umccr.org/');
    expect(resolveCatalogUrl(lims.url, 'prod')).toBe('https://portal.umccr.org/');
  });

  it('leaves urls without placeholders untouched', () => {
    for (const env of ['local', 'dev', 'stg', 'prod'] as const) {
      expect(resolveCatalogUrl('https://github.com/OrcaBus', env)).toBe(
        'https://github.com/OrcaBus'
      );
    }
  });

  it('reads the environment badge back off the resolved host', () => {
    expect(resolveCatalogEnv('https://workflow.stg.umccr.org/schema/swagger-ui/#/')).toBe('stg');
    expect(resolveCatalogEnv('https://portal.dev.umccr.org/')).toBe('dev');
    expect(resolveCatalogEnv('https://portal.umccr.org/')).toBe('prod');
  });

  it('shows no environment badge for hosts that are not environment-specific', () => {
    expect(resolveCatalogEnv('https://github.com/OrcaBus')).toBeUndefined();
    expect(resolveCatalogEnv('https://umccr.org/about/')).toBeUndefined();
    expect(resolveCatalogEnv('https://wrapica.readthedocs.io/en/latest/')).toBeUndefined();
    expect(resolveCatalogEnv('http://localhost:3002/')).toBeUndefined();
  });

  it('never contradicts the link it labels', () => {
    for (const entry of CATALOG) {
      for (const env of ['local', 'dev', 'stg', 'prod'] as const) {
        const url = resolveCatalogUrl(entry.url, env);
        const badge = resolveCatalogEnv(url);
        if (badge) expect(url).toContain(badge === 'prod' ? 'umccr.org' : `.${badge}.umccr.org`);
      }
    }
  });
});

describe('platform sections', () => {
  it('declares a unique path and section id for each', () => {
    expect(CATALOG_SECTIONS.map((s) => s.section)).toEqual(['orcabus', 'orcahouse']);
    const paths = CATALOG_SECTIONS.map((s) => s.path);
    expect(new Set(paths).size).toBe(paths.length);
    for (const path of paths) expect(path.startsWith('/')).toBe(true);
  });

  it('only tags entries with a section that exists', () => {
    const known = new Set(CATALOG_SECTIONS.map((s) => s.section));
    for (const entry of CATALOG) {
      if (entry.section) expect(known.has(entry.section)).toBe(true);
    }
  });

  it('gives every section entries', () => {
    for (const { section } of CATALOG_SECTIONS) {
      expect(entriesInSection(section).length).toBeGreaterThan(0);
    }
  });

  it('puts the LIMS consoles and service APIs under OrcaBus', () => {
    const ids = entriesInSection('orcabus').map((e) => e.id);
    expect(ids).toContain('orcabus-lims');
    expect(ids).toContain('api-metadata');
    expect(ids).toContain('api-sequence');
    expect(ids).toContain('orcabus-github');
  });

  it('puts the warehouse and its dbt docs under OrcaHouse', () => {
    const ids = entriesInSection('orcahouse').map((e) => e.id);
    expect(ids).toEqual(['orcahouse-mart', 'orcahouse-dbt-docs', 'orcavault-docs']);
  });

  it('leaves organisation sites out of both, so they only show on the Overview', () => {
    for (const entry of CATALOG.filter((e) => e.kind === 'web')) {
      expect(entry.section).toBeUndefined();
    }
  });
});
