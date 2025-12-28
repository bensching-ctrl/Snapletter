'use client';

import Link from 'next/link';
import { useBrand } from '@/hooks/useBrands';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loading } from '@/components/ui/loading';

interface BrandDetailClientProps {
  id: string;
}

export function BrandDetailClient({ id }: BrandDetailClientProps) {
  const { data: brand, isLoading, error } = useBrand(id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loading text="Firmenprofil wird geladen..." />
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

  // Sektionen für die Anzeige
  const sections = [
    {
      title: 'Grundinformationen',
      fields: [
        { label: 'Name', value: brand.name },
        { label: 'Beschreibung', value: brand.description },
        { label: 'Zielgruppe', value: brand.target_audience },
        { label: 'USPs', value: brand.usps },
      ],
    },
    {
      title: 'Tonalität & Sprache',
      fields: [
        { label: 'Tonalität', value: brand.tone_of_voice },
        { label: 'Markentypische Begriffe', value: brand.brand_words },
        { label: 'No-Go Wörter', value: brand.no_go_words },
      ],
    },
    {
      title: 'Visuelles',
      fields: [
        { label: 'Markenfarben', value: brand.brand_colors },
        { label: 'Visueller Stil', value: brand.visual_style },
        { label: 'Logo URL', value: brand.logo_url },
      ],
    },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-8 readonly">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Fixed size container for logo to prevent CLS */}
          <div className="w-16 h-16 shrink-0">
            {brand.logo_url && (
              <img
                src={brand.logo_url}
                alt={`${brand.name} Logo`}
                width={64}
                height={64}
                className="w-16 h-16 object-contain rounded"
              />
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold">{brand.name}</h1>
            <p className="text-muted-foreground">Firmenprofil</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/brands">Zurück</Link>
          </Button>
          <Button asChild>
            <Link href={`/brands/${brand.id}/edit`}>Bearbeiten</Link>
          </Button>
        </div>
      </div>

      {sections.map((section) => (
        <Card key={section.title}>
          <CardHeader>
            <CardTitle>{section.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {section.fields.map((field) => (
              <div key={field.label}>
                <dt className="text-sm font-medium text-muted-foreground">
                  {field.label}
                </dt>
                <dd className="mt-1 whitespace-pre-wrap">
                  {field.value || <span className="text-muted-foreground italic">Nicht angegeben</span>}
                </dd>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
