import { useMemo, useState, type ReactNode } from 'react';
import { LayoutGrid, Search } from 'lucide-react';
import { useAuthContext } from '@/context/auth-context';
import { useAppShellHeader } from '@/context/app-shell-context';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CATALOG_KINDS, groupCatalog, type CatalogFilter } from '../data/catalog';
import {
  COLLABORATIVE_CENTRE,
  COLLABORATIVE_CENTRE_LINK,
  ORG,
  UMCCR_LINK,
  type OrgLink,
} from '../data/organisation';
import { CatalogCard } from '../components/CatalogCard';

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
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<CatalogFilter>('all');

  const headerConfig = useMemo(
    () => ({
      mode: 'main' as const,
      title: 'Hub',
      icon: <LayoutGrid className='h-6 w-6' />,
    }),
    []
  );

  useAppShellHeader(headerConfig);

  const groups = useMemo(() => groupCatalog(search, filter), [search, filter]);

  const resultCount = groups.reduce((total, group) => total + group.entries.length, 0);

  const filters: { value: CatalogFilter; label: string }[] = [
    { value: 'all', label: 'All' },
    ...CATALOG_KINDS.map((group) => ({ value: group.kind, label: group.heading })),
  ];

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
        <p className='text-muted-foreground mt-2 max-w-3xl text-sm leading-relaxed'>
          {ORG.shortName} works to {ORG.purpose}. This Hub is the way in to the systems behind that
          work — lab metadata, sequencing runs, pipelines and the data they produce. Everything
          opens in a new tab.
        </p>
      </header>

      {/* Catalogue controls */}
      <div className='mb-5 flex flex-wrap items-center gap-3'>
        <div className='relative w-full max-w-sm'>
          <Search
            aria-hidden='true'
            className='text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2'
          />
          <Input
            type='search'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder='Search apps, tools and projects'
            aria-label='Search the catalogue'
            className='pl-9'
          />
        </div>

        <div className='flex flex-wrap gap-1.5'>
          {filters.map((option) => (
            <Button
              key={option.value}
              type='button'
              size='sm'
              variant={filter === option.value ? 'default' : 'outline'}
              aria-pressed={filter === option.value}
              onClick={() => setFilter(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Catalogue */}
      {groups.map((group) => {
        const Icon = CATALOG_KINDS.find((k) => k.kind === group.kind)!.icon;
        return (
          <section key={group.kind} className='mb-8' aria-labelledby={`group-${group.kind}`}>
            <div className='mb-3 flex items-center gap-2'>
              <Icon aria-hidden='true' className='h-4 w-4 text-slate-400 dark:text-[#9dabb9]' />
              <h3
                id={`group-${group.kind}`}
                className='text-sm font-semibold text-slate-900 dark:text-white'
              >
                {group.heading}
              </h3>
              <span className='text-muted-foreground text-xs'>{group.blurb}</span>
            </div>

            <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
              {group.entries.map((entry) => (
                <CatalogCard key={entry.id} entry={entry} />
              ))}
            </div>
          </section>
        );
      })}

      {resultCount === 0 && (
        <p className='text-muted-foreground mt-10 text-center text-sm'>
          Nothing matches {search.trim() ? `“${search.trim()}”` : 'that filter'}.
        </p>
      )}
    </div>
  );
}
