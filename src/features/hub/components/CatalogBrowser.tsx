import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  CATALOG_KINDS,
  groupCatalog,
  type CatalogEntry,
  type CatalogFilter,
} from '../data/catalog';
import { CatalogCard } from './CatalogCard';

/**
 * Search, kind filter and the grouped grid. Shared by the Overview and each
 * platform section, which differ only in which entries they hand in — the
 * filter chips narrow to the kinds actually present, so a section never offers
 * a filter that would empty the page.
 */
export function CatalogBrowser({
  entries,
  searchPlaceholder = 'Search apps, tools and docs',
}: {
  entries: CatalogEntry[];
  searchPlaceholder?: string;
}) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<CatalogFilter>('all');

  const groups = useMemo(() => groupCatalog(search, filter, entries), [search, filter, entries]);

  const filters: { value: CatalogFilter; label: string }[] = useMemo(() => {
    const present = new Set(entries.map((entry) => entry.kind));
    return [
      { value: 'all', label: 'All' },
      ...CATALOG_KINDS.filter((kind) => present.has(kind.kind)).map((kind) => ({
        value: kind.kind,
        label: kind.heading,
      })),
    ];
  }, [entries]);

  const resultCount = groups.reduce((total, group) => total + group.entries.length, 0);

  return (
    <>
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
            placeholder={searchPlaceholder}
            aria-label='Search the catalogue'
            className='pl-9'
          />
        </div>

        {filters.length > 2 && (
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
        )}
      </div>

      {groups.map((group) => {
        const Icon = CATALOG_KINDS.find((kind) => kind.kind === group.kind)!.icon;
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
    </>
  );
}
