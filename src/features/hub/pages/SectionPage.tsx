import { useMemo } from 'react';
import { Boxes } from 'lucide-react';
import { useAppShellHeader } from '@/context/app-shell-context';
import { CATALOG_SECTIONS, entriesInSection, type CatalogSection } from '../data/catalog';
import { CatalogBrowser } from '../components/CatalogBrowser';

/**
 * One platform's slice of the catalogue. Same browser as the Overview, handed a
 * narrower set of entries — there is no separate layout to keep in step.
 */
export function SectionPage({ section }: { section: CatalogSection }) {
  const meta = CATALOG_SECTIONS.find((candidate) => candidate.section === section)!;
  const entries = useMemo(() => entriesInSection(section), [section]);

  const headerConfig = useMemo(
    () => ({
      mode: 'main' as const,
      title: meta.label,
      icon: <Boxes className='h-6 w-6' />,
    }),
    [meta.label]
  );

  useAppShellHeader(headerConfig);

  return (
    <div className='px-6 py-6'>
      <header className='mb-6'>
        <h2 className='text-lg font-semibold text-slate-900 dark:text-white'>{meta.label}</h2>
        <p className='text-muted-foreground mt-1 max-w-3xl text-sm leading-relaxed'>{meta.blurb}</p>
      </header>

      <CatalogBrowser entries={entries} searchPlaceholder={`Search ${meta.label}`} />
    </div>
  );
}
