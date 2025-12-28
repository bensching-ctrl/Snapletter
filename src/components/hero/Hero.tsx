import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

/**
 * HERO SECTION - Snapletter
 *
 * Struktur:
 * 1. Background: 3-Layer System (Base → Ambient Glow → Vignette)
 * 2. Content: Left (Text) + Right (Product Visual)
 *
 * Design-Prinzipien:
 * - Whitespace: ~50% der Fläche
 * - Keine echten Schwarztöne (oklch 0.08-0.12 Basis)
 * - Produkt-Visual als "Beweis"
 * - Static render for optimal LCP
 */

// ─────────────────────────────────────────────────────────────
// PRODUCT MOCKUP - Newsletter Preview (Static)
// ─────────────────────────────────────────────────────────────

const PREVIEW_TEXT = "Sehr geehrte Leserinnen und Leser, wir freuen uns, Ihnen unsere neuesten Entwicklungen vorzustellen.";

function NewsletterPreview() {
  return (
    <div className="relative select-none">
      {/* Ambient Glow behind mockup */}
      <div
        className="absolute -inset-12 -z-10 blur-[100px] opacity-30"
        style={{
          background: 'radial-gradient(ellipse 70% 60% at 50% 50%, oklch(0.45 0.12 250), transparent)'
        }}
      />

      {/* Main Card */}
      <div className="relative rounded-2xl overflow-hidden bg-[oklch(0.13_0.015_260)] border border-[oklch(0.22_0.02_260)] shadow-[0_32px_64px_-16px_oklch(0_0_0/0.5),inset_0_1px_0_oklch(0.25_0.02_260/0.4)]">

        {/* Window Controls */}
        <div className="flex items-center gap-2 px-5 py-4 border-b border-[oklch(0.20_0.015_260)]">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-[oklch(0.58_0.20_25)]" />
            <div className="w-3 h-3 rounded-full bg-[oklch(0.75_0.18_85)]" />
            <div className="w-3 h-3 rounded-full bg-[oklch(0.62_0.18_145)]" />
          </div>
          <div className="flex-1 ml-4">
            <div className="max-w-[200px] h-6 rounded-md bg-[oklch(0.18_0.015_260)] flex items-center justify-center">
              <span className="text-[11px] text-[oklch(0.50_0.01_260)] tracking-wide">
                newsletter-generator.app
              </span>
            </div>
          </div>
        </div>

        {/* Email Preview */}
        <div className="p-6 space-y-5">

          {/* Email Header */}
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[oklch(0.50_0.14_250)] to-[oklch(0.42_0.12_270)] flex items-center justify-center flex-shrink-0 shadow-[0_4px_12px_oklch(0.50_0.14_250/0.3)]">
              <span className="text-white text-sm font-bold tracking-tight">NG</span>
            </div>
            <div className="flex-1 pt-0.5">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-[oklch(0.92_0.01_260)]">
                  Snapletter
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[oklch(0.50_0.14_250/0.15)] text-[oklch(0.70_0.12_250)]">
                  KI-generiert
                </span>
              </div>
              <span className="text-xs text-[oklch(0.50_0.01_260)]">
                Monatliches Update — Dezember 2024
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-[oklch(0.25_0.02_260)] to-transparent" />

          {/* Email Body */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-[oklch(0.95_0.005_260)]">
              Ihre Neuigkeiten im Überblick
            </h3>

            {/* Text Area - Static */}
            <div className="relative min-h-[72px] p-4 rounded-xl bg-[oklch(0.10_0.01_260)] border border-[oklch(0.20_0.015_260)]">
              <p className="text-sm text-[oklch(0.72_0.01_260)] leading-relaxed">
                {PREVIEW_TEXT}
              </p>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-2">
              {['Markenkonform', 'Personalisiert', 'SEO-optimiert'].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-[oklch(0.18_0.015_260)] text-[oklch(0.65_0.01_260)] border border-[oklch(0.22_0.015_260)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2 text-xs text-[oklch(0.55_0.01_260)]">
              <CheckCircle2 className="w-4 h-4 text-[oklch(0.60_0.15_145)]" />
              <span>Bereit zum Versand</span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-[oklch(0.50_0.14_250)] text-white text-xs font-medium shadow-[0_2px_8px_oklch(0.50_0.14_250/0.4)]">
              Newsletter senden
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

/** Floating stat badge - positioned outside preview to avoid overlap */
function GenerationTimeBadge() {
  return (
    <div className="flex justify-center lg:justify-start mt-6 lg:mt-4 select-none">
      <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[oklch(0.15_0.015_260)] border border-[oklch(0.25_0.02_260)] shadow-lg">
        <div className="text-xl font-bold text-white tabular-nums">3 Sek.</div>
        <div className="text-[11px] text-[oklch(0.55_0.01_260)] leading-tight">
          Durchschnittliche<br />Generierungszeit
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN HERO EXPORT
// ─────────────────────────────────────────────────────────────

export function Hero() {
  return (
    <section
      className="relative flex items-center overflow-hidden hero-viewport-fallback"
      style={{
        // Use svh (small viewport height) for mobile browsers with dynamic UI
        // Falls back via CSS @supports to 100vh/-webkit-fill-available for older browsers
        minHeight: '100svh',
      }}
    >

      {/* ═══ BACKGROUND SYSTEM - Static Material Quality ═══ */}
      {/* All layers are static. No animations. Optimized for screenshot quality. */}

      {/* Layer 1: Base - Rich dark blue with slight warmth */}
      <div className="absolute inset-0 bg-[oklch(0.105_0.020_256)] z-0" />

      {/* Layer 2: Subtle texture grain - creates material feel */}
      <div
        className="absolute inset-0 z-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: '128px 128px',
        }}
      />

      {/* Layer 3: Very subtle grid - adds structure without being obvious */}
      <div
        className="absolute inset-0 z-0 opacity-[0.018] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, oklch(0.40 0.02 255) 1px, transparent 1px),
            linear-gradient(to bottom, oklch(0.40 0.02 255) 1px, transparent 1px)
          `,
          backgroundSize: '64px 64px',
        }}
      />

      {/* Layer 4: Center-left soft light - headline focus */}
      <div
        className="absolute top-[15%] left-[5%] w-[55%] h-[60%] blur-[100px] opacity-[0.08] z-0"
        style={{
          background: 'radial-gradient(ellipse 90% 80% at 30% 45%, oklch(0.35 0.08 252), transparent)'
        }}
      />

      {/* Layer 5: Right side subtle glow - product area */}
      <div
        className="absolute top-[25%] right-[5%] w-[40%] h-[50%] blur-[80px] opacity-[0.05] z-0"
        style={{
          background: 'radial-gradient(ellipse 80% 90% at 70% 50%, oklch(0.32 0.06 258), transparent)'
        }}
      />

      {/* Layer 6: Inner edge shading - all sides */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          boxShadow: 'inset 0 80px 100px -60px oklch(0.06 0.015 260 / 0.6), inset 0 -40px 60px -40px oklch(0.04 0.01 260 / 0.4), inset 80px 0 100px -60px oklch(0.05 0.012 260 / 0.3), inset -80px 0 100px -60px oklch(0.05 0.012 260 / 0.3)'
        }}
      />

      {/* Layer 7: Vignette - draws eye to content center */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(ellipse 85% 75% at 50% 45%, transparent 30%, oklch(0.05 0.015 260 / 0.5) 100%)'
        }}
      />

      {/* ═══ CONTENT ═══ */}

      <div className="relative z-10 w-full">
        {/* pt-24 accounts for fixed nav height (h-16 = 64px + extra spacing) */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 lg:pt-28 lg:pb-20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* ─── LEFT: TEXT CONTENT ─── */}
            <div className="max-w-xl space-y-6">

              {/* Headline + Subline - tighter spacing */}
              <div className="space-y-3">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-[-0.02em] text-white leading-[1.1]">
                  Newsletter, die{' '}
                  <span className="bg-gradient-to-r from-[oklch(0.72_0.14_250)] to-[oklch(0.68_0.12_270)] bg-clip-text text-transparent">
                    sich selbst schreiben
                  </span>
                </h1>

                {/* Subline - closer to headline */}
                <p className="text-base sm:text-lg lg:text-xl text-[oklch(0.68_0.015_260)] leading-relaxed max-w-md">
                  Firmenprofil definieren. KI generiert markenkonformen Content — konsistent, professionell, versandfertig.
                </p>
              </div>

              {/* CTAs - consolidated naming */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                {/* Primary CTA - Newsletter erstellen */}
                <Button
                  asChild
                  size="lg"
                  className="w-full sm:w-auto min-h-[48px] h-12 px-8 text-base font-semibold bg-white text-[oklch(0.12_0.02_260)] hover:bg-[oklch(0.96_0.005_250)] shadow-[0_0_0_1px_oklch(1_0_0/0.1),0_8px_24px_oklch(0.50_0.15_250/0.25)] hover:shadow-[0_0_0_1px_oklch(1_0_0/0.15),0_12px_32px_oklch(0.50_0.15_250/0.35)] transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(0.65_0.15_250)] focus-visible:ring-offset-2 focus-visible:ring-offset-[oklch(0.105_0.020_256)]"
                >
                  <Link href="/newsletters/new">
                    Newsletter erstellen
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>

                {/* Secondary CTA - Demo ansehen (untergeordnet) */}
                <Button
                  asChild
                  variant="ghost"
                  size="lg"
                  className="w-full sm:w-auto min-h-[48px] h-12 px-6 text-base font-medium text-[oklch(0.70_0.01_260)] hover:text-white hover:bg-[oklch(0.18_0.02_260)] transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(0.65_0.15_250)] focus-visible:ring-offset-2 focus-visible:ring-offset-[oklch(0.105_0.020_256)]"
                >
                  <Link href="/dashboard">
                    Demo ansehen
                  </Link>
                </Button>
              </div>

              {/* Trust Indicators - improved spacing and contrast */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-6 text-sm text-[oklch(0.62_0.01_260)]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-[18px] h-[18px] text-[oklch(0.58_0.14_145)]" />
                  <span>Keine Kreditkarte</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-[18px] h-[18px] text-[oklch(0.58_0.14_145)]" />
                  <span>DSGVO-konform</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-[18px] h-[18px] text-[oklch(0.58_0.14_145)]" />
                  <span>Sofort einsatzbereit</span>
                </div>
              </div>
            </div>

            {/* ─── RIGHT: PRODUCT VISUAL ─── */}
            <div className="lg:pl-4" id="produkt">
              <NewsletterPreview />
              <GenerationTimeBadge />
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}

export default Hero;
