'use client';

import { useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { updateNewsletterStatus } from '@/lib/db/newsletters';
import { newsletterKeys } from './useNewsletters';

interface UseNewsletterGenerationOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useNewsletterGeneration(options: UseNewsletterGenerationOptions = {}) {
  const { onSuccess, onError } = options;

  const queryClient = useQueryClient();
  const [isPending, setIsPending] = useState(false);

  const startGeneration = useCallback(async (newsletterId: string, brandId?: string | null) => {
    setIsPending(true);
    try {
      // 1. Status auf 'generating' setzen
      await updateNewsletterStatus(newsletterId, 'generating');
      queryClient.invalidateQueries({ queryKey: newsletterKeys.detail(newsletterId) });

      // 2. Webhook über API-Route triggern (vermeidet CORS-Probleme)
      const response = await fetch('/api/newsletters/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newsletter_id: newsletterId,
          ...(brandId && { brand_id: brandId }),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || `HTTP-Fehler: ${response.status} ${response.statusText}`;
        throw new Error(errorMessage);
      }

      onSuccess?.();
    } catch (error) {
      console.error('Generation error:', error);

      // Status auf 'error' setzen, damit User nicht in 'generating' hängen bleibt
      try {
        await updateNewsletterStatus(newsletterId, 'error');
        queryClient.invalidateQueries({ queryKey: newsletterKeys.detail(newsletterId) });
        queryClient.invalidateQueries({ queryKey: newsletterKeys.lists() });
      } catch (statusError) {
        console.error('Failed to update status to error:', statusError);
      }

      onError?.(error instanceof Error ? error : new Error('Generierung konnte nicht gestartet werden'));
    } finally {
      setIsPending(false);
    }
  }, [queryClient, onSuccess, onError]);

  return {
    isPending,
    startGeneration,
  };
}
