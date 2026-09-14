import {
  AppWindow,
  BookOpen,
  Braces,
  FolderGit2,
  Globe,
  Wrench,
  type LucideIcon,
} from 'lucide-react';

/**
 * What the Hub catalogues. The four kinds are deliberately coarse — they answer
 * "what am I about to open?", not "which team owns it":
 *
 *  - `app`     a console you work in (sign in, read and change data)
 *  - `tool`    a single-purpose utility you run and leave
 *  - `project` a source repository
 *  - `docs`    written documentation you read
 *  - `api`     a service's OpenAPI/Swagger reference
 *  - `web`     an organisation-facing site
 */
export type CatalogKind = 'app' | 'tool' | 'project' | 'docs' | 'api' | 'web';

export interface CatalogEntry {
  id: string;
  name: string;
  description: string;
  kind: CatalogKind;
  url: string;
  /** Two-or-three letter monogram for the tile. */
  initials: string;
  /** Tailwind background class for the monogram tile. */
  accent: string;
  /** Points at a dev server rather than a deployed host — flagged in the UI so
   *  nobody files a bug when it fails to load from another machine. */
  local?: boolean;
  /** Which deployment this points at. Shown on the tile because the catalogue
   *  mixes dev and prod hosts, and the URL alone is easy to misread. */
  env?: 'dev' | 'prod';
}

export const CATALOG_KINDS: {
  kind: CatalogKind;
  label: string;
  /** Plural heading used for the section that groups this kind. */
  heading: string;
  blurb: string;
  icon: LucideIcon;
}[] = [
  {
    kind: 'app',
    label: 'App',
    heading: 'Apps',
    blurb: 'Consoles for day-to-day lab and pipeline work.',
    icon: AppWindow,
  },
  {
    kind: 'tool',
    label: 'Tool',
    heading: 'Tools',
    blurb: 'Single-purpose utilities for checks and status.',
    icon: Wrench,
  },
  {
    kind: 'project',
    label: 'Project',
    heading: 'Projects',
    blurb: 'Source repositories and the tools that browse them.',
    icon: FolderGit2,
  },
  {
    kind: 'docs',
    label: 'Docs',
    heading: 'Docs',
    blurb: 'Written documentation for the platform and its data.',
    icon: BookOpen,
  },
  {
    kind: 'api',
    label: 'API',
    heading: 'API references',
    blurb: 'OpenAPI schemas and Swagger UI for the microservices.',
    icon: Braces,
  },
  {
    kind: 'web',
    label: 'Web',
    heading: 'Organisation',
    blurb: 'Public sites for UMCCR and its partners.',
    icon: Globe,
  },
];

/**
 * The catalogue itself. Add an entry here and it appears on the Hub — there is
 * no other registration step.
 */
