'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createBrand, updateBrand, deleteBrand } from '@/lib/db/brands';
import { brandKeys, brandsQueryOptions, brandQueryOptions } from '@/lib/queries/brands';
import type { BrandCreate, BrandUpdate } from '@/types';

// Re-export for convenience
export { brandKeys, brandsQueryOptions, brandQueryOptions };

export function useBrands() {
  return useQuery(brandsQueryOptions());
}

export function useBrand(id: string | null) {
  return useQuery({
    ...brandQueryOptions(id || ''),
    enabled: Boolean(id),
  });
}

export function useCreateBrand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BrandCreate) => createBrand(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: brandKeys.lists() });
    },
  });
}

export function useUpdateBrand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: BrandUpdate }) => updateBrand(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: brandKeys.lists() });
      queryClient.invalidateQueries({ queryKey: brandKeys.detail(id) });
    },
  });
}

export function useDeleteBrand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteBrand(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: brandKeys.lists() });
    },
  });
}
