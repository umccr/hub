import { useMemo, type ReactNode } from 'react';
import { Link } from 'react-router';
import { ArrowRight, LayoutGrid } from 'lucide-react';
import { useAuthContext } from '@/context/auth-context';
import { useAppShellHeader } from '@/context/app-shell-context';
import { Card } from '@/components/ui/Card';
import { CATALOG, CATALOG_SECTIONS, entriesInSection } from '../data/catalog';
import {
  COLLABORATIVE_CENTRE,
  COLLABORATIVE_CENTRE_LINK,
  ORG,
  UMCCR_LINK,
  type OrgLink,
} from '../data/organisation';
import { CatalogBrowser } from '../components/CatalogBrowser';

function OrgAnchor({ link, children }: { link: OrgLink; children: ReactNode }) {
  return (
    <a
      href={link.url}
      target='_blank'
      rel='noopener noreferrer'
      className='focus-visible:ring-ring/40 rounded-xs font-medium text-blue-600 underline underline-offset-2 hover:text-blue-700 focus-visible:ring-2 focus-visible:outline-none dark:text-blue-400 dark:hover:text-blue-300'
    >
      {children}
    </a>
  );
}

export function HubPage() {
  const { user } = useAuthContext();

  const headerConfig = useMemo(
    () => ({
      mode: 'main' as const,
      title: 'Overview',
      icon: <LayoutGrid className='h-6 w-6' />,
    }),
    []
  );

  useAppShellHeader(headerConfig);

  return (
    <div className='px-6 py-6'>
      {/* Welcome. The organisation links live inline here rather than in a panel
          of their own — they are context for the catalogue, not a section of it. */}
      <header className='mb-6'>
        <h2 className='text-lg font-semibold text-slate-900 dark:text-white'>
          Welcome{user?.name ? `, ${user.name}` : ''}
        </h2>
        <p className='text-muted-foreground mt-1 max-w-3xl text-sm leading-relaxed'>
          Apps, tools, docs and APIs across {ORG.shortName} — the{' '}
          <OrgAnchor link={UMCCR_LINK}>{ORG.name}</OrgAnchor> — and the{' '}
          <OrgAnchor link={COLLABORATIVE_CENTRE_LINK}>{COLLABORATIVE_CENTRE.name}</OrgAnchor>,{' '}
          {COLLABORATIVE_CENTRE.partnership}.
        </p>
      </header>

      {/* Jump-off to the platform sections, which the sidebar also lists. */}
      <div className='mb-8 grid gap-3 sm:grid-cols-2'>
        {CATALOG_SECTIONS.map((section) => (
          <Link
            key={section.section}
            to={section.path}
            className='group focus-visible:ring-ring/40 block rounded-xl focus-visible:ring-2 focus-visible:outline-none'
          >
            <Card className='h-full gap-0 border-slate-200 p-4 transition-shadow group-hover:shadow-md dark:border-[#2d3540]'>
              <div className='flex items-center justify-between gap-3'>
                <span className='text-sm font-semibold text-slate-900 dark:text-white'>
                  {section.label}
                </span>
                <ArrowRight
                  aria-hidden='true'
                  className='h-4 w-4 shrink-0 text-slate-400 transition-colors group-hover:text-blue-600 dark:text-[#9dabb9]/60 dark:group-hover:text-blue-400'
                />
              </div>
              <p className='text-muted-foreground mt-2 text-xs leading-relaxed'>{section.blurb}</p>
              <p className='text-caption mt-3 font-medium text-slate-400 dark:text-[#9dabb9]/60'>
                {entriesInSection(section.section).length} entries
              </p>
            </Card>
          </Link>
        ))}
      </div>

      <CatalogBrowser entries={CATALOG} />
    </div>
  );
}
