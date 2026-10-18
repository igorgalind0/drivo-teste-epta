'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { cn } from '@/lib/cn';
import { initials } from '@/lib/format';
import { Logo } from './logo';

const NAV = [
  { href: '/veiculos', label: 'Meus veículos' },
  { href: '/perfil', label: 'Perfil' },
];

export function AppHeader() {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-20 bg-bg/80 backdrop-blur-xl">
      <div className="mx-auto grid h-14 max-w-[1440px] grid-cols-[1fr_auto_1fr] items-center px-4 sm:px-10">
        <Link href="/veiculos" aria-label="Drivo — início">
          <Logo />
        </Link>

        {/* Controle segmentado */}
        <nav className="flex rounded-[9px] bg-surface p-0.5">
          {NAV.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'rounded-[7px] px-3 py-1 text-footnote font-medium transition-colors',
                  active
                    ? 'bg-surface-3 text-text-primary'
                    : 'text-text-secondary hover:text-text-primary',
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {user && (
          <Link
            href="/perfil"
            className="flex items-center justify-self-end gap-2.5 text-footnote text-text-secondary hover:text-text-primary"
          >
            <span className="hidden sm:inline">
              {user.firstName} {user.lastName}
            </span>
            <span className="flex size-7 items-center justify-center rounded-full bg-avatar text-[11px] font-semibold text-white">
              {initials(user.firstName, user.lastName)}
            </span>
          </Link>
        )}
      </div>
    </header>
  );
}