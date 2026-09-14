import { useLocation } from 'react-router';
import {
  CircleQuestionMark,
  LayoutGrid,
  PanelLeftClose,
  PanelLeftOpen,
  type LucideIcon,
} from 'lucide-react';
import { SidebarNavLink } from './SidebarNavLink';
import { useAppShell } from '../../context/app-shell-context';

interface PrimaryNavItem {
  path: string;
  label: string;
  icon: LucideIcon;
  sublabel?: string;
}

const navItems: PrimaryNavItem[] = [{ path: '/', label: 'Hub', icon: LayoutGrid }];

// Sits above the collapse control rather than in the main nav: it is reference
// material about the organisation, not somewhere you work.
const footerNavItems: PrimaryNavItem[] = [
  { path: '/about', label: 'About us', icon: CircleQuestionMark },
];

function isNavItemActive(pathname: string, path: string) {
  if (path === '/') return pathname === '/';
  return pathname.startsWith(path);
}

export function Sidebar() {
  const location = useLocation();
  const { isSidebarCollapsed: isCollapsed, toggleSidebar } = useAppShell();

  return (
    <aside
      className={`${isCollapsed ? 'w-16' : 'w-48'} flex shrink-0 flex-col border-r border-slate-200 bg-white transition-all duration-300 dark:border-[#2d3540] dark:bg-[#111418]`}
    >
      <div className={`flex items-center p-4 ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
        <div className='bg-primary dark:shadow-primary/20 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg shadow-lg'>
          <LayoutGrid className='text-primary-foreground h-5 w-5' />
        </div>
        {!isCollapsed && (
          <div>
            <div className='text-sm leading-tight font-bold text-slate-900 dark:text-white'>
              UMCCR
            </div>
            <div className='text-caption mt-0.5 leading-tight font-semibold tracking-wider text-slate-400 uppercase dark:text-[#9dabb9]/60'>
              HUB
            </div>
          </div>
        )}
      </div>

      <nav className='flex-1 space-y-0.5 p-3'>
        {navItems.map((item) => {
          const active = isNavItemActive(location.pathname, item.path);
          return (
            <SidebarNavLink
              key={item.path}
              to={item.path}
              label={item.label}
              sublabel={item.sublabel}
              icon={item.icon}
              active={active}
              collapsed={isCollapsed}
            />
          );
        })}
      </nav>

      <div
        className={`space-y-0.5 border-t border-slate-200 p-3 dark:border-[#2d3540] ${isCollapsed ? 'text-center' : ''}`}
      >
        {footerNavItems.map((item) => (
          <SidebarNavLink
            key={item.path}
            to={item.path}
            label={item.label}
            sublabel={item.sublabel}
            icon={item.icon}
            active={isNavItemActive(location.pathname, item.path)}
            collapsed={isCollapsed}
          />
        ))}

        <button
          type='button'
          onClick={toggleSidebar}
          className='flex w-full items-center justify-center gap-2 rounded-md p-2 text-slate-500 transition-colors hover:bg-slate-100 dark:text-[#9dabb9] dark:hover:bg-[#1e252e]'
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <PanelLeftOpen className='h-4 w-4' />
          ) : (
            <>
              <PanelLeftClose className='h-4 w-4' />
              <span className='text-xs'>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
