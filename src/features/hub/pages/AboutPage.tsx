import { useMemo } from 'react';
import { Building2, ExternalLink } from 'lucide-react';
import { useAppShellHeader } from '@/context/app-shell-context';
import { Button } from '@/components/ui/Button';
import { Separator } from '@/components/ui/Separator';
import { COLLABORATIVE_CENTRE, ORG, ORG_LINKS } from '../data/organisation';
import { FactList } from '../components/FactList';

/**
 * The Hub's organisation overview: who UMCCR is, the Collaborative Centre it
 * works within, and the public pages that carry the full story. Deliberately
 * short — this orients someone new, then hands off to the real sites.
 */
export function AboutPage() {
  const headerConfig = useMemo(
    () => ({
      mode: 'main' as const,
      title: 'Organisation',
      icon: <Building2 className='h-6 w-6' />,
    }),
    []
  );

  useAppShellHeader(headerConfig);

  return (
    <div className='px-6 py-6'>
      <div className='max-w-4xl'>
        {/* UMCCR */}
        <section aria-labelledby='umccr-heading'>
          <p className='text-caption font-semibold tracking-wider text-slate-400 uppercase dark:text-[#9dabb9]/60'>
            {ORG.shortName}
          </p>
          <h2
            id='umccr-heading'
            className='mt-1 text-xl font-bold tracking-tight text-slate-900 dark:text-white'
          >
            {ORG.name}
          </h2>
          <p className='mt-3 text-sm leading-relaxed font-medium text-slate-700 dark:text-[#9dabb9]'>
            {ORG.mission}
          </p>
          <p className='text-muted-foreground mt-3 text-sm leading-relaxed'>{ORG.summary}</p>

          <div className='mt-5'>
            <FactList facts={ORG.facts} />
          </div>
        </section>

        <Separator className='my-8' />

        {/* Collaborative Centre */}
        <section aria-labelledby='centre-heading'>
          <p className='text-caption font-semibold tracking-wider text-slate-400 uppercase dark:text-[#9dabb9]/60'>
            Partner centre
          </p>
          <h2
            id='centre-heading'
            className='mt-1 text-lg font-bold tracking-tight text-slate-900 dark:text-white'
          >
            {COLLABORATIVE_CENTRE.name}
          </h2>
          <p className='text-muted-foreground mt-3 text-sm leading-relaxed'>
            {COLLABORATIVE_CENTRE.summary}
          </p>
          <p className='text-muted-foreground mt-3 text-sm leading-relaxed'>
            {COLLABORATIVE_CENTRE.scope}
          </p>

          <div className='mt-5'>
            <FactList facts={COLLABORATIVE_CENTRE.facts} />
          </div>
        </section>

        <Separator className='my-8' />

        {/* Hand-off to the public sites */}
        <section aria-labelledby='links-heading'>
          <h2 id='links-heading' className='text-sm font-semibold text-slate-900 dark:text-white'>
            Read more
          </h2>
          <p className='text-muted-foreground mt-1 text-sm'>
            The full picture lives on the organisation’s own sites.
          </p>

          <div className='mt-4 flex flex-wrap gap-2'>
            {ORG_LINKS.map((link) => (
              <Button key={link.id} asChild variant='outline' size='sm'>
                <a href={link.url} target='_blank' rel='noopener noreferrer'>
                  {link.label}
                  <ExternalLink className='h-4 w-4' />
                </a>
              </Button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
