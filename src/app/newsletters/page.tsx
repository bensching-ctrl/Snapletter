import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query-client';
import { newslettersQueryOptions } from '@/lib/queries/newsletters';
import { brandsQueryOptions } from '@/lib/queries/brands';
import { NewslettersPageClient } from './NewslettersPageClient';

/**
 * Newsletters list page with server-side prefetching.
 * Both newsletters and brands are prefetched in parallel on the server,
 * eliminating data waterfalls and loading spinners on initial render.
 */
export default async function NewslettersPage() {
  const queryClient = getQueryClient();

  // Prefetch newsletters and brands in parallel
  await Promise.all([
    queryClient.prefetchQuery(newslettersQueryOptions()),
    queryClient.prefetchQuery(brandsQueryOptions()),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NewslettersPageClient />
    </HydrationBoundary>
  );
}
