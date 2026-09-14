import { Card } from '@/components/ui/Card';
import type { HubApp } from '../data/apps.mock';

export function AppTile({ app }: { app: HubApp }) {
  return (
    <a href={app.url} target='_blank' rel='noopener noreferrer' className='group block'>
      <Card className='h-full items-center gap-3 border-slate-200 p-4 text-center transition-shadow group-hover:shadow-md dark:border-[#2d3540]'>
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white ${app.logoColor}`}
        >
          {app.initials}
        </div>
        <div className='min-w-0'>
          <div className='truncate text-sm font-medium text-slate-900 dark:text-white'>
            {app.name}
          </div>
          <div className='text-muted-foreground mt-0.5 text-xs'>{app.category}</div>
        </div>
      </Card>
    </a>
  );
}
