import { z } from 'zod';

/**
 * Zod-Schema für das BrandForm
 * Alle Felder außer name sind optional
 * Menschenlesbare Fehlermeldungen für bessere UX
 */
export const brandSchema = z.object({
  name: z.string().min(1, 'Bitte geben Sie einen Namen für das Firmenprofil an.'),
  description: z.string(),
  target_audience: z.string(),
  usps: z.string(),
  tone_of_voice: z.string(),
  brand_words: z.string(),
  no_go_words: z.string(),
  brand_colors: z.string(),
  visual_style: z.string(),
  logo_url: z.string().url('Bitte geben Sie eine gültige URL ein.').nullable().or(z.literal('')),
});

export type BrandFormData = z.infer<typeof brandSchema>;
