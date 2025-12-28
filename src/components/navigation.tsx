'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { SnapletterLogo } from '@/components/brand/snapletter-logo';

const navItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/brands', label: 'Firmenprofile' },
  { href: '/newsletters', label: 'Newsletter' },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <nav className="flex h-16 items-center justify-between" aria-label="Hauptnavigation">
          <Link href="/" className="flex items-center" aria-label="Snapletter - Zur Startseite">
            <SnapletterLogo iconClassName="w-8 h-8" textClassName="text-xl font-bold" />
          </Link>
          <ul className="flex gap-6" role="list">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      'text-sm font-medium transition-colors hover:text-primary',
                      isActive ? 'text-primary' : 'text-muted-foreground'
                    )}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
