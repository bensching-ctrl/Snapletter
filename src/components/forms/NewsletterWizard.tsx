'use client';

import { useState } from 'react';
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { BrandSelector } from '@/components/brand/BrandSelector';
import {
  INTENTION_OPTIONS,
  CTA_OPTIONS,
  LENGTH_OPTIONS,
  LAYOUT_OPTIONS,
} from '@/types/newsletter';
import { Check, ChevronDown, ChevronRight, Loader2, AlertCircle, ArrowLeft, Sparkles, Zap } from 'lucide-react';
import type { Newsletter } from '@/types';
import { demoPreset } from '@/lib/demo-preset';

interface NewsletterWizardProps {
  defaultValues?: Partial<Newsletter>;
  onSubmit: (data: NewsletterFormData) => void;
  onSaveDraft?: (data: NewsletterFormData) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  showDemoOption?: boolean;
}

const STEPS = [
  { id: 1, title: 'Inhalt', description: 'Thema und Kernaussagen' },
  { id: 2, title: 'Stil & Format', description: 'CTA, Länge, Layout' },
  { id: 3, title: 'Optional', description: 'Bilder, Planung, Notizen' },
] as const;

export function NewsletterWizard({ defaultValues, onSubmit, onSaveDraft, onCancel, isLoading, showDemoOption = true }: NewsletterWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [imagesOpen, setImagesOpen] = useState(false);
  const [planningOpen, setPlanningOpen] = useState(false);
  const [demoApplied, setDemoApplied] = useState(false);

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
    mode: 'onChange',
  });

  // Watch für Echtzeit-Validierung
  const mainTopic = form.watch('main_topic');
  const hasMainTopic = mainTopic && mainTopic.trim().length > 0;
  
  const brandId = form.watch('brand_id');
  const hasBrandId = brandId !== null && brandId !== undefined && brandId.trim() !== '';

  // Fehlende Pflichtfelder ermitteln
  const getMissingFields = (): string[] => {
    const missing: string[] = [];
    if (!hasMainTopic) missing.push('Hauptthema');
    return missing;
  };

  const missingFields = getMissingFields();
  const canGenerate = missingFields.length === 0;

  // Validierung für Step 1 (Inhalt)
  const validateStep1 = async (): Promise<boolean> => {
    const result = await form.trigger(['main_topic', 'brand_id', 'intention', 'key_messages', 'offer']);
    return result;
  };

  // Validierung für Step 2 (Stil & Format)
  const validateStep2 = async (): Promise<boolean> => {
    const result = await form.trigger(['cta', 'length', 'layout']);
    return result;
  };

  const handleNext = async () => {
    if (currentStep === 1) {
      const isValid = await validateStep1();
      if (!isValid) return;
    } else if (currentStep === 2) {
      const isValid = await validateStep2();
      if (!isValid) return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleStepClick = async (step: number) => {
    // Nur zurück navigieren erlaubt, oder nach vorne wenn validiert
    if (step < currentStep) {
      setCurrentStep(step);
    } else if (step === currentStep + 1) {
      await handleNext();
    }
  };

  const handleSaveDraft = () => {
    if (onSaveDraft) {
      onSaveDraft(form.getValues());
    }
  };

  const handleLoadDemo = () => {
    form.reset(demoPreset);
    setDemoApplied(true);
  };

  const handleSubmit = form.handleSubmit(onSubmit);

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-6 pb-28">
        {/* Demo CTA Box */}
        {showDemoOption && !demoApplied && (
          <div data-slot="callout" className="relative overflow-hidden rounded-lg border bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 p-4 mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-primary/10 p-2">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Beispiel-Newsletter in 30 Sekunden</h3>
                  <p className="text-sm text-muted-foreground">
                    Testen Sie die Generierung mit vorausgefüllten Demo-Daten
                  </p>
                </div>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleLoadDemo}
                  className="flex-1 sm:flex-none"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Demo laden
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Demo Applied Info */}
        {demoApplied && (
          <div data-slot="alert" className="flex items-center gap-2 text-sm text-primary bg-primary/5 rounded-lg px-4 py-2 mb-4">
            <Sparkles className="h-4 w-4" />
            <span>Demo-Daten geladen. Sie können die Felder nach Belieben anpassen.</span>
          </div>
        )}

        {/* Stepper */}
        <div data-slot="stepper" className="flex items-center justify-center mb-8">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center">
              {/* Step Circle */}
              <button
                type="button"
                onClick={() => handleStepClick(step.id)}
                className={`
                  flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all select-none
                  ${currentStep === step.id
                    ? 'border-primary bg-primary text-primary-foreground'
                    : currentStep > step.id
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-muted-foreground/30 text-muted-foreground'
                  }
                  ${step.id <= currentStep ? 'cursor-pointer hover:opacity-80' : 'cursor-default'}
                `}
              >
                {currentStep > step.id ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span className="font-semibold">{step.id}</span>
                )}
              </button>

              {/* Step Label */}
              <div data-slot="stepper-label" className="ml-3 mr-8 hidden sm:block">
                <p className={`text-sm font-medium ${currentStep >= step.id ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {step.title}
                </p>
                <p className="text-xs text-muted-foreground">{step.description}</p>
              </div>

              {/* Connector Line */}
              {index < STEPS.length - 1 && (
                <div
                  className={`
                    w-12 h-0.5 mr-4
                    ${currentStep > step.id ? 'bg-primary' : 'bg-muted-foreground/30'}
                  `}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Inhalt */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Inhalt</CardTitle>
              <p className="text-sm text-muted-foreground">
                Thema und zentrale Aussagen, die im Newsletter vermittelt werden sollen.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="brand_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Firmenprofil</FormLabel>
                    <FormControl>
                      <BrandSelector
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Firmenprofil auswählen (optional)"
                      />
                    </FormControl>
                    <FormDescription>
                      Übernimmt automatisch Tonalität, Zielgruppe und Markenwörter.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="main_topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hauptthema *</FormLabel>
                    <FormControl showSuccessIndicator aria-required="true">
                      <Input placeholder="z.B. Frühjahrskollektion 2025, Expertentipps zur Steuererklärung" {...field} />
                    </FormControl>
                    <FormDescription>
                      Wird für Betreffzeile und Einstieg verwendet – je konkreter, desto besser.
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
                    <Select onValueChange={field.onChange} value={field.value || undefined}>
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
                      Bestimmt, ob der Newsletter informiert, verkauft oder eine Geschichte erzählt.
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
                        placeholder="z.B.&#10;• 20% Rabatt nur diese Woche&#10;• Kostenloser Versand ab 50€&#10;• Neue Sommerfarben eingetroffen"
                        rows={4}
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormDescription>
                      Diese Punkte werden im Newsletter hervorgehoben – ideal für Aufzählungen.
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
                        placeholder="z.B. Premium-Jahresabo, Beratungsgespräch, Produktname"
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormDescription>
                      Falls vorhanden – wird im Call-to-Action-Bereich prominent platziert.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Next-Step Hinweis */}
              <p className="text-sm text-muted-foreground/70 pt-2 border-t">
                Im nächsten Schritt definieren Sie Stil und Format des Newsletters.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Stil & Format */}
        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Stil & Format</CardTitle>
              <p className="text-sm text-muted-foreground">
                Bestimmt Länge, Aufbau und Handlungsaufforderung des Newsletters.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="cta"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Call-to-Action</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || undefined}>
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
                      Der Button-Text am Ende – passend zur Intention wählen.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="length"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Länge</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || undefined}>
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
                        Kurz für schnelle Updates, Lang für ausführliche Inhalte.
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
                      <Select onValueChange={field.onChange} value={field.value || undefined}>
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
                        Klassisch für Text-lastige, Produktfokus für visuelle Newsletter.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Next-Step Hinweis */}
              <p className="text-sm text-muted-foreground/70 pt-2 border-t">
                Im letzten Schritt können Sie optional Bilder und Planungsdaten ergänzen.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Optional */}
        {currentStep === 3 && (
          <div className="space-y-4">
            {/* Info-Hinweis */}
            <p className="text-sm text-muted-foreground">
              Diese Felder sind optional. Sie können den Newsletter auch ohne weitere Angaben generieren.
            </p>

            {/* Bilder - Collapsible */}
            <Collapsible open={imagesOpen} onOpenChange={setImagesOpen}>
              <Card>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">Bilder</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          URLs zu Bildern, die im Newsletter erscheinen sollen
                        </p>
                      </div>
                      {imagesOpen ? (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="space-y-4 pt-0">
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
                          <FormDescription>
                            Großes Bild am Anfang des Newsletters – optimal 600px breit.
                          </FormDescription>
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
                          <FormDescription>
                            Illustriert den Hauptinhalt – erscheint im Textbereich.
                          </FormDescription>
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
                          <FormDescription>
                            Produktbild oder Grafik neben dem Call-to-Action.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Planung & Notizen - Collapsible */}
            <Collapsible open={planningOpen} onOpenChange={setPlanningOpen}>
              <Card>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">Planung & Notizen</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Internes Sendedatum und redaktionelle Hinweise
                        </p>
                      </div>
                      {planningOpen ? (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="space-y-4 pt-0">
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
                          <FormDescription>
                            Zur internen Planung – wird nicht im Newsletter angezeigt.
                          </FormDescription>
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
                              placeholder="z.B. Abstimmung mit Marketing nötig, Freigabe von Max ausstehend"
                              rows={3}
                              {...field}
                              value={field.value || ''}
                            />
                          </FormControl>
                          <FormDescription>
                            Interne Hinweise für Ihr Team – nicht Teil des Newsletters.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          </div>
        )}

        {/* Sticky Action Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-t z-50">
          <div className="max-w-3xl mx-auto px-4 py-4">
            {/* Firmenprofil fehlt Warning */}
            {!hasBrandId && currentStep === 3 && (
              <div data-slot="alert" className="flex items-start gap-2 text-sm text-destructive bg-destructive/5 rounded-lg px-4 py-3 mb-3">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Firmenprofil fehlt</p>
                  <p className="text-muted-foreground">
                    Bitte wählen Sie ein Firmenprofil aus oder nutzen Sie &quot;Demo laden&quot; für ein Beispiel.
                  </p>
                </div>
              </div>
            )}

            {/* Fehlende Pflichtfelder Hinweis - ruhig und klar */}
            {!canGenerate && currentStep === 3 && (
              <div data-slot="alert" className="flex items-center gap-2 text-sm text-muted-foreground mb-3 bg-muted/50 rounded-md px-3 py-2">
                <AlertCircle className="h-4 w-4 flex-shrink-0 text-amber-600 dark:text-amber-500" />
                <span>
                  Bitte füllen Sie das Feld <strong className="text-foreground">{missingFields.join(', ')}</strong> in Schritt 1 aus, um fortzufahren.
                </span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-between gap-3">
              {/* Linke Seite: Zurück / Abbrechen */}
              <div className="flex gap-2">
                {currentStep > 1 ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Zurück
                  </Button>
                ) : onCancel ? (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={onCancel}
                  >
                    Abbrechen
                  </Button>
                ) : null}
              </div>

              {/* Rechte Seite: Entwurf speichern + Weiter/Generieren */}
              <div className="flex gap-2">
                {onSaveDraft && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleSaveDraft}
                    disabled={isLoading}
                  >
                    Entwurf speichern
                  </Button>
                )}

                {currentStep < 3 ? (
                  <Button type="button" onClick={handleNext}>
                    Weiter
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isLoading || !canGenerate || !hasBrandId}
                    className="min-w-[180px]"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Wird erstellt...
                      </>
                    ) : (
                      <>
                        <Zap className="mr-2 h-4 w-4" />
                        Jetzt generieren
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