export const CATALOG: CatalogEntry[] = [
  // --- Apps -----------------------------------------------------------------
  {
    id: 'orcabus-lims',
    name: 'Orcabus LIMS',
    description: 'Lab metadata, sequencing runs, and workflow orchestration console.',
    kind: 'app',
    url: 'https://portal.dev.umccr.org/',
    initials: 'OL',
    accent: 'bg-blue-600',
  },
  {
    id: 'orcabus-lims-v2',
    name: 'Orcabus LIMS v2',
    description: 'The rebuilt LIMS console — cases, lab metadata, runs, workflows and vault.',
    kind: 'app',
    url: 'https://portal.dev.umccr.org/v2/',
    initials: 'L2',
    accent: 'bg-emerald-600',
  },
  {
    id: 'orcahouse-mart',
    name: 'OrcaHouse Mart',
    description: 'Consumer-facing tables of the OrcaHouse data warehouse.',
    kind: 'app',
    url: 'http://localhost:3002/',
    initials: 'OM',
    accent: 'bg-rose-500',
    local: true,
  },
  // --- Tools ----------------------------------------------------------------
  {
    id: 'deployment-pulse',
    name: 'Deployment Pulse',
    description: 'Live status of deployments across environments.',
    kind: 'tool',
    url: 'https://portal.dev.umccr.org/v2/tools/deploy-status',
    initials: 'DP',
    accent: 'bg-emerald-600',
  },
  {
    id: 'samplesheet-checker',
    name: 'Samplesheet Checker',
    description: 'Validate sequencing sample sheets before committing a run.',
    kind: 'tool',
    url: 'https://portal.dev.umccr.org/v2/tools/ss-check',
    initials: 'SS',
    accent: 'bg-amber-500',
  },

  // --- Projects -------------------------------------------------------------
  {
    id: 'github-explorer',
    name: 'GitHub Explorer',
    description: 'Browse and monitor the organisation’s repositories.',
    kind: 'project',
    url: 'http://localhost:5173/',
    initials: 'GX',
    accent: 'bg-slate-800',
    local: true,
  },
  {
    id: 'github-org',
    name: 'UMCCR on GitHub',
    description: 'Source for the pipelines, infrastructure and apps behind this Hub.',
    kind: 'project',
    url: 'https://github.com/umccr',
    initials: 'GT',
    accent: 'bg-slate-700',
  },

  // --- Docs -----------------------------------------------------------------
  {
    id: 'guardians-docs',
    name: 'Guardians',
    description: 'Documentation for the Guardians project.',
    kind: 'docs',
    url: 'https://umccr.github.io/guardians-doc/',
    initials: 'GD',
    accent: 'bg-purple-600',
  },
  {
    id: 'orcahouse-dbt-docs',
    name: 'OrcaHouse dbt',
    description: 'dbt project docs for the OrcaHouse warehouse — models, sources and lineage.',
    kind: 'docs',
    url: 'https://umccr.github.io/orcahouse-doc/dbt/',
    initials: 'DB',
    accent: 'bg-orange-600',
  },
  {
    id: 'orcavault-docs',
    name: 'OrcaVault',
    description: 'dbt documentation for the OrcaVault models.',
    kind: 'docs',
    url: 'https://umccr.github.io/orcahouse-doc/dbt/orcavault/#!/overview',
    initials: 'OV',
    accent: 'bg-orange-500',
  },

  // --- API references -------------------------------------------------------
  {
    id: 'api-metadata',
    name: 'Metadata API',
    description: 'Subjects, samples, libraries and projects — the lab metadata service.',
    kind: 'api',
    url: 'https://metadata.dev.umccr.org/schema/swagger-ui/#/',
    initials: 'MD',
    accent: 'bg-blue-600',
    env: 'dev',
  },
  {
    id: 'api-sequence',
    name: 'Sequence API',
    description: 'Sequencing runs and their state.',
    kind: 'api',
    url: 'https://sequence.dev.umccr.org/schema/swagger-ui/#/',
    initials: 'SQ',
    accent: 'bg-blue-500',
    env: 'dev',
  },
  {
    id: 'api-workflow',
    name: 'Workflow API',
    description: 'Workflow runs, analyses and execution state.',
    kind: 'api',
    url: 'https://workflow.dev.umccr.org/schema/swagger-ui/#/',
    initials: 'WF',
    accent: 'bg-indigo-500',
    env: 'dev',
  },
  {
    id: 'api-file',
    name: 'File API',
    description: 'Stored objects and their locations.',
    kind: 'api',
    url: 'https://file.dev.umccr.org/schema/swagger-ui/#/',
    initials: 'FL',
    accent: 'bg-teal-600',
    env: 'dev',
  },
  {
    id: 'api-fastq',
    name: 'Fastq API',
    description: 'FASTQ sets and read-level records.',
    kind: 'api',
    url: 'https://fastq.dev.umccr.org/schema/swagger-ui#/',
    initials: 'FQ',
    accent: 'bg-teal-500',
    env: 'dev',
  },
  {
    id: 'api-case',
    name: 'Case API',
    description: 'Cases tying lab, run and workflow data together.',
    kind: 'api',
    url: 'https://case.dev.umccr.org/schema/swagger-ui/#/',
    initials: 'CS',
    accent: 'bg-violet-600',
    env: 'dev',
  },
  {
    id: 'api-deploy-status',
    name: 'Deploy Status API',
    description: 'Deployment state behind Deployment Pulse.',
    kind: 'api',
    url: 'https://deploy-status.prod.umccr.org/schema/swagger-ui#/',
    initials: 'DS',
    accent: 'bg-emerald-600',
    env: 'prod',
  },

  // --- Organisation ---------------------------------------------------------
  {
    id: 'umccr-site',
    name: 'UMCCR',
    description: 'The Centre’s public site — research groups, people and news.',
    kind: 'web',
    url: 'https://umccr.org/',
    initials: 'UM',
    accent: 'bg-sky-700',
  },
  {
    id: 'umccr-about',
    name: 'About UMCCR',
    description: 'What the Centre does, how it is organised, and the work it supports.',
    kind: 'web',
    url: 'https://umccr.org/about/',
    initials: 'AB',
    accent: 'bg-sky-600',
  },
  {
    id: 'collaborative-centre',
    name: 'Collaborative Centre for Genomic Cancer Medicine',
    description: 'Joint University of Melbourne and Peter MacCallum Cancer Centre venture.',
    kind: 'web',
    url: 'https://genomic-cancer-medicine.unimelb.edu.au/',
    initials: 'CC',
    accent: 'bg-indigo-600',
  },
];

/** `all` means "no kind filter", not a kind of its own. */
export type CatalogFilter = CatalogKind | 'all';

export interface CatalogGroup {
  kind: CatalogKind;
  heading: string;
  blurb: string;
  entries: CatalogEntry[];
}

/**
 * Applies the search box and kind filter, then buckets what survives into the
 * `CATALOG_KINDS` sections. Empty sections are dropped so the page never shows
 * a heading with nothing under it.
 *
 * Search matches name, description and kind so that typing "tool" or "docs"
 * both work — users reach for either the category or a word they remember.
 */
export function groupCatalog(
  search: string,
  filter: CatalogFilter,
  entries: CatalogEntry[] = CATALOG
): CatalogGroup[] {
  const query = search.trim().toLowerCase();

  const matches = entries.filter((entry) => {
    if (filter !== 'all' && entry.kind !== filter) return false;
    if (!query) return true;
    return (
      entry.name.toLowerCase().includes(query) ||
      entry.description.toLowerCase().includes(query) ||
      entry.kind.includes(query)
    );
  });

  return CATALOG_KINDS.map(({ kind, heading, blurb }) => ({
    kind,
    heading,
    blurb,
    entries: matches.filter((entry) => entry.kind === kind),
  })).filter((group) => group.entries.length > 0);
}
