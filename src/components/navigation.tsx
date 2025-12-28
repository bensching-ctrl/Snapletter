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
        <nav className="flex h-16 items-center justify-between gap-4 md:gap-8" aria-label="Hauptnavigation">
          {/* Logo - flex-none prevents shrinking, min-w-0 on text allows truncation if extreme */}
          <Link href="/" className="flex items-center flex-none" aria-label="Snapletter - Zur Startseite">
            <SnapletterLogo iconClassName="w-8 h-8" textClassName="text-xl font-bold" />
          </Link>
          {/* Nav links - min-w-0 allows flex children to shrink, gap-1 on mobile for 320px */}
          <ul className="flex gap-1 sm:gap-2 md:gap-6 min-w-0" role="list">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <li key={item.href} className="min-w-0">
                  <Link
                    href={item.href}
                    className={cn(
                      // Mobile: 44px min tap target (py-3 = 12px*2 + ~20px line = 44px), tight px
                      // Desktop: restore normal visual spacing
                      'block px-1.5 py-3 sm:px-2 md:px-0 md:py-0',
                      'text-xs sm:text-sm font-medium transition-colors hover:text-primary',
                      'truncate',
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
