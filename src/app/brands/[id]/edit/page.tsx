'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { useBrand, useUpdateBrand } from '@/hooks/useBrands';
import { BrandForm } from '@/components/forms/BrandForm';
import type { BrandFormData } from '@/lib/validations/brand';
import { toast } from 'sonner';

interface EditBrandPageProps {
  params: Promise<{ id: string }>;
}

export default function EditBrandPage({ params }: EditBrandPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { data: brand, isLoading, error } = useBrand(id);
  const updateMutation = useUpdateBrand();

  const handleSubmit = async (data: BrandFormData) => {
    try {
      await updateMutation.mutateAsync({ id, data });
      toast.success('Firmenprofil aktualisiert');
      router.push(`/brands/${id}`);
    } catch {
      toast.error('Fehler beim Aktualisieren');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Laden...</p>
      </div>
    );
  }

  if (error || !brand) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-destructive">Firmenprofil nicht gefunden</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Firmenprofil bearbeiten</h1>
        <p className="text-muted-foreground">{brand.name}</p>
      </div>

      <BrandForm
        defaultValues={brand}
        onSubmit={handleSubmit}
        isLoading={updateMutation.isPending}
        submitLabel="Änderungen speichern"
      />
    </div>
  );
}
