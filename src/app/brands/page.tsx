import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query-client';
import { brandsQueryOptions } from '@/lib/queries/brands';
import { BrandsPageClient } from './BrandsPageClient';

/**
 * Brands list page with server-side prefetching.
 * Data is fetched on the server and hydrated to the client,
 * eliminating the loading spinner on initial render.
 */
export default async function BrandsPage() {
  const queryClient = getQueryClient();

  // Prefetch brands on the server
  await queryClient.prefetchQuery(brandsQueryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BrandsPageClient />
    </HydrationBoundary>
  );
}
