export interface HubApp {
  id: string;
  name: string;
  description: string;
  category: string;
  url: string;
  logoColor: string;
  initials: string;
}

// Mock data for demo purposes — represents apps a signed-in user can launch,
// similar to an Okta "My Apps" tile grid.
export const mockApps: HubApp[] = [
  {
    id: 'orcabus-lims',
    name: 'Orcabus LIMS',
    description: 'Lab metadata, sequencing runs, and workflow orchestration console.',
    category: 'Genomics',
    url: 'https://portal.dev.umccr.org/',
    logoColor: 'bg-blue-600',
    initials: 'OL',
  },
  {
    id: 'orcabus-lims-v2',
    name: 'Orcabus LIMS v2',
    description: 'Lab metadata, sequencing runs, and workflow orchestration console.',
    category: 'Genomics',
    url: 'https://portal.dev.umccr.org/v2/',
    logoColor: 'bg-emerald-600',
    initials: 'OL',
  },
  {
    id: 'Orcahouse-mart',
    name: 'Orcahouse-mart',
    description: 'Consumer-facing tables of the OrcaHouse data warehouse..',
    category: 'Genomics',
    url: 'http://localhost:3002/',
    logoColor: 'bg-rose-500',
    initials: 'OM',
  },
  {
    id: 'github dashboard',
    name: 'GitHub Dashboard',
    description: 'A dashboard for managing and monitoring GitHub repositories.',
    category: 'Development',
    url: 'http://localhost:5173/',
    logoColor: 'bg-gray-800',
    initials: 'GH',
  },
  {
    id: 'guardians docs',
    name: 'Guardians Docs',
    description: 'Documentation for the Guardians project.',
    category: 'Documentation',
    url: 'https://umccr.github.io/guardians-doc/',
    logoColor: 'bg-purple-600',
    initials: 'GD',
  },
  {
    id: 'deployment-pulse',
    name: 'Deployment Pulse',
    description: 'Live status of deployments across environments.',
    category: 'Operations',
    url: 'https://portal.dev.umccr.org/v2/tools/deploy-status',
    logoColor: 'bg-emerald-600',
    initials: 'DP',
  },
  {
    id: 'sample-sheet-checker',
    name: 'Samplesheet Checker',
    description: 'Validate sequencing sample sheets before a run.',
    category: 'Tools',
    url: 'https://portal.dev.umccr.org/v2/tools/ss-check',
    logoColor: 'bg-amber-500',
    initials: 'SS',
  },
];
