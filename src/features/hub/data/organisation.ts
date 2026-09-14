/**
 * Organisation reference data for the Hub's overview surfaces.
 *
 * Everything here is sourced from the public UMCCR and Collaborative Centre
 * sites linked in `ORG_LINKS`. Keep it that way: this file is the Hub's
 * "about us" copy, so it should stay verifiable against those pages rather
 * than drifting into figures nobody can check.
 */

export interface OrgLink {
  id: string;
  /** Short label used on cards and buttons. */
  label: string;
  /** One line on what the reader will find there. */
  description: string;
  url: string;
  /** Host shown to the user so an external hop is obvious before they click. */
  host: string;
}

export const UMCCR_LINK: OrgLink = {
  id: 'umccr-about',
  label: 'About UMCCR',
  description:
    'Who we are, the research groups, and how the Centre is organised at the University of Melbourne.',
  url: 'https://umccr.org/about/',
  host: 'umccr.org',
};

export const COLLABORATIVE_CENTRE_LINK: OrgLink = {
  id: 'collaborative-centre',
  label: 'Collaborative Centre for Genomic Cancer Medicine',
  description:
    'The joint University of Melbourne and Peter MacCallum Cancer Centre venture our work sits within.',
  url: 'https://genomic-cancer-medicine.unimelb.edu.au/',
  host: 'genomic-cancer-medicine.unimelb.edu.au',
};

/** The two public sites that introduce the organisation. */
export const ORG_LINKS: OrgLink[] = [UMCCR_LINK, COLLABORATIVE_CENTRE_LINK];

export const ORG = {
  shortName: 'UMCCR',
  name: 'University of Melbourne Centre for Cancer Research',
  /** Mission statement, as published on umccr.org. */
  mission:
    'To improve cancer patient outcome through genome discovery, translation and personalised medicine.',
  /** Longer-form intro for the organisation overview page. */
  summary:
    'UMCCR brings cancer genomics, computational oncology and clinical research together in the Victorian Comprehensive Cancer Centre, in the Melbourne Biomedical Precinct. Its Genomics Platform Group develops, tests and applies accredited bioinformatics workflows to patient data and large-scale research projects — the pipelines and data that most of the tools in this Hub are built around.',
  facts: [
    { label: 'Centre', value: 'University of Melbourne Centre for Cancer Research' },
    { label: 'Precinct', value: 'Victorian Comprehensive Cancer Centre, Melbourne' },
    { label: 'Footprint', value: 'Over 5,000 m², built for 260+ researchers' },
  ],
} as const;

export const COLLABORATIVE_CENTRE = {
  name: 'Collaborative Centre for Genomic Cancer Medicine',
  /** How the partnership is described in one clause, for inline prose. */
  partnership: 'a University of Melbourne and Peter MacCallum Cancer Centre joint venture',
  summary:
    'A joint venture between the University of Melbourne and Peter MacCallum Cancer Centre, bringing leaders in cancer care and genomic research into one interdisciplinary centre in the Melbourne Biomedical Precinct.',
  scope:
    'Its work spans the full arc of the disease: early detection and genetic-risk prediction through to better diagnosis and treatment, via both new technology and discovery-driven research.',
  facts: [
    { label: 'Partners', value: 'University of Melbourne · Peter MacCallum Cancer Centre' },
    { label: 'Scale', value: '15 research groups, 200+ researchers' },
    { label: 'Location', value: 'Melbourne Biomedical Precinct' },
  ],
} as const;
