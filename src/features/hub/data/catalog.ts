import {
  AppWindow,
  BookOpen,
  Braces,
  FolderGit2,
  Globe,
  Wrench,
  type LucideIcon,
} from 'lucide-react';
import type { AppEnvironment, DeployedEnvironment } from '@/context/environment-context';
import { ENVIRONMENT_HOSTNAMES } from '@/context/environment-resolver';

/**
 * What the Hub catalogues. The kinds are deliberately coarse — they answer
 * "what am I about to open?", not "which team owns it":
 *
 *  - `app`     a console you work in (sign in, read and change data)
 *  - `tool`    a single-purpose utility or library you run against
 *  - `project` a source repository
 *  - `docs`    written documentation you read
 *  - `api`     a service's OpenAPI/Swagger reference
 *  - `web`     an organisation-facing site
 */
export type CatalogKind = 'app' | 'tool' | 'project' | 'docs' | 'api' | 'web';

/**
 * Which platform an entry belongs to. Orthogonal to `kind`: OrcaBus has apps,
 * tools and APIs, and so does OrcaHouse. Entries that belong to neither (the
 * organisation sites, general-purpose libraries) simply leave it unset and only
 * appear on the Overview.
 */
export type CatalogSection = 'orcabus' | 'orcahouse';

export interface CatalogEntry {
  id: string;
  name: string;
  description: string;
  kind: CatalogKind;
  /**
   * Destination. Two placeholders are resolved against the environment the Hub
   * is running in, so a link never sends you to the wrong deployment:
   *
   *  - `{env}`    → `dev` | `stg` | `prod`, for `service.{env}.umccr.org` hosts
   *  - `{portal}` → the portal hostname, which is `portal.umccr.org` in prod
   *                 rather than `portal.prod.umccr.org`
   *
   * A URL with neither placeholder is used exactly as written.
   */
  url: string;
  section?: CatalogSection;
  /** Two-letter monogram for the tile. */
  initials: string;
  /** Tailwind background class for the monogram tile. */
  accent: string;
  /** Points at a dev server rather than a deployed host — flagged in the UI so
   *  nobody files a bug when it fails to load from another machine. */
  local?: boolean;
}

