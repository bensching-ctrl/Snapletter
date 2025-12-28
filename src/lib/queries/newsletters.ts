import { queryOptions } from '@tanstack/react-query';
import { getNewsletters, getNewsletterById } from '@/lib/db/newsletters';

export const newsletterKeys = {
  all: ['newsletters'] as const,
  lists: () => [...newsletterKeys.all, 'list'] as const,
  list: () => [...newsletterKeys.lists()] as const,
  details: () => [...newsletterKeys.all, 'detail'] as const,
  detail: (id: string) => [...newsletterKeys.details(), id] as const,
};

/**
 * Query options for fetching all newsletters.
 * Can be used for both client-side hooks and server-side prefetching.
 */
export const newslettersQueryOptions = () =>
  queryOptions({
    queryKey: newsletterKeys.list(),
    queryFn: getNewsletters,
  });

/**
 * Query options for fetching a single newsletter by ID.
 * Can be used for both client-side hooks and server-side prefetching.
 */
export const newsletterQueryOptions = (id: string) =>
  queryOptions({
    queryKey: newsletterKeys.detail(id),
    queryFn: () => getNewsletterById(id),
  });
