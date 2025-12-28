'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createNewsletter, updateNewsletter, deleteNewsletter } from '@/lib/db/newsletters';
import { newsletterKeys, newslettersQueryOptions, newsletterQueryOptions } from '@/lib/queries/newsletters';
import type { NewsletterCreate, NewsletterUpdate } from '@/types';

// Re-export for convenience
export { newsletterKeys, newslettersQueryOptions, newsletterQueryOptions };

export function useNewsletters() {
  return useQuery(newslettersQueryOptions());
}

export function useNewsletter(id: string | null) {
  return useQuery({
    ...newsletterQueryOptions(id || ''),
    enabled: Boolean(id),
  });
}

export function useCreateNewsletter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: NewsletterCreate) => createNewsletter(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: newsletterKeys.lists() });
    },
  });
}

export function useUpdateNewsletter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: NewsletterUpdate }) => updateNewsletter(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: newsletterKeys.lists() });
      queryClient.invalidateQueries({ queryKey: newsletterKeys.detail(id) });
    },
  });
}

export function useDeleteNewsletter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteNewsletter(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: newsletterKeys.lists() });
    },
  });
}
