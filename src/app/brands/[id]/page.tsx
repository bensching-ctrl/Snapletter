import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query-client';
import { brandQueryOptions } from '@/lib/queries/brands';
import { BrandDetailClient } from './BrandDetailClient';

interface BrandDetailPageProps {
  params: Promise<{ id: string }>;
}

/**
 * Brand detail page with server-side prefetching.
 * Data is fetched on the server and hydrated to the client,
 * eliminating the loading spinner on initial render.
 */
export default async function BrandDetailPage({ params }: BrandDetailPageProps) {
  const { id } = await params;
  const queryClient = getQueryClient();

  // Prefetch brand on the server
  await queryClient.prefetchQuery(brandQueryOptions(id));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BrandDetailClient id={id} />
    </HydrationBoundary>
  );
}
