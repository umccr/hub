import { useMemo, useState } from 'react';
import { LayoutGrid, Search } from 'lucide-react';
import { useAuthContext } from '@/context/auth-context';
import { useAppShellHeader } from '@/context/app-shell-context';
import { Input } from '@/components/ui/Input';
import { mockApps } from '../data/apps.mock';
import { AppTile } from '../components/AppTile';

export function HubPage() {
  const { user } = useAuthContext();
  const [search, setSearch] = useState('');

  const headerConfig = useMemo(
    () => ({
      mode: 'main' as const,
      title: 'My Apps',
      icon: <LayoutGrid className='h-6 w-6' />,
    }),
    []
  );

  useAppShellHeader(headerConfig);

  const filteredApps = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return mockApps;
    return mockApps.filter(
      (app) => app.name.toLowerCase().includes(query) || app.category.toLowerCase().includes(query)
    );
  }, [search]);

  return (
    <div className='px-6 py-6'>
      <div className='mb-6'>
        <h2 className='text-lg font-semibold text-slate-900 dark:text-white'>
          Welcome{user?.name ? `, ${user.name}` : ''}
        </h2>
        <p className='text-muted-foreground mt-1 text-sm'>
          Apps below are shown based on your role. Contact your administrator if you're missing
          access to something you need.
        </p>
      </div>

      <div className='relative mb-6 max-w-sm'>
        <Search className='text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder='Search your apps'
          className='pl-9'
        />
      </div>

      <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'>
        {filteredApps.map((app) => (
          <AppTile key={app.id} app={app} />
        ))}
      </div>

      {filteredApps.length === 0 && (
        <p className='text-muted-foreground mt-10 text-center text-sm'>No apps match "{search}".</p>
      )}
    </div>
  );
}
