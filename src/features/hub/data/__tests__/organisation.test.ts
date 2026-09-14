import { describe, expect, it } from 'vitest';
import { CATALOG } from '../catalog';
import { COLLABORATIVE_CENTRE, ORG, ORG_LINKS } from '../organisation';

describe('ORG_LINKS', () => {
  it('covers both public organisation sites', () => {
    expect(ORG_LINKS.map((l) => l.url)).toEqual([
      'https://umccr.org/about/',
      'https://genomic-cancer-medicine.unimelb.edu.au/',
    ]);
  });

  it('states a host that actually matches the url, so the hint is not misleading', () => {
    for (const link of ORG_LINKS) {
      expect(new URL(link.url).host).toBe(link.host);
    }
  });

  it('uses https for every outbound link', () => {
    for (const link of ORG_LINKS) {
      expect(new URL(link.url).protocol).toBe('https:');
    }
  });

  it('has unique ids', () => {
    const ids = ORG_LINKS.map((l) => l.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('is also reachable from the catalogue, so both surfaces agree', () => {
    const catalogUrls = new Set(CATALOG.map((e) => e.url));
    for (const link of ORG_LINKS) {
      expect(catalogUrls.has(link.url)).toBe(true);
    }
  });
});

describe('organisation copy', () => {
  it('names the centre in full', () => {
    expect(ORG.name).toBe('University of Melbourne Centre for Cancer Research');
    expect(ORG.shortName).toBe('UMCCR');
  });

  it('derives the mission sentence from the purpose phrase, so the two cannot drift', () => {
    expect(ORG.mission).toBe(`To ${ORG.purpose}.`);
    expect(ORG.purpose).not.toMatch(/^To /);
    expect(ORG.purpose).not.toMatch(/\.$/);
  });

  it('names both institutions behind the partner centre', () => {
    expect(COLLABORATIVE_CENTRE.partnership).toContain('University of Melbourne');
    expect(COLLABORATIVE_CENTRE.partnership).toContain('Peter MacCallum');
  });

  it('carries a mission, a summary and supporting facts', () => {
    expect(ORG.mission.length).toBeGreaterThan(0);
    expect(ORG.summary.length).toBeGreaterThan(0);
    expect(ORG.facts.length).toBeGreaterThan(0);
  });

  it('describes the partner centre and both its partners', () => {
    expect(COLLABORATIVE_CENTRE.name).toContain('Collaborative Centre');
    expect(COLLABORATIVE_CENTRE.summary).toContain('University of Melbourne');
    expect(COLLABORATIVE_CENTRE.summary).toContain('Peter MacCallum');
  });

  it('gives every fact both a label and a value', () => {
    for (const fact of [...ORG.facts, ...COLLABORATIVE_CENTRE.facts]) {
      expect(fact.label.length).toBeGreaterThan(0);
      expect(fact.value.length).toBeGreaterThan(0);
    }
  });
});
