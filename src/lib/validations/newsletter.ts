import { z } from 'zod';

// Schema entspricht dem Supabase-Newsletter-Table
// Menschenlesbare Fehlermeldungen für bessere UX
export const newsletterSchema = z.object({
  brand_id: z.string().nullable(),
  main_topic: z.string().min(1, 'Bitte geben Sie ein Hauptthema an – es bildet den Kern des Newsletters.'),
  intention: z.enum(['informieren', 'verkaufen', 'storytelling', 'produktvorstellung', 'event']).nullable(),
  key_messages: z.string().nullable(),  // Text-Feld, nicht Array
  offer: z.string().nullable(),
  cta: z.enum(['mehr_erfahren', 'angebot_ansehen', 'termin_buchen', 'jetzt_kaufen', 'antworten']).nullable(),
  length: z.enum(['kurz', 'mittel', 'lang']).nullable(),
  layout: z.enum(['klassisch', 'moderne_sektionen', 'produktfokus', 'storytelling']).nullable(),
  hero_image_url: z.string().url('Bitte geben Sie eine gültige URL ein.').nullable().or(z.literal('')),
  content_image_url: z.string().url('Bitte geben Sie eine gültige URL ein.').nullable().or(z.literal('')),
  offer_image_url: z.string().url('Bitte geben Sie eine gültige URL ein.').nullable().or(z.literal('')),
  planned_send_date: z.string().nullable(), // ISO date format YYYY-MM-DD
  notes: z.string().nullable(),
  status: z.enum(['idle', 'generating', 'done', 'error']).nullable(),
});

export type NewsletterFormData = z.infer<typeof newsletterSchema>;
