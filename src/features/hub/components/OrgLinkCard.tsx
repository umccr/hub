import { ExternalLink } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import type { OrgLink } from '../data/organisation';

/**
 * A pointer out to one of the organisation's public sites. Shows the host
 * because these leave the Hub for a site the reader may not recognise by name.
 */
export function OrgLinkCard({ link }: { link: OrgLink }) {
  return (
    <a
      href={link.url}
      target='_blank'
      rel='noopener noreferrer'
      className='group focus-visible:ring-ring/40 block rounded-xl focus-visible:ring-2 focus-visible:outline-none'
    >
      <Card className='h-full gap-0 border-slate-200 p-4 transition-shadow group-hover:shadow-md dark:border-[#2d3540]'>
        <div className='flex items-start justify-between gap-3'>
          <span className='text-sm font-medium text-slate-900 dark:text-white'>{link.label}</span>
          <ExternalLink
            aria-hidden='true'
            className='mt-0.5 h-4 w-4 shrink-0 text-slate-400 transition-colors group-hover:text-blue-600 dark:text-[#9dabb9]/60 dark:group-hover:text-blue-400'
          />
        </div>
        <p className='text-muted-foreground mt-2 text-xs leading-relaxed'>{link.description}</p>
        <p className='text-caption mt-3 font-medium text-slate-400 dark:text-[#9dabb9]/60'>
          {link.host}
        </p>
      </Card>
    </a>
  );
}
