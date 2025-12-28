'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { SnapletterIcon } from '@/components/brand/snapletter-logo';

const NAV_ITEMS = [
  { label: 'Ablauf', href: '#ablauf' },
  { label: 'Vorteile', href: '#vorteile' },
  { label: 'Sicherheit', href: '#sicherheit' },
];

export function LandingNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        // Safe area support for iOS notch/Dynamic Island
        paddingTop: 'env(safe-area-inset-top, 0px)',
        height: 'calc(4rem + env(safe-area-inset-top, 0px))'
      }}
    >
      {/* Background with blur - Extended for iOS overscroll */}
      <div className="absolute inset-0 -top-20 bg-[oklch(0.105_0.020_256/0.85)] backdrop-blur-md border-b border-[oklch(0.20_0.02_260/0.5)]" />

      <nav className="relative h-16 container mx-auto px-4 lg:px-8 flex items-center justify-between">
        {/* Logo / Brand */}
        <Link
          href="/"
          className="flex items-center gap-2 text-white font-semibold text-lg tracking-tight focus:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(0.65_0.15_250)] focus-visible:ring-offset-2 focus-visible:ring-offset-[oklch(0.105_0.020_256)] rounded-md"
        >
          <SnapletterIcon className="w-8 h-8" />
          <span className="hidden sm:inline">Snapletter</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-4 py-2 text-sm font-medium text-[oklch(0.75_0.01_260)] hover:text-white transition-colors rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(0.65_0.15_250)] focus-visible:ring-offset-2 focus-visible:ring-offset-[oklch(0.105_0.020_256)]"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <Button
            asChild
            size="sm"
            className="h-9 px-4 text-sm font-semibold bg-white text-[oklch(0.12_0.02_260)] hover:bg-[oklch(0.96_0.005_250)] shadow-[0_0_0_1px_oklch(1_0_0/0.1),0_4px_12px_oklch(0.50_0.15_250/0.2)] transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(0.65_0.15_250)] focus-visible:ring-offset-2 focus-visible:ring-offset-[oklch(0.105_0.020_256)]"
          >
            <Link href="/newsletters/new">
              Newsletter erstellen
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="md:hidden p-2 text-[oklch(0.75_0.01_260)] hover:text-white transition-colors rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(0.65_0.15_250)]"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Menü schließen' : 'Menü öffnen'}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute left-0 right-0 bg-[oklch(0.105_0.020_256/0.98)] backdrop-blur-md border-b border-[oklch(0.20_0.02_260/0.5)]" style={{ top: '4rem' }}>
          <div className="container mx-auto px-4 py-4 space-y-2">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-4 py-3 text-base font-medium text-[oklch(0.75_0.01_260)] hover:text-white hover:bg-[oklch(0.18_0.02_260)] rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(0.65_0.15_250)]"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-[oklch(0.20_0.02_260/0.5)] mt-2">
              <Link
                href="/newsletters/new"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-base font-medium text-[oklch(0.75_0.01_260)] hover:text-white hover:bg-[oklch(0.18_0.02_260)] rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(0.65_0.15_250)]"
              >
                Newsletter erstellen →
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default LandingNav;
