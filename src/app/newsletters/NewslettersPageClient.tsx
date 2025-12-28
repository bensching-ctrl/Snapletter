'use client';

import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useNewsletters, useDeleteNewsletter } from '@/hooks/useNewsletters';
import { useBrands } from '@/hooks/useBrands';
import { NewsletterCard } from '@/components/newsletter/NewsletterCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Search, ChevronDown, Check, X } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { NewsletterStatus } from '@/types/newsletter';

/**
 * Skeleton für eine einzelne Newsletter-Card.
 * Fixed dimensions match actual NewsletterCard to prevent CLS.
 */
function NewsletterCardSkeleton() {
  return (
    <Card className="min-h-[156px]">
      <CardHeader className="pb-3">
        {/* Header: Title + Brand */}
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0 space-y-1">
            {/* Title */}
            <Skeleton className="h-5 w-3/4" />
            {/* Brand name with icon */}
            <div className="flex items-center gap-1.5">
              <Skeleton className="h-3.5 w-3.5 rounded" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {/* Meta info rows */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5">
            <Skeleton className="h-3.5 w-3.5 rounded" />
            <Skeleton className="h-3.5 w-20" />
          </div>
          <div className="flex items-center gap-1.5">
            <Skeleton className="h-3 w-3 rounded" />
            <Skeleton className="h-3 w-28" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

type StatusFilter = 'all' | 'done' | 'generating' | 'error' | 'idle';
type SortOrder = 'newest' | 'oldest';

/** Filter-Konfiguration mit semantischen Farben */
const STATUS_FILTERS: { value: StatusFilter; label: string; color: string; activeColor: string }[] = [
  { value: 'all', label: 'Alle', color: 'bg-background', activeColor: 'bg-primary text-primary-foreground' },
  { value: 'done', label: 'Fertig', color: 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400', activeColor: 'bg-green-600 text-white' },
  { value: 'generating', label: 'In Erstellung', color: 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400', activeColor: 'bg-blue-600 text-white' },
  { value: 'error', label: 'Fehler', color: 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400', activeColor: 'bg-red-600 text-white' },
  { value: 'idle', label: 'Entwurf', color: 'bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-400', activeColor: 'bg-gray-600 text-white' },
];

const SORT_OPTIONS: { value: SortOrder; label: string }[] = [
  { value: 'newest', label: 'Neueste zuerst' },
  { value: 'oldest', label: 'Älteste zuerst' },
];

export function NewslettersPageClient() {
  const { data: newsletters, isLoading, error } = useNewsletters();
  const { data: brands } = useBrands();
  const deleteMutation = useDeleteNewsletter();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');

  const getBrandName = useCallback((brandId: string | null) => {
    if (!brandId || !brands) return undefined;
    return brands.find(b => b.id === brandId)?.name;
  }, [brands]);

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success('Newsletter gelöscht');
    } catch {
      toast.error('Fehler beim Löschen');
    }
  };

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
  };

  const hasActiveFilters = searchQuery.trim() !== '' || statusFilter !== 'all';

  // Filter and sort newsletters
  const filteredNewsletters = useMemo(() => {
    if (!newsletters) return [];

    let result = [...newsletters];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((n) => {
        const brandName = getBrandName(n.brand_id)?.toLowerCase() || '';
        return (
          n.main_topic.toLowerCase().includes(query) ||
          brandName.includes(query) ||
          n.generated_subject?.toLowerCase().includes(query)
        );
      });
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter((n) => {
        const status: NewsletterStatus = n.status || 'idle';
        return status === statusFilter;
      });
    }

    // Sort by updated_at
    result.sort((a, b) => {
      const dateA = new Date(a.updated_at).getTime();
      const dateB = new Date(b.updated_at).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [newsletters, searchQuery, statusFilter, sortOrder, getBrandName]);

  // Count newsletters per status
  const statusCounts = useMemo(() => {
    if (!newsletters) return { all: 0, done: 0, generating: 0, error: 0, idle: 0 };
    return {
      all: newsletters.length,
      done: newsletters.filter((n) => n.status === 'done').length,
      generating: newsletters.filter((n) => n.status === 'generating').length,
      error: newsletters.filter((n) => n.status === 'error').length,
      idle: newsletters.filter((n) => !n.status || n.status === 'idle').length,
    };
  }, [newsletters]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div data-slot="page-header">
            <h1 className="text-3xl font-bold">Newsletter</h1>
            <p className="text-muted-foreground">
              Erstellen und verwalten Sie Ihre Newsletter-Kampagnen
            </p>
          </div>
          <Button asChild>
            <Link href="/newsletters/new">Newsletter erstellen</Link>
          </Button>
        </div>
        {/* Skeleton Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <NewsletterCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-destructive">Fehler beim Laden der Newsletter</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div data-slot="page-header">
          <h1 className="text-3xl font-bold">Newsletter</h1>
          <p className="text-muted-foreground">
            Erstellen und verwalten Sie Ihre Newsletter-Kampagnen
          </p>
        </div>
        <Button asChild>
          <Link href="/newsletters/new">Newsletter erstellen</Link>
        </Button>
      </div>

      {newsletters && newsletters.length > 0 && (
        <>
          {/* Search - prominent */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Nach Titel, Thema oder Firma suchen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 text-base"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Suche löschen"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Filter & Sort Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Status Filter Chips */}
            <div className="flex flex-wrap gap-2">
              {STATUS_FILTERS.map((filter) => {
                const count = statusCounts[filter.value];
                const isActive = statusFilter === filter.value;
                return (
                  <button
                    key={filter.value}
                    onClick={() => setStatusFilter(filter.value)}
                    className={`
                      inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium
                      transition-all duration-200 border
                      ${isActive
                        ? `${filter.activeColor} border-transparent shadow-sm`
                        : `${filter.color} border-border hover:border-foreground/20`
                      }
                    `}
                  >
                    {filter.label}
                    <span className={`
                      text-xs px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center
                      ${isActive
                        ? 'bg-white/20'
                        : 'bg-black/5 dark:bg-white/10'
                      }
                    `}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Sort Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="shrink-0 gap-2">
                  {SORT_OPTIONS.find(o => o.value === sortOrder)?.label}
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {SORT_OPTIONS.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => setSortOrder(option.value)}
                    className="gap-2"
                  >
                    {sortOrder === option.value && <Check className="h-4 w-4" />}
                    {sortOrder !== option.value && <span className="w-4" />}
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </>
      )}

      {/* Content */}
      {newsletters?.length === 0 ? (
        <div className="text-center py-16 border rounded-lg bg-muted/30 select-none">
          <p className="text-muted-foreground mb-2">
            Noch keine Newsletter vorhanden
          </p>
          <p className="text-sm text-muted-foreground/70 mb-6 max-w-md mx-auto">
            Hier werden alle Newsletter-Entwürfe gesammelt. Nach der Generierung erscheinen Betreff und Inhalt direkt in der Vorschau.
          </p>
          <Button asChild>
            <Link href="/newsletters/new">Ersten Newsletter erstellen</Link>
          </Button>
        </div>
      ) : filteredNewsletters.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-muted/30 select-none">
          <p className="text-lg font-medium text-foreground mb-2">
            Keine Newsletter gefunden
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            {searchQuery
              ? `Keine Ergebnisse für "${searchQuery}"`
              : 'Für den ausgewählten Filter gibt es keine Newsletter'}
          </p>
          {hasActiveFilters && (
            <Button variant="outline" onClick={resetFilters}>
              Filter zurücksetzen
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredNewsletters.map((newsletter) => (
            <NewsletterCard
              key={newsletter.id}
              newsletter={newsletter}
              brandName={getBrandName(newsletter.brand_id)}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
