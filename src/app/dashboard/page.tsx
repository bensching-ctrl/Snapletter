'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useBrands } from '@/hooks/useBrands';
import { useNewsletters } from '@/hooks/useNewsletters';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/newsletter/StatusBadge';
import { Skeleton } from '@/components/ui/skeleton';
import { Building2, Mail, CheckCircle2, ChevronRight } from 'lucide-react';

/** Klickbare KPI-Card Komponente */
interface KPICardProps {
  href: string;
  title: string;
  icon: React.ReactNode;
  isLoading: boolean;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

function KPICard({ href, title, icon, isLoading, children, variant = 'secondary' }: KPICardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(href);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      router.push(href);
    }
  };

  const isPrimary = variant === 'primary';

  return (
    <Card
      interactive
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="link"
      aria-label={`${title} anzeigen`}
      className={isPrimary ? 'md:col-span-1 ring-1 ring-primary/10 bg-primary/[0.02]' : ''}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={isPrimary ? 'text-primary' : 'text-muted-foreground'}>
              {icon}
            </span>
            <CardTitle className={`text-sm font-medium ${isPrimary ? 'text-foreground' : 'text-muted-foreground'}`}>
              {title}
            </CardTitle>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className={isPrimary ? 'h-12 w-16' : 'h-9 w-12'} />
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { data: brands, isLoading: brandsLoading } = useBrands();
  const { data: newsletters, isLoading: newslettersLoading } = useNewsletters();

  const recentNewsletters = newsletters?.slice(0, 5) || [];
  const generatingCount = newsletters?.filter(n => n.status === 'generating').length || 0;
  const doneCount = newsletters?.filter(n => n.status === 'done').length || 0;

  return (
    <div className="space-y-10 md:space-y-12">
      <div data-slot="page-header">
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Übersicht über Ihre Newsletter-Aktivitäten
        </p>
      </div>

      {/* KPI Cards - Primär zuerst, dann sekundär */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Primäre KPI: Generiert */}
        <KPICard
          href="/newsletters"
          title="Generiert"
          icon={<CheckCircle2 className="h-5 w-5" />}
          isLoading={newslettersLoading}
          variant="primary"
        >
          <div className="text-4xl font-bold text-green-600 select-none">{doneCount}</div>
          {generatingCount > 0 && (
            <p className="text-sm text-muted-foreground mt-1 select-none">
              {generatingCount} in Bearbeitung
            </p>
          )}
        </KPICard>

        {/* Sekundäre KPI: Newsletter gesamt */}
        <KPICard
          href="/newsletters"
          title="Newsletter (gesamt)"
          icon={<Mail className="h-4 w-4" />}
          isLoading={newslettersLoading}
          variant="secondary"
        >
          <div className="text-3xl font-bold select-none">{newsletters?.length || 0}</div>
        </KPICard>

        {/* Sekundäre KPI: Firmenprofile */}
        <KPICard
          href="/brands"
          title="Firmenprofile"
          icon={<Building2 className="h-4 w-4" />}
          isLoading={brandsLoading}
          variant="secondary"
        >
          <div className="text-3xl font-bold select-none">{brands?.length || 0}</div>
        </KPICard>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Letzte Newsletter</CardTitle>
            <Button asChild variant="outline" size="sm">
              <Link href="/newsletters">Alle anzeigen</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {newslettersLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-3">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                ))}
              </div>
            ) : recentNewsletters.length === 0 ? (
              <div className="text-center py-6 select-none">
                <p className="text-muted-foreground mb-4">
                  Noch keine Newsletter vorhanden
                </p>
                <Button asChild>
                  <Link href="/newsletters/new">Ersten Newsletter erstellen</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {recentNewsletters.map((newsletter) => (
                  <Link
                    key={newsletter.id}
                    href={`/newsletters/${newsletter.id}`}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors"
                  >
                    <span className="font-medium truncate flex-1">
                      {newsletter.main_topic}
                    </span>
                    <StatusBadge status={newsletter.status} />
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Firmenprofile</CardTitle>
            <Button asChild variant="outline" size="sm">
              <Link href="/brands">Alle anzeigen</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {brandsLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3 p-3">
                    <Skeleton className="h-8 w-8 rounded" />
                    <Skeleton className="h-5 w-32" />
                  </div>
                ))}
              </div>
            ) : brands?.length === 0 ? (
              <div className="text-center py-6 select-none">
                <p className="text-muted-foreground mb-4">
                  Noch keine Firmenprofile vorhanden
                </p>
                <Button asChild>
                  <Link href="/brands/new">Erstes Firmenprofil erstellen</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {brands?.slice(0, 5).map((brand) => (
                  <Link
                    key={brand.id}
                    href={`/brands/${brand.id}`}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                  >
                    {brand.logo_url && (
                      <img
                        src={brand.logo_url}
                        alt={`${brand.name} Logo`}
                        className="w-8 h-8 object-contain rounded"
                      />
                    )}
                    <span className="font-medium">{brand.name}</span>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Schnellstart</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Button asChild>
            <Link href="/newsletters/new">Newsletter erstellen</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/brands/new">Firmenprofil erstellen</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
