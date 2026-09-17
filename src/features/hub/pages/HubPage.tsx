import { useMemo, type ReactNode } from 'react';
import { LayoutGrid } from 'lucide-react';
import { useAuthContext } from '@/context/auth-context';
import { useAppShellHeader } from '@/context/app-shell-context';
import { CATALOG } from '../data/catalog';
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

      <CatalogBrowser entries={CATALOG} />
    </div>
  );
}
