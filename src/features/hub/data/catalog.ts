import { AppWindow, FolderGit2, Globe, Wrench, type LucideIcon } from 'lucide-react';

/**
 * What the Hub catalogues. The four kinds are deliberately coarse — they answer
 * "what am I about to open?", not "which team owns it":
 *
 *  - `app`     a console you work in (sign in, read and change data)
 *  - `tool`    a single-purpose utility you run and leave
 *  - `project` a codebase or its documentation
 *  - `web`     an organisation-facing site
 */
export type CatalogKind = 'app' | 'tool' | 'project' | 'web';

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
    blurb: 'Codebases and their documentation.',
    icon: FolderGit2,
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
  {
    id: 'github-dashboard',
    name: 'GitHub Dashboard',
    description: 'Dashboard for managing and monitoring the organisation’s repositories.',
    kind: 'app',
    url: 'http://localhost:5173/',
    initials: 'GH',
    accent: 'bg-slate-800',
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
    id: 'guardians-docs',
    name: 'Guardians Docs',
    description: 'Documentation for the Guardians project.',
    kind: 'project',
    url: 'https://umccr.github.io/guardians-doc/',
    initials: 'GD',
    accent: 'bg-purple-600',
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