export const CATALOG_SECTIONS: {
  section: CatalogSection;
  /** Display name, and the sidebar label. */
  label: string;
  /** Route path, without the router basename. */
  path: string;
  blurb: string;
}[] = [
  {
    section: 'orcabus',
    label: 'OrcaBus',
    path: '/orcabus',
    blurb:
      'The pipeline platform — LIMS consoles, operational tools and the service APIs behind them.',
  },
  {
    section: 'orcahouse',
    label: 'OrcaHouse',
    path: '/orcahouse',
    blurb: 'The data warehouse — consumer tables and the dbt models that build them.',
  },
];

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
    blurb: 'Utilities and libraries used around the pipelines.',
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
    url: 'https://{portal}/',
    section: 'orcabus',
    initials: 'OL',
    accent: 'bg-blue-600',
  },
  {
    id: 'orcabus-lims-v2',
    name: 'Orcabus LIMS v2',
    description: 'The rebuilt LIMS console — cases, lab metadata, runs, workflows and vault.',
    kind: 'app',
    url: 'https://{portal}/v2/',
    section: 'orcabus',
    initials: 'L2',
    accent: 'bg-emerald-600',
  },
  {
    id: 'orcahouse-mart',
    name: 'OrcaHouse Mart',
    description: 'Consumer-facing tables of the OrcaHouse data warehouse.',
    kind: 'app',
    url: 'http://localhost:3002/',
    section: 'orcahouse',
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
    url: 'https://{portal}/v2/tools/deploy-status',
    section: 'orcabus',
    initials: 'DP',
    accent: 'bg-emerald-600',
  },
  {
    id: 'samplesheet-checker',
    name: 'Samplesheet Checker',
    description: 'Validate sequencing sample sheets before committing a run.',
    kind: 'tool',
    url: 'https://{portal}/v2/tools/ss-check',
    section: 'orcabus',
    initials: 'SS',
    accent: 'bg-amber-500',
  },
  {
    id: 'wrapica',
    name: 'wrapica',
    description: 'Python wrapper around the ICA v2 API.',
    kind: 'tool',
    url: 'https://wrapica.readthedocs.io/en/latest/',
    initials: 'WR',
    accent: 'bg-cyan-600',
  },
  {
    id: 'libica',
    name: 'libica',
    description: 'OpenAPI client library for the ICA API.',
    kind: 'tool',
    url: 'https://umccr.github.io/libica/openapi/',
    initials: 'LI',
    accent: 'bg-cyan-700',
  },
  {
    id: 'rnasum',
    name: 'RNAsum',
    description: 'RNA-seq summary reporting.',
    kind: 'tool',
    url: 'https://umccr.github.io/RNAsum/',
    initials: 'RS',
    accent: 'bg-pink-600',
  },

  // --- Projects -------------------------------------------------------------
  {
    id: 'orcabus-github',
    name: 'OrcaBus on GitHub',
    description: 'Source for the OrcaBus platform — microservices, pipelines and infrastructure.',
    kind: 'project',
    url: 'https://github.com/OrcaBus',
    section: 'orcabus',
    initials: 'OB',
    accent: 'bg-slate-700',
  },
  {
    id: 'github-dashboard',
    name: 'GitHub Dashboard',
    description: 'Browse and monitor the organisation’s repositories.',
    kind: 'project',
    url: 'https://umccr.github.io/github-portfolio-dashboard/',
    initials: 'GH',
    accent: 'bg-slate-800',
  },
  {
    id: 'umccr-github',
    name: 'UMCCR on GitHub',
    description: 'Source for the pipelines, infrastructure and apps behind this Hub.',
    kind: 'project',
    url: 'https://github.com/umccr',
    initials: 'GT',
    accent: 'bg-slate-600',
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
    section: 'orcahouse',
    initials: 'DB',
    accent: 'bg-orange-600',
  },
  {
    id: 'orcavault-docs',
    name: 'OrcaVault',
    description: 'dbt documentation for the OrcaVault models.',
    kind: 'docs',
    url: 'https://umccr.github.io/orcahouse-doc/dbt/orcavault/#!/overview',
    section: 'orcahouse',
    initials: 'OV',
    accent: 'bg-orange-500',
  },

  // --- API references -------------------------------------------------------
  {
    id: 'api-metadata',
    name: 'Metadata API',
    description: 'Subjects, samples, libraries and projects — the lab metadata service.',
    kind: 'api',
    url: 'https://metadata.{env}.umccr.org/schema/swagger-ui/#/',
    section: 'orcabus',
    initials: 'MD',
    accent: 'bg-blue-600',
  },
  {
    id: 'api-sequence',
    name: 'Sequence API',
    description: 'Sequencing runs and their state.',
    kind: 'api',
    url: 'https://sequence.{env}.umccr.org/schema/swagger-ui/#/',
    section: 'orcabus',
    initials: 'SQ',
    accent: 'bg-blue-500',
  },
  {
    id: 'api-workflow',
    name: 'Workflow API',
    description: 'Workflow runs, analyses and execution state.',
    kind: 'api',
    url: 'https://workflow.{env}.umccr.org/schema/swagger-ui/#/',
    section: 'orcabus',
    initials: 'WF',
    accent: 'bg-indigo-500',
  },
  {
    id: 'api-file',
    name: 'File API',
    description: 'Stored objects and their locations.',
    kind: 'api',
    url: 'https://file.{env}.umccr.org/schema/swagger-ui/#/',
    section: 'orcabus',
    initials: 'FL',
    accent: 'bg-teal-600',
  },
  {
    id: 'api-fastq',
    name: 'Fastq API',
    description: 'FASTQ sets and read-level records.',
    kind: 'api',
    url: 'https://fastq.{env}.umccr.org/schema/swagger-ui#/',
    section: 'orcabus',
    initials: 'FQ',
    accent: 'bg-teal-500',
  },
  {
    id: 'api-case',
    name: 'Case API',
    description: 'Cases tying lab, run and workflow data together.',
    kind: 'api',
    url: 'https://case.{env}.umccr.org/schema/swagger-ui/#/',
    section: 'orcabus',
    initials: 'CS',
    accent: 'bg-violet-600',
  },
  {
    id: 'api-deploy-status',
    name: 'Deploy Status API',
    description: 'Deployment state behind Deployment Pulse.',
    kind: 'api',
    // Pinned to prod, not `{env}`: this is the only service supplied as a prod
    // URL, which reads as "it only runs there". Switch it to `{env}` if a dev
    // deployment exists.
    url: 'https://deploy-status.prod.umccr.org/schema/swagger-ui#/',
    section: 'orcabus',
    initials: 'DS',
    accent: 'bg-emerald-600',
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

// --- Environment resolution --------------------------------------------------

/**
 * Which deployment the catalogue should point at. There is no local deployment
 * of these services, so running the Hub locally targets dev — the same rule
 * `isDevEnvironment` already applies elsewhere.
 */
export function catalogEnvironment(environment: AppEnvironment): DeployedEnvironment {
  return environment === 'local' ? 'dev' : environment;
}

/** Fills in the `{env}` and `{portal}` placeholders for the current environment. */
export function resolveCatalogUrl(url: string, environment: AppEnvironment): string {
  const target = catalogEnvironment(environment);
  return url.replaceAll('{env}', target).replaceAll('{portal}', ENVIRONMENT_HOSTNAMES[target]);
}

const UMCCR_ENV_HOST = /^[a-z0-9-]+\.(dev|stg|prod)\.umccr\.org$/;

/**
 * Which deployment a resolved URL actually reaches, for the tile badge. Read
 * back off the hostname rather than stored per entry, so the badge cannot
 * disagree with the link it sits on. Returns undefined for hosts that are not
 * environment-specific (GitHub, readthedocs, umccr.org).
 */
export function resolveCatalogEnv(resolvedUrl: string): DeployedEnvironment | undefined {
  let hostname: string;
  try {
    hostname = new URL(resolvedUrl).hostname;
  } catch {
    return undefined;
  }

  const match = UMCCR_ENV_HOST.exec(hostname);
  if (match) return match[1] as DeployedEnvironment;
  // Prod portal drops the environment label entirely.
  if (hostname === ENVIRONMENT_HOSTNAMES.prod) return 'prod';
  return undefined;
}

// --- Filtering and grouping --------------------------------------------------

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

/** Entries belonging to one platform, in catalogue order. */
export function entriesInSection(
  section: CatalogSection,
  entries: CatalogEntry[] = CATALOG
): CatalogEntry[] {
  return entries.filter((entry) => entry.section === section);
}
