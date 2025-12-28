'use client';

import { useRouter } from 'next/navigation';
import { useCreateBrand } from '@/hooks/useBrands';
import { BrandForm } from '@/components/forms/BrandForm';
import type { BrandFormData } from '@/lib/validations/brand';
import { toast } from 'sonner';

export default function NewBrandPage() {
  const router = useRouter();
  const createMutation = useCreateBrand();

  const handleSubmit = async (data: BrandFormData) => {
    try {
      const brand = await createMutation.mutateAsync(data);
      toast.success('Firmenprofil erstellt');
      router.push(`/brands/${brand.id}`);
    } catch {
      toast.error('Fehler beim Erstellen');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Neues Firmenprofil</h1>
        <p className="text-muted-foreground">
          Erstellen Sie ein neues Markenprofil für Ihre Newsletter
        </p>
      </div>

      <BrandForm
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending}
        submitLabel="Profil erstellen"
      />
    </div>
  );
}
