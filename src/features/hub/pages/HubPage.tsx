import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import { ArrowRight, LayoutGrid, Search } from 'lucide-react';
import { useAuthContext } from '@/context/auth-context';
import { useAppShellHeader } from '@/context/app-shell-context';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CATALOG_KINDS, groupCatalog, type CatalogFilter } from '../data/catalog';
import { ORG, ORG_LINKS } from '../data/organisation';
import { CatalogCard } from '../components/CatalogCard';
import { OrgLinkCard } from '../components/OrgLinkCard';

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
      {/* Welcome + what this place is */}
      <header className='mb-6'>
        <h2 className='text-lg font-semibold text-slate-900 dark:text-white'>
          Welcome{user?.name ? `, ${user.name}` : ''}
        </h2>
        <p className='text-muted-foreground mt-1 max-w-3xl text-sm leading-relaxed'>
          One place for the apps, tools, projects and sites used across {ORG.shortName} — the{' '}
          {ORG.name}. Everything below opens in its own tab; contact your administrator if you are
          missing access to something you need.
        </p>
      </header>

      {/* Organisation strip — the "overview centre" half of the Hub */}
      <section
        aria-labelledby='org-heading'
        className='mb-8 rounded-xl border border-slate-200 bg-white p-5 dark:border-[#2d3540] dark:bg-[#111418]'
      >
        <div className='flex flex-wrap items-start justify-between gap-3'>
          <div className='min-w-0'>
            <h3 id='org-heading' className='text-sm font-semibold text-slate-900 dark:text-white'>
              About {ORG.shortName}
            </h3>
            <p className='text-muted-foreground mt-1 max-w-2xl text-xs leading-relaxed'>
              {ORG.mission}
            </p>
          </div>
          <Button asChild variant='outline' size='sm'>
            <Link to='/about'>
              Organisation overview
              <ArrowRight className='h-4 w-4' />
            </Link>
          </Button>
        </div>

        <div className='mt-4 grid gap-3 sm:grid-cols-2'>
          {ORG_LINKS.map((link) => (
            <OrgLinkCard key={link.id} link={link} />
          ))}
        </div>
      </section>

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
