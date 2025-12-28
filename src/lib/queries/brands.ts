import { queryOptions } from '@tanstack/react-query';
import { getBrands, getBrandById } from '@/lib/db/brands';

export const brandKeys = {
  all: ['brands'] as const,
  lists: () => [...brandKeys.all, 'list'] as const,
  list: () => [...brandKeys.lists()] as const,
  details: () => [...brandKeys.all, 'detail'] as const,
  detail: (id: string) => [...brandKeys.details(), id] as const,
};

/**
 * Query options for fetching all brands.
 * Can be used for both client-side hooks and server-side prefetching.
 */
export const brandsQueryOptions = () =>
  queryOptions({
    queryKey: brandKeys.list(),
    queryFn: getBrands,
  });

/**
 * Query options for fetching a single brand by ID.
 * Can be used for both client-side hooks and server-side prefetching.
 */
export const brandQueryOptions = (id: string) =>
  queryOptions({
    queryKey: brandKeys.detail(id),
    queryFn: () => getBrandById(id),
  });
