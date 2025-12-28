'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { Loader2, AlertCircle, RefreshCw, Mail, FileText, Code } from 'lucide-react';
import { useNewsletter } from '@/hooks/useNewsletters';
import { useBrand } from '@/hooks/useBrands';
import { useNewsletterGeneration } from '@/hooks/useNewsletterGeneration';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResultPreview } from '@/components/newsletter/ResultPreview';
import { getNewsletterUiState } from '@/lib/newsletter-status';
import {
  INTENTION_OPTIONS,
  CTA_OPTIONS,
  LENGTH_OPTIONS,
  LAYOUT_OPTIONS,
} from '@/types/newsletter';
import { toast } from 'sonner';
import { newsletterKeys } from '@/hooks/useNewsletters';

/** Copy to clipboard helper */
async function copyToClipboard(text: string, label: string) {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(`${label} kopiert`);
  } catch {
    toast.error('Kopieren fehlgeschlagen');
  }
}

interface NewsletterDetailClientProps {
  id: string;
}

export function NewsletterDetailClient({ id }: NewsletterDetailClientProps) {
  const queryClient = useQueryClient();
  const { data: newsletter, isLoading, error } = useNewsletter(id);
  const { data: brand } = useBrand(newsletter?.brand_id || null);

  // UI-State aus zentraler Funktion
  const uiState = getNewsletterUiState(newsletter);

  const generation = useNewsletterGeneration({
    onSuccess: () => {
      toast.info('Newsletter wird generiert...');
    },
    onError: (err) => {
      toast.error(`Fehler: ${err.message}`);
    },
  });

  // Polling während der Generierung (alle 3 Sekunden)
  useEffect(() => {
    if (uiState.state !== 'generating') return;

    const pollInterval = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: newsletterKeys.detail(id) });
    }, 3000);

    return () => clearInterval(pollInterval);
  }, [uiState.state, id, queryClient]);

  // Unified generation handler - works for first generation, retry, and regeneration
  const handleGeneration = async () => {
    if (!newsletter) return;
    // Allow generation if any of the conditions are met
    if (!uiState.canGenerate && !uiState.canRetry && !uiState.canRegenerate) return;

    try {
      await generation.startGeneration(newsletter.id);
    } catch {
      // Error handled by onError callback
    }
  };

  // Check if generation/regeneration is possible
  const canTriggerGeneration = uiState.canGenerate || uiState.canRetry || uiState.canRegenerate;
  const isGenerating = uiState.state === 'generating' || generation.isPending;

  // Determine button label based on state
  const getGenerationButtonLabel = () => {
    if (generation.isPending) return 'Wird gestartet...';
    if (uiState.canRegenerate) return 'Erneut generieren';
    if (uiState.canRetry) return 'Erneut versuchen';
    return 'Generierung starten';
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="text-muted-foreground">Laden...</p>
      </div>
    );
  }

  // Not Found / Error State
  if (error || !newsletter) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <p className="text-destructive font-medium">Newsletter nicht gefunden</p>
        <Button asChild variant="outline">
          <Link href="/newsletters">Zurück zur Übersicht</Link>
        </Button>
      </div>
    );
  }

  const getLabel = (options: { value: string; label: string }[], value: string) =>
    options.find(o => o.value === value)?.label || value;

  // Check if we have generated content for copy utilities
  const hasGeneratedContent = uiState.showPreview && (
    newsletter.generated_subject || newsletter.generated_html || newsletter.generated_text
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6 readonly">
      {/* Header - Clean & Focused */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        {/* Left: Navigation + Title */}
        <div className="space-y-1">
          <Link
            href="/newsletters"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-2"
          >
            ← Zurück zur Übersicht
          </Link>
          <h1 className="text-3xl font-bold">{newsletter.main_topic}</h1>
          {brand && (
            <p className="text-muted-foreground">{brand.name}</p>
          )}
        </div>

        {/* Right: Primary Action */}
        <div className="flex gap-2 flex-shrink-0">
          {canTriggerGeneration && !isGenerating && (
            <Button
              onClick={handleGeneration}
              disabled={generation.isPending}
            >
              {generation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Wird gestartet...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  {getGenerationButtonLabel()}
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Status-abhängige Anzeige */}

      {/* GENERATING State */}
      {isGenerating && (
        <Card className="border-primary/50">
          <CardContent className="py-8">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <div className="text-center">
                <p className="font-medium text-primary">Newsletter wird erstellt...</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Dies kann einige Sekunden dauern. Die Seite aktualisiert sich automatisch.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* FAILED State */}
      {uiState.state === 'failed' && !generation.isPending && (
        <Card className="border-destructive">
          <CardContent className="py-8">
            <div className="flex flex-col items-center gap-4">
              <AlertCircle className="h-10 w-10 text-destructive" />
              <div className="text-center">
                <p className="font-medium text-destructive">Generierung fehlgeschlagen</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Die Newsletter-Generierung konnte nicht abgeschlossen werden.
                </p>
              </div>
              <Button
                onClick={handleGeneration}
                disabled={generation.isPending}
                variant="outline"
                className="mt-2"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${generation.isPending ? 'animate-spin' : ''}`} />
                {generation.isPending ? 'Wird gestartet...' : 'Erneut versuchen'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* DONE State - Preview with Copy Utilities */}
      {uiState.showPreview && (
        <>
          {/* Copy Utilities - Grouped */}
          {hasGeneratedContent && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Inhalte exportieren</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {newsletter.generated_subject && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(newsletter.generated_subject!, 'Betreff')}
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Betreff kopieren
                    </Button>
                  )}
                  {newsletter.generated_html && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(newsletter.generated_html!, 'HTML')}
                    >
                      <Code className="h-4 w-4 mr-2" />
                      HTML kopieren
                    </Button>
                  )}
                  {newsletter.generated_text && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(newsletter.generated_text!, 'Text')}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Text kopieren
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Preview Component - Inhalte sollen kopierbar sein */}
          <div className="readonly-selectable">
            <ResultPreview
              subject={newsletter.generated_subject}
              html={newsletter.generated_html}
              text={newsletter.generated_text}
            />
          </div>
        </>
      )}

      {/* Inhalt Card */}
      <Card>
        <CardHeader>
          <CardTitle>Inhalt</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <dt className="text-sm font-medium text-muted-foreground">Hauptthema</dt>
            <dd className="mt-1">{newsletter.main_topic}</dd>
          </div>
          {newsletter.intention && (
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Intention</dt>
              <dd className="mt-1">{getLabel(INTENTION_OPTIONS, newsletter.intention)}</dd>
            </div>
          )}
          {newsletter.key_messages && (
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Kernaussagen</dt>
              <dd className="mt-1 whitespace-pre-wrap">{newsletter.key_messages}</dd>
            </div>
          )}
          {newsletter.offer && (
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Angebot</dt>
              <dd className="mt-1">{newsletter.offer}</dd>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stil & Format Card */}
      <Card>
        <CardHeader>
          <CardTitle>Stil & Format</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {newsletter.cta && (
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Call-to-Action</dt>
                <dd className="mt-1">{getLabel(CTA_OPTIONS, newsletter.cta)}</dd>
              </div>
            )}
            {newsletter.length && (
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Länge</dt>
                <dd className="mt-1">{getLabel(LENGTH_OPTIONS, newsletter.length)}</dd>
              </div>
            )}
            {newsletter.layout && (
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Layout</dt>
                <dd className="mt-1">{getLabel(LAYOUT_OPTIONS, newsletter.layout)}</dd>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Bilder Card */}
      {(newsletter.hero_image_url || newsletter.content_image_url || newsletter.offer_image_url) && (
        <Card>
          <CardHeader>
            <CardTitle>Bilder</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {newsletter.hero_image_url && (
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Hero-Bild</dt>
                <dd className="mt-1">
                  {/* Fixed aspect ratio container prevents CLS */}
                  <div className="max-w-xs aspect-video bg-muted rounded overflow-hidden">
                    <img
                      src={newsletter.hero_image_url}
                      alt="Hero"
                      width={320}
                      height={180}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </dd>
              </div>
            )}
            {newsletter.content_image_url && (
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Inhaltsbild</dt>
                <dd className="mt-1">
                  <div className="max-w-xs aspect-video bg-muted rounded overflow-hidden">
                    <img
                      src={newsletter.content_image_url}
                      alt="Content"
                      width={320}
                      height={180}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </dd>
              </div>
            )}
            {newsletter.offer_image_url && (
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Angebotsbild</dt>
                <dd className="mt-1">
                  <div className="max-w-xs aspect-video bg-muted rounded overflow-hidden">
                    <img
                      src={newsletter.offer_image_url}
                      alt="Offer"
                      width={320}
                      height={180}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </dd>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Planung Card */}
      <Card>
        <CardHeader>
          <CardTitle>Planung</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {newsletter.planned_send_date && (
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Geplantes Sendedatum</dt>
              <dd className="mt-1">
                {format(new Date(newsletter.planned_send_date), 'dd. MMMM yyyy', { locale: de })}
              </dd>
            </div>
          )}
          {newsletter.notes && (
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Notizen</dt>
              <dd className="mt-1 whitespace-pre-wrap">{newsletter.notes}</dd>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
