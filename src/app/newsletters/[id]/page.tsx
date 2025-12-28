import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query-client';
import { newsletterQueryOptions } from '@/lib/queries/newsletters';
import { NewsletterDetailClient } from './NewsletterDetailClient';

interface NewsletterDetailPageProps {
  params: Promise<{ id: string }>;
}

/**
 * Newsletter detail page with server-side prefetching.
 * Data is fetched on the server and hydrated to the client,
 * eliminating the loading spinner on initial render.
 *
 * Note: Brand data is fetched client-side since it depends on
 * the newsletter's brand_id which is only known after the
 * newsletter is fetched.
 */
export default async function NewsletterDetailPage({ params }: NewsletterDetailPageProps) {
  const { id } = await params;
  const queryClient = getQueryClient();

  // Prefetch newsletter on the server
  await queryClient.prefetchQuery(newsletterQueryOptions(id));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NewsletterDetailClient id={id} />
    </HydrationBoundary>
  );
}
