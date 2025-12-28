import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Clock, Shield, Building2, FileEdit, Wand2, Lock, ServerCog, CheckCircle2 } from 'lucide-react';
import { Hero } from '@/components/hero/Hero';
import { LandingNav } from '@/components/landing/LandingNav';

const RevealSection = dynamic(
  () => import('@/components/ui/reveal-section').then(mod => mod.RevealSection),
  {
    ssr: true,
    loading: () => <div className="text-center mb-14" />,
  }
);

export default function LandingPage() {
  return (
    <div className="flex flex-col -mx-4 -mt-8 md:-mt-12 scroll-smooth landing-readonly">
      {/* Landing Navigation */}
      <LandingNav />

      {/* Hero Section */}
      <Hero />

      {/* ═══ ABLAUF SECTION ═══ */}
      <section id="ablauf" className="relative py-20 md:py-28 bg-background border-t">
        <div className="container mx-auto px-4">
          <RevealSection className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              So funktioniert&apos;s
            </h2>
            <p className="text-muted-foreground mt-3 text-lg max-w-xl mx-auto">
              In drei Schritten zum fertigen Newsletter.
            </p>
          </RevealSection>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {/* Step 1 */}
            <div className="group relative p-6 rounded-2xl bg-muted/30 border border-border/50 hover:border-border card-hover motion-reduce:transition-none">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-bold text-sm">
                    01
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Firmenprofil definieren</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Name, Tonalität, Markenwörter und No-Gos einmalig hinterlegen.
                  </p>
                </div>
              </div>
              {/* Mini UI Skeleton */}
              <div className="mt-4 p-3 rounded-lg bg-background border border-border/60 select-none hidden md:block">
                <div className="space-y-2">
                  <div className="h-2 w-20 rounded bg-muted" />
                  <div className="h-3 w-full rounded bg-muted/60" />
                  <div className="h-3 w-3/4 rounded bg-muted/40" />
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="group relative p-6 rounded-2xl bg-muted/30 border border-border/50 hover:border-border card-hover motion-reduce:transition-none">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-bold text-sm">
                    02
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <FileEdit className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Newsletter-Inhalt eingeben</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Hauptthema, optionale Abschnitte und gewünschte Länge festlegen.
                  </p>
                </div>
              </div>
              {/* Mini UI Skeleton */}
              <div className="mt-4 p-3 rounded-lg bg-background border border-border/60 select-none hidden md:block">
                <div className="space-y-2">
                  <div className="h-2 w-16 rounded bg-muted" />
                  <div className="h-8 w-full rounded bg-muted/60" />
                  <div className="flex gap-2">
                    <div className="h-5 w-16 rounded-full bg-muted/40" />
                    <div className="h-5 w-20 rounded-full bg-muted/40" />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="group relative p-6 rounded-2xl bg-muted/30 border border-border/50 hover:border-border card-hover motion-reduce:transition-none">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-bold text-sm">
                    03
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <Wand2 className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">KI generiert Newsletter</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Markenkonformer Content in Sekunden — ready-to-send.
                  </p>
                </div>
              </div>
              {/* Mini UI Skeleton - Generated */}
              <div className="mt-4 p-3 rounded-lg bg-background border border-primary/30 select-none hidden md:block">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3 text-primary" />
                    <div className="h-2 w-12 rounded animate-shimmer" />
                  </div>
                  <div className="h-2 w-full rounded animate-shimmer" style={{ animationDelay: '150ms' }} />
                  <div className="h-2 w-5/6 rounded animate-shimmer" style={{ animationDelay: '300ms' }} />
                  <div className="h-2 w-4/5 rounded animate-shimmer" style={{ animationDelay: '450ms' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ OUTPUT PROOF SECTION ═══ */}
      <section className="py-16 md:py-24 bg-[oklch(0.985_0.002_250)]">
        <div className="container mx-auto px-4">
          <RevealSection className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              So sieht das Ergebnis aus
            </h2>
            <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
              Professionelle Newsletter, generiert in Sekunden.
            </p>
          </RevealSection>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Output Example 1 */}
            <div className="p-5 rounded-2xl bg-background border border-border/60 shadow-sm card-hover motion-reduce:transition-none">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center">
                  <span className="text-white text-xs font-bold">TF</span>
                </div>
                <div>
                  <div className="text-sm font-medium">TechFirma GmbH</div>
                  <div className="text-xs text-muted-foreground">Monatliches Update</div>
                </div>
                <span className="ml-auto px-2 py-0.5 rounded text-[10px] font-medium bg-primary/10 text-primary">
                  KI-generiert
                </span>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">Neuigkeiten im Dezember</p>
                <p className="leading-relaxed">
                  Sehr geehrte Leserinnen und Leser, wir freuen uns, Ihnen unsere aktuellen Entwicklungen vorzustellen...
                </p>
                <div className="pt-2 flex gap-2">
                  <span className="px-2 py-1 rounded text-xs bg-muted">Produktupdate</span>
                  <span className="px-2 py-1 rounded text-xs bg-muted">Events</span>
                </div>
              </div>
            </div>

            {/* Output Example 2 */}
            <div className="p-5 rounded-2xl bg-background border border-border/60 shadow-sm card-hover motion-reduce:transition-none">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">GA</span>
                </div>
                <div>
                  <div className="text-sm font-medium">GreenAgency</div>
                  <div className="text-xs text-muted-foreground">Wöchentlicher Digest</div>
                </div>
                <span className="ml-auto px-2 py-0.5 rounded text-[10px] font-medium bg-primary/10 text-primary">
                  KI-generiert
                </span>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">Diese Woche bei GreenAgency</p>
                <p className="leading-relaxed">
                  Liebe Community, in dieser Ausgabe erwarten euch spannende Insights zu nachhaltigen Projekten...
                </p>
                <div className="pt-2 flex gap-2">
                  <span className="px-2 py-1 rounded text-xs bg-muted">Nachhaltigkeit</span>
                  <span className="px-2 py-1 rounded text-xs bg-muted">Insights</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ BENEFITS SECTION ═══ */}
      <section id="vorteile" className="relative py-20 md:py-28 bg-background border-t">
        <div className="container mx-auto px-4">
          <RevealSection className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Warum Snapletter?
            </h2>
            <p className="text-muted-foreground mt-4 text-lg max-w-2xl mx-auto">
              Sparen Sie Zeit und erstellen Sie konsistente, markengerechte Newsletter.
            </p>
          </RevealSection>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Benefit 1 */}
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-muted/30 border border-border/50 card-hover motion-reduce:transition-none">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">KI-generierte Inhalte</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Professionelle Texte basierend auf Ihrem Firmenprofil und den gewählten Parametern.
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-muted/30 border border-border/50 card-hover motion-reduce:transition-none">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">In Sekunden fertig</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Keine stundenlange Texterstellung mehr. Thema eingeben, generieren, fertig.
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-muted/30 border border-border/50 card-hover motion-reduce:transition-none">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Markenkonform</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Tonalität, Markenwörter und No-Gos werden automatisch berücksichtigt.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SECURITY SECTION ═══ */}
      <section id="sicherheit" className="py-16 md:py-20 bg-[oklch(0.985_0.002_250)] border-t">
        <div className="container mx-auto px-4">
          <RevealSection className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              Datenschutz & Sicherheit
            </h2>
            <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
              Ihre Daten sind bei uns in sicheren Händen.
            </p>
          </RevealSection>

          <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="flex flex-col items-center text-center p-4">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-sm font-semibold mb-1">DSGVO-konform</h3>
              <p className="text-xs text-muted-foreground">
                Vollständig konform mit europäischen Datenschutzrichtlinien.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-4">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                <Lock className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-sm font-semibold mb-1">Verschlüsselt</h3>
              <p className="text-xs text-muted-foreground">
                Alle Daten werden verschlüsselt übertragen und gespeichert.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-4">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                <ServerCog className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-sm font-semibold mb-1">Keine Weitergabe</h3>
              <p className="text-xs text-muted-foreground">
                Ihre Inhalte werden niemals an Dritte weitergegeben.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CTA SECTION ═══ */}
      <section className="py-20 md:py-28 border-t">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              Bereit loszulegen?
            </h2>
            <p className="text-muted-foreground">
              Erstellen Sie Ihr erstes Firmenprofil und generieren Sie Ihren ersten Newsletter.
            </p>
            <Button asChild size="lg" className="min-h-[48px] text-base">
              <Link href="/newsletters/new">
                Newsletter erstellen
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="py-8 border-t bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>Snapletter</p>
            <nav className="flex gap-6">
              <Link href="#ablauf" className="hover:text-foreground transition-colors focus:outline-none focus-visible:underline">
                Ablauf
              </Link>
              <Link href="#vorteile" className="hover:text-foreground transition-colors focus:outline-none focus-visible:underline">
                Vorteile
              </Link>
              <Link href="#sicherheit" className="hover:text-foreground transition-colors focus:outline-none focus-visible:underline">
                Sicherheit
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
