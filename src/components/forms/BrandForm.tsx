'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { brandSchema, type BrandFormData } from '@/lib/validations/brand';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Brand } from '@/types';

interface BrandFormProps {
  defaultValues?: Partial<Brand>;
  onSubmit: (data: BrandFormData) => void;
  isLoading?: boolean;
  submitLabel?: string;
  isEditing?: boolean;
}

export function BrandForm({ defaultValues, onSubmit, isLoading, submitLabel, isEditing = false }: BrandFormProps) {
  const defaultSubmitLabel = isEditing ? 'Änderungen speichern' : 'Profil erstellen';
  const form = useForm<BrandFormData>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      name: defaultValues?.name || '',
      description: defaultValues?.description || '',
      target_audience: defaultValues?.target_audience || '',
      usps: defaultValues?.usps || '',
      tone_of_voice: defaultValues?.tone_of_voice || '',
      brand_words: defaultValues?.brand_words || '',
      no_go_words: defaultValues?.no_go_words || '',
      brand_colors: defaultValues?.brand_colors || '',
      visual_style: defaultValues?.visual_style || '',
      logo_url: defaultValues?.logo_url || '',
    },
    mode: 'onChange',
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
        {/* Grundinformationen */}
        <Card>
          <CardHeader>
            <CardTitle>Grundinformationen</CardTitle>
            <p className="text-sm text-muted-foreground">
              Basisinformationen zur Marke, die in jedem Newsletter berücksichtigt werden.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name *</FormLabel>
                  <FormControl showSuccessIndicator aria-required="true">
                    <Input placeholder="z.B. TechStart GmbH, Mode Müller" {...field} />
                  </FormControl>
                  <FormDescription>
                    Wird in Newslettern als Absendername verwendet.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Beschreibung</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="z.B. Wir sind ein Tech-Startup, das KI-Lösungen für den Mittelstand entwickelt..."
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Hilft der KI, den Kontext für passende Formulierungen zu verstehen.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="target_audience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Zielgruppe</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="z.B. IT-Entscheider in Unternehmen mit 50-500 Mitarbeitern, technikaffin, budget-bewusst"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Je genauer, desto passender werden Ansprache und Argumente.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="usps"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>USPs / Alleinstellungsmerkmale</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="z.B. 24h Support, Made in Germany, 30 Tage Rückgabe, Familienunternehmen seit 1950"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Diese Punkte werden in Newslettern gezielt hervorgehoben.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Tonalität & Sprache */}
        <Card>
          <CardHeader>
            <CardTitle>Tonalität & Sprache</CardTitle>
            <p className="text-sm text-muted-foreground">
              Definiert den sprachlichen Charakter aller generierten Texte.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="tone_of_voice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tonalität / Style Guide</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="z.B. Wir duzen unsere Kunden, sprechen locker aber kompetent, nutzen keine Anglizismen"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Bestimmt, wie die KI mit Ihren Lesern kommuniziert.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="brand_words"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Markentypische Begriffe</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="z.B. 'smarte Lösung', 'Qualität aus Überzeugung', 'Ihr Partner für...'"
                      rows={2}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Wörter und Phrasen, die die KI bevorzugt einsetzen soll.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="no_go_words"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>No-Go Wörter</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="z.B. 'billig' (stattdessen: preiswert), keine Superlative, nicht 'revolutionär'"
                      rows={2}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Begriffe, die die KI in Texten niemals verwenden soll.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Visuelles */}
        <Card>
          <CardHeader>
            <CardTitle>Visuelles</CardTitle>
            <p className="text-sm text-muted-foreground">
              Optionale Hinweise für visuelle Konsistenz.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="brand_colors"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Markenfarben</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="z.B. Primär: #0066CC (Blau), Sekundär: #FF9900 (Orange), Akzent: #333333"
                      rows={2}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Für zukünftige Template-Generierung und Bildauswahl.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="visual_style"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Visueller Stil</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="z.B. Moderne, cleane Bilder, keine Stockfotos mit übertriebenen Gesten, authentische Teambilder"
                      rows={2}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Hilft bei der Auswahl passender Bildvorschläge.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="logo_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logo URL</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://example.com/logo.png"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormDescription>
                    Wird in der Übersicht und zukünftig im Newsletter-Header angezeigt.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Wird gespeichert...' : (submitLabel || defaultSubmitLabel)}
          </Button>
        </div>
      </form>
    </Form>
  );
}
