import { ArrowUpRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { PillTag } from '@/components/ui/PillTag';
import { ENV_BADGE_STYLES } from '@/components/ui/env-badge';
import type { CatalogEntry } from '../data/catalog';

/**
 * One entry in the Hub catalogue. Every destination is a separate application,
 * so these always open in a new tab and always say so — the arrow is the
 * affordance, `local` is the warning.
 */
export function CatalogCard({ entry }: { entry: CatalogEntry }) {
  return (
    <a
      href={entry.url}
      target='_blank'
      rel='noopener noreferrer'
      className='group focus-visible:ring-ring/40 block rounded-xl focus-visible:ring-2 focus-visible:outline-none'
    >
      <Card className='h-full gap-0 border-slate-200 p-4 transition-shadow group-hover:shadow-md dark:border-[#2d3540]'>
        <div className='flex items-start gap-3'>
          <div
            aria-hidden='true'
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white ${entry.accent}`}
          >
            {entry.initials}
          </div>

          <div className='min-w-0 flex-1'>
            <div className='flex items-start gap-1.5'>
              <span className='min-w-0 flex-1 text-sm leading-snug font-medium text-slate-900 dark:text-white'>
                {entry.name}
              </span>
              <ArrowUpRight
                aria-hidden='true'
                className='mt-0.5 h-4 w-4 shrink-0 text-slate-400 transition-colors group-hover:text-blue-600 dark:text-[#9dabb9]/60 dark:group-hover:text-blue-400'
              />
            </div>

            {(entry.local || entry.env) && (
              <div className='mt-1.5 flex flex-wrap items-center gap-1.5'>
                {entry.local && <PillTag variant='amber'>Local</PillTag>}
                {entry.env && (
                  <span
                    className={`text-caption rounded-full px-2 py-0.5 font-semibold tracking-wider uppercase ${ENV_BADGE_STYLES[entry.env]}`}
                  >
                    {entry.env}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        <p className='text-muted-foreground mt-3 text-xs leading-relaxed'>{entry.description}</p>
      </Card>
    </a>
  );
}
