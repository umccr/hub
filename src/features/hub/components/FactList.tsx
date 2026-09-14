/**
 * Label/value pairs used by the organisation panels. Rendered as a description
 * list so the pairing survives for screen readers, not just visually.
 */
export function FactList({ facts }: { facts: readonly { label: string; value: string }[] }) {
  return (
    <dl className='grid gap-3 sm:grid-cols-3'>
      {facts.map((fact) => (
        <div key={fact.label}>
          <dt className='text-caption font-semibold tracking-wider text-slate-400 uppercase dark:text-[#9dabb9]/60'>
            {fact.label}
          </dt>
          <dd className='mt-1 text-xs leading-relaxed text-slate-700 dark:text-[#9dabb9]'>
            {fact.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
