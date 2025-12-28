'use client';

import { useRouter } from 'next/navigation';
import { useCreateNewsletter } from '@/hooks/useNewsletters';
import { useNewsletterGeneration } from '@/hooks/useNewsletterGeneration';
import { NewsletterWizard } from '@/components/forms/NewsletterWizard';
import type { NewsletterFormData } from '@/lib/validations/newsletter';
import { toast } from 'sonner';

export default function NewNewsletterPage() {
  const router = useRouter();
  const createMutation = useCreateNewsletter();
  const generation = useNewsletterGeneration({
    onSuccess: () => {
      toast.info('Newsletter wird generiert...');
    },
    onError: (err) => {
      toast.error(`Generierungsfehler: ${err.message}`);
    },
  });

  const handleSubmit = async (data: NewsletterFormData) => {
    // Validierung: brand_id muss gesetzt sein
    if (!data.brand_id) {
      toast.error('Bitte wählen Sie ein Firmenprofil aus');
      return;
    }

    try {
      // 1. Newsletter erstellen
      const newsletter = await createMutation.mutateAsync(data);
      toast.success('Newsletter erstellt');

      // 2. Direkt zur Detail-Seite navigieren
      router.push(`/newsletters/${newsletter.id}`);

      // 3. Generierung starten (im Hintergrund)
      try {
        await generation.startGeneration(newsletter.id, data.brand_id);
      } catch (genError) {
        console.error('Generation error:', genError);
        // Fehler wird durch onError-Callback behandelt (Toast)
      }
    } catch (createError) {
      console.error('Create error:', createError);
      const errorMessage = createError instanceof Error 
        ? createError.message 
        : 'Fehler beim Erstellen des Newsletters';
      toast.error(errorMessage);
    }
  };

  const handleSaveDraft = async (data: NewsletterFormData) => {
    try {
      const newsletter = await createMutation.mutateAsync(data);
      toast.success('Entwurf gespeichert');
      router.push(`/newsletters/${newsletter.id}`);
    } catch {
      toast.error('Fehler beim Speichern');
    }
  };

  const handleCancel = () => {
    router.push('/newsletters');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Neuer Newsletter</h1>
        <p className="text-muted-foreground mt-2">
          Erstellen Sie in wenigen Schritten Ihren Newsletter
        </p>
      </div>

      <NewsletterWizard
        onSubmit={handleSubmit}
        onSaveDraft={handleSaveDraft}
        onCancel={handleCancel}
        isLoading={createMutation.isPending || generation.isPending}
      />
    </div>
  );
}
