import type { Newsletter, NewsletterStatus } from '@/types';

/**
 * UI-State für Newsletter-Anzeige
 * - idle: Newsletter ist im Entwurf, kann bearbeitet/generiert werden
 * - generating: Newsletter wird gerade generiert (Loading-State)
 * - done: Newsletter wurde erfolgreich generiert (Preview anzeigen)
 * - failed: Generierung fehlgeschlagen (Retry-Option anzeigen)
 */
export type NewsletterUiState = 'idle' | 'generating' | 'done' | 'failed';

export interface NewsletterUiStateInfo {
  state: NewsletterUiState;
  label: string;
  description: string;
  canEdit: boolean;
  canGenerate: boolean;
  canRetry: boolean;
  canRegenerate: boolean;
  showPreview: boolean;
}

/**
 * Mappt den DB-Status auf einen konsistenten UI-State
 * Behandelt auch null/undefined Werte
 */
export function getNewsletterUiState(newsletter: Newsletter | null | undefined): NewsletterUiStateInfo {
  if (!newsletter) {
    return {
      state: 'idle',
      label: 'Nicht gefunden',
      description: 'Newsletter wurde nicht gefunden',
      canEdit: false,
      canGenerate: false,
      canRetry: false,
      canRegenerate: false,
      showPreview: false,
    };
  }

  const status: NewsletterStatus = newsletter.status || 'idle';

  switch (status) {
    case 'idle':
      return {
        state: 'idle',
        label: 'Entwurf',
        description: 'Newsletter kann bearbeitet und generiert werden',
        canEdit: true,
        canGenerate: true,
        canRetry: false,
        canRegenerate: false,
        showPreview: false,
      };

    case 'generating':
      return {
        state: 'generating',
        label: 'Wird generiert...',
        description: 'Newsletter wird erstellt. Bitte warten...',
        canEdit: false,
        canGenerate: false,
        canRetry: false,
        canRegenerate: false,
        showPreview: false,
      };

    case 'done':
      return {
        state: 'done',
        label: 'Fertig',
        description: 'Newsletter wurde erfolgreich generiert',
        canEdit: false,
        canGenerate: false,
        canRetry: false,
        canRegenerate: true,
        showPreview: true,
      };

    case 'error':
      return {
        state: 'failed',
        label: 'Fehler',
        description: 'Die Generierung ist fehlgeschlagen',
        canEdit: true,
        canGenerate: false,
        canRetry: true,
        canRegenerate: false,
        showPreview: false,
      };

    default:
      return {
        state: 'idle',
        label: 'Unbekannt',
        description: 'Unbekannter Status',
        canEdit: true,
        canGenerate: true,
        canRetry: false,
        canRegenerate: false,
        showPreview: false,
      };
  }
}

/**
 * Prüft ob der Newsletter Generierungsergebnisse hat
 */
export function hasGeneratedContent(newsletter: Newsletter | null | undefined): boolean {
  if (!newsletter) return false;
  return !!(newsletter.generated_subject || newsletter.generated_html || newsletter.generated_text);
}
