'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { newsletterSchema, type NewsletterFormData } from '@/lib/validations/newsletter';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BrandSelector } from '@/components/brand/BrandSelector';
import {
  INTENTION_OPTIONS,
  CTA_OPTIONS,
  LENGTH_OPTIONS,
  LAYOUT_OPTIONS,
} from '@/types/newsletter';
import type { Newsletter } from '@/types';

interface NewsletterFormProps {
  defaultValues?: Partial<Newsletter>;
  onSubmit: (data: NewsletterFormData) => void;
  isLoading?: boolean;
  submitLabel?: string;
  isEditing?: boolean;
}

export function NewsletterForm({ defaultValues, onSubmit, isLoading, submitLabel, isEditing = false }: NewsletterFormProps) {
  const defaultSubmitLabel = isEditing ? 'Änderungen speichern' : 'Newsletter erstellen';
  const form = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: {
      brand_id: defaultValues?.brand_id || null,
      main_topic: defaultValues?.main_topic || '',
      intention: defaultValues?.intention || 'informieren',
      key_messages: defaultValues?.key_messages || '',
      offer: defaultValues?.offer || '',
      cta: defaultValues?.cta || 'mehr_erfahren',
      length: defaultValues?.length || 'mittel',
      layout: defaultValues?.layout || 'klassisch',
      hero_image_url: defaultValues?.hero_image_url || '',
      content_image_url: defaultValues?.content_image_url || '',
      offer_image_url: defaultValues?.offer_image_url || '',
      planned_send_date: defaultValues?.planned_send_date || null,
      notes: defaultValues?.notes || '',
      status: defaultValues?.status || 'idle',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
        <Card>
          <CardHeader>
            <CardTitle>Firmenprofil</CardTitle>
            <p className="text-sm text-muted-foreground">Verknüpft Markendaten wie Tonalität und Zielgruppe mit diesem Newsletter.</p>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="brand_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verknüpftes Firmenprofil</FormLabel>
                  <FormControl>
                    <BrandSelector
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Firmenprofil auswählen (optional)"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inhalt</CardTitle>
            <p className="text-sm text-muted-foreground">Thema und zentrale Aussagen, die im Newsletter vermittelt werden sollen.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="main_topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Hauptthema</FormLabel>
                  <FormControl>
                    <Input placeholder="z.B. Neue Produkteinführung, Saisonale Angebote, Branchennews" {...field} />
                  </FormControl>
                  <FormDescription>
                    Das zentrale Thema, um das sich Ihr Newsletter dreht
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="intention"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Intention</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Ziel des Newsletters" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {INTENTION_OPTIONS.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Steuert Fokus und Ausrichtung des Newsletters.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="key_messages"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kernaussagen</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Geben Sie 3-5 zentrale Botschaften ein (je Zeile eine)&#10;z.B. Kostenersparnis von bis zu 30%&#10;z.B. Einfache Integration in bestehende Systeme"
                      rows={4}
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormDescription>
                    Diese Kernbotschaften werden im Newsletter prominent hervorgehoben
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="offer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Angebot / Produkt</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="z.B. Premium-Paket, Beratungsgespräch, Webinar-Teilnahme"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormDescription>
                    Optional: Ein konkretes Angebot oder Produkt, das vorgestellt wird
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Stil & Format</CardTitle>
            <p className="text-sm text-muted-foreground">Bestimmt Länge und Aufbau des generierten Newsletters.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="cta"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Call-to-Action</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="CTA auswählen" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CTA_OPTIONS.map(opt => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Standard-CTA für die meisten Newsletter. Anpassbar je nach Ziel.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="length"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Länge</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Länge auswählen" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {LENGTH_OPTIONS.map(opt => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Empfohlen für gute Lesbarkeit. Bei Bedarf anpassen.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="layout"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Layout</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Layout auswählen" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {LAYOUT_OPTIONS.map(opt => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Beeinflusst die visuelle Struktur, nicht den Inhalt.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bilder</CardTitle>
            <p className="text-sm text-muted-foreground">Optionale Bilder, die in den Newsletter eingebunden werden.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="hero_image_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hero-Bild URL</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://example.com/hero.jpg"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content_image_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Inhaltsbild URL</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://example.com/content.jpg"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="offer_image_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Angebotsbild URL</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://example.com/offer.jpg"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Planung</CardTitle>
            <p className="text-sm text-muted-foreground">Sendedatum und interne Notizen zur Koordination.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="planned_send_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Geplantes Sendedatum</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      value={field.value || ''}
                      onChange={(e) => field.onChange(e.target.value || null)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notizen</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Freie Anmerkungen oder redaktionelle Hinweise"
                      rows={3}
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
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
