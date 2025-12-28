'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { useNewsletter, useUpdateNewsletter } from '@/hooks/useNewsletters';
import { NewsletterForm } from '@/components/forms/NewsletterForm';
import type { NewsletterFormData } from '@/lib/validations/newsletter';
import { toast } from 'sonner';

interface EditNewsletterPageProps {
  params: Promise<{ id: string }>;
}

export default function EditNewsletterPage({ params }: EditNewsletterPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { data: newsletter, isLoading, error } = useNewsletter(id);
  const updateMutation = useUpdateNewsletter();

  const handleSubmit = async (data: NewsletterFormData) => {
    try {
      await updateMutation.mutateAsync({ id, data });
      toast.success('Newsletter aktualisiert');
      router.push(`/newsletters/${id}`);
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

  if (error || !newsletter) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-destructive">Newsletter nicht gefunden</p>
      </div>
    );
  }

  if (newsletter.status !== 'idle') {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">
          Newsletter kann nicht mehr bearbeitet werden, da die Generierung bereits gestartet wurde.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Newsletter bearbeiten</h1>
        <p className="text-muted-foreground">{newsletter.main_topic}</p>
      </div>

      <NewsletterForm
        defaultValues={newsletter}
        onSubmit={handleSubmit}
        isLoading={updateMutation.isPending}
        submitLabel="Änderungen speichern"
      />
    </div>
  );
}
