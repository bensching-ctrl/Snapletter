export type NewsletterIntention =
  | 'informieren'
  | 'verkaufen'
  | 'storytelling'
  | 'produktvorstellung'
  | 'event';

export type CTAType =
  | 'mehr_erfahren'
  | 'angebot_ansehen'
  | 'termin_buchen'
  | 'jetzt_kaufen'
  | 'antworten';

export type NewsletterLength = 'kurz' | 'mittel' | 'lang';

export type LayoutType =
  | 'klassisch'
  | 'moderne_sektionen'
  | 'produktfokus'
  | 'storytelling';

export type NewsletterStatus = 'idle' | 'generating' | 'done' | 'error';

// Newsletter-Interface entspricht dem Supabase-Schema
export interface Newsletter {
  id: string;
  brand_id: string | null;
  main_topic: string;
  intention: NewsletterIntention | null;
  key_messages: string | null;  // Text-Feld in DB, nicht Array
  offer: string | null;
  length: NewsletterLength | null;
  layout: LayoutType | null;
  cta: CTAType | null;
  hero_image_url: string | null;
  content_image_url: string | null;
  offer_image_url: string | null;
  planned_send_date: string | null; // ISO date format YYYY-MM-DD
  notes: string | null;
  status: NewsletterStatus | null;
  // Generierungsergebnisse (eigene Spalten, nicht in config)
  generated_subject: string | null;
  generated_html: string | null;
  generated_text: string | null;
  generated_at: string | null; // ISO timestamp
  created_at: Date;
  updated_at: Date;
  // config enthält alle Felder als jsonb in Supabase
  config?: Record<string, unknown>;
}

// NewsletterCreate: Ohne ID, Timestamps und generierte Felder (die werden vom Backend gesetzt)
export type NewsletterCreate = Omit<Newsletter, 'id' | 'created_at' | 'updated_at' | 'generated_subject' | 'generated_html' | 'generated_text' | 'generated_at'>;
export type NewsletterUpdate = Partial<NewsletterCreate>;

// Enum-Optionen für UI-Dropdowns
export const INTENTION_OPTIONS: { value: NewsletterIntention; label: string }[] = [
  { value: 'informieren', label: 'Informieren' },
  { value: 'verkaufen', label: 'Verkaufen' },
  { value: 'storytelling', label: 'Storytelling' },
  { value: 'produktvorstellung', label: 'Produktvorstellung' },
  { value: 'event', label: 'Event-Ankündigung' },
];

export const CTA_OPTIONS: { value: CTAType; label: string }[] = [
  { value: 'mehr_erfahren', label: 'Mehr erfahren' },
  { value: 'angebot_ansehen', label: 'Angebot ansehen' },
  { value: 'termin_buchen', label: 'Termin buchen' },
  { value: 'jetzt_kaufen', label: 'Jetzt kaufen' },
  { value: 'antworten', label: 'Antworten' },
];

export const LENGTH_OPTIONS: { value: NewsletterLength; label: string }[] = [
  { value: 'kurz', label: 'Kurz' },
  { value: 'mittel', label: 'Mittel' },
  { value: 'lang', label: 'Lang' },
];

export const LAYOUT_OPTIONS: { value: LayoutType; label: string }[] = [
  { value: 'klassisch', label: 'Klassisch' },
  { value: 'moderne_sektionen', label: 'Moderne Sektionen' },
  { value: 'produktfokus', label: 'Produktfokus' },
  { value: 'storytelling', label: 'Storytelling' },
];

export const STATUS_OPTIONS: { value: NewsletterStatus; label: string; color: string }[] = [
  { value: 'idle', label: 'Entwurf', color: 'secondary' },
  { value: 'generating', label: 'Generiert...', color: 'default' },
  { value: 'done', label: 'Fertig', color: 'default' },
  { value: 'error', label: 'Fehler', color: 'destructive' },
];
