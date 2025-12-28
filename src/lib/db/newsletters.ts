import { supabase, isSupabaseConfigured } from './index';
import type { Newsletter, NewsletterCreate, NewsletterUpdate } from '@/types';

// In-Memory Mock Store für Entwicklung ohne Supabase
let mockNewsletters: Newsletter[] = [];

function generateId(): string {
  return crypto.randomUUID();
}

/**
 * Hilfsfunktion: Leere Strings zu null konvertieren
 */
function emptyToNull(value: string | null | undefined): string | null {
  if (value === undefined || value === null || value === '') {
    return null;
  }
  return value;
}

/**
 * Hilfsfunktion: Datum validieren und in ISO-Format konvertieren
 * Gibt null zurück bei ungültigem oder leerem Datum
 */
function toIsoDate(value: string | null | undefined): string | null {
  if (!value || value === '') {
    return null;
  }
  const date = new Date(value);
  if (isNaN(date.getTime())) {
    return null;
  }
  return date.toISOString().split('T')[0];
}

/**
 * Hilfsfunktion: key_messages String zu Array konvertieren
 */
function toKeyMessagesArray(value: string | null | undefined): string[] {
  if (!value || value.trim() === '') {
    return [];
  }
  return value.split('\n').map(line => line.trim()).filter(line => line.length > 0);
}

/**
 * Baut das config-Objekt aus den Formularwerten
 */
function buildConfig(newsletter: NewsletterCreate | NewsletterUpdate): Record<string, unknown> {
  return {
    main_topic: newsletter.main_topic?.trim() || null,
    intention: newsletter.intention || null,
    key_messages: toKeyMessagesArray(newsletter.key_messages),
    offer: emptyToNull(newsletter.offer),
    target_audience: [], // Für zukünftige Erweiterung
    length: newsletter.length || null,
    layout: newsletter.layout || null,
    cta: newsletter.cta || null,
    images: {
      hero: emptyToNull(newsletter.hero_image_url),
      content: emptyToNull(newsletter.content_image_url),
      offer: emptyToNull(newsletter.offer_image_url),
    },
    planned_send_date: toIsoDate(newsletter.planned_send_date),
    notes: emptyToNull(newsletter.notes),
  };
}

// Supabase-Spalten für Newsletter (neue Struktur mit config jsonb + Ergebnisfelder)
const NEWSLETTER_COLUMNS = [
  'id',
  'brand_id',
  'status',
  'config',
  'generated_subject',
  'generated_html',
  'generated_text',
  'generated_at',
  'created_at',
  'updated_at',
] as const;

/**
 * Mappt DB-Row auf Newsletter-Objekt:
 * config-Felder werden auf Top-Level extrahiert, damit UI-Komponenten
 * weiterhin newsletter.main_topic etc. verwenden können.
 */
function mapNewsletterFromDb(row: Record<string, unknown>): Newsletter {
  const config = (row.config as Record<string, unknown>) ?? {};
  const images = (config.images as Record<string, unknown>) ?? {};

  // key_messages: Array zu String (für Formular-Kompatibilität)
  const keyMessages = Array.isArray(config.key_messages)
    ? (config.key_messages as string[]).join('\n')
    : (config.key_messages as string) || null;

  return {
    id: row.id as string,
    brand_id: row.brand_id as string | null,
    status: (row.status as Newsletter['status']) || 'idle',
    created_at: row.created_at as Date,
    updated_at: row.updated_at as Date,
    // config-Felder auf Top-Level
    main_topic: (config.main_topic as string) || '',
    intention: (config.intention as Newsletter['intention']) || null,
    key_messages: keyMessages,
    offer: (config.offer as string) || null,
    length: (config.length as Newsletter['length']) || null,
    layout: (config.layout as Newsletter['layout']) || null,
    cta: (config.cta as Newsletter['cta']) || null,
    hero_image_url: (images.hero as string) || null,
    content_image_url: (images.content as string) || null,
    offer_image_url: (images.offer as string) || null,
    planned_send_date: (config.planned_send_date as string) || null,
    notes: (config.notes as string) || null,
    // Generierungsergebnisse (eigene Spalten)
    generated_subject: (row.generated_subject as string) || null,
    generated_html: (row.generated_html as string) || null,
    generated_text: (row.generated_text as string) || null,
    generated_at: (row.generated_at as string) || null,
    // config bleibt erhalten
    config: config,
  };
}

export async function getNewsletters(): Promise<Newsletter[]> {
  if (!isSupabaseConfigured()) {
    return mockNewsletters;
  }

  const { data, error } = await supabase!
    .from('newsletters')
    .select(NEWSLETTER_COLUMNS.join(','))
    .order('created_at', { ascending: false });

  if (error) throw error;
  return ((data || []) as unknown as Record<string, unknown>[]).map(mapNewsletterFromDb);
}

export async function getNewsletterById(id: string): Promise<Newsletter | null> {
  if (!isSupabaseConfigured()) {
    return mockNewsletters.find(n => n.id === id) || null;
  }

  const { data, error } = await supabase!
    .from('newsletters')
    .select(NEWSLETTER_COLUMNS.join(','))
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return mapNewsletterFromDb(data as unknown as Record<string, unknown>);
}

export async function createNewsletter(newsletter: NewsletterCreate): Promise<Newsletter> {
  if (!isSupabaseConfigured()) {
    const newNewsletter: Newsletter = {
      ...newsletter,
      id: generateId(),
      status: newsletter.status || 'idle',
      // Ergebnisfelder initial null
      generated_subject: null,
      generated_html: null,
      generated_text: null,
      generated_at: null,
      created_at: new Date(),
      updated_at: new Date(),
    };
    mockNewsletters.unshift(newNewsletter);
    return newNewsletter;
  }

  // main_topic ist Pflichtfeld
  if (!newsletter.main_topic || newsletter.main_topic.trim() === '') {
    throw new Error('main_topic ist ein Pflichtfeld');
  }

  // Neues Insert-Format: nur brand_id, status und config
  const insertData = {
    brand_id: emptyToNull(newsletter.brand_id),
    status: 'idle',
    config: buildConfig(newsletter),
  };

  const { data, error } = await supabase!
    .from('newsletters')
    .insert(insertData)
    .select(NEWSLETTER_COLUMNS.join(','))
    .single();

  if (error) throw error;
  return mapNewsletterFromDb(data as unknown as Record<string, unknown>);
}

export async function updateNewsletter(id: string, update: NewsletterUpdate): Promise<Newsletter> {
  if (!isSupabaseConfigured()) {
    const index = mockNewsletters.findIndex(n => n.id === id);
    if (index === -1) throw new Error('Newsletter not found');
    mockNewsletters[index] = {
      ...mockNewsletters[index],
      ...update,
      updated_at: new Date(),
    };
    return mockNewsletters[index];
  }

  // Update-Daten aufbauen
  const updateData: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  // brand_id separat behandeln
  if (update.brand_id !== undefined) {
    updateData.brand_id = emptyToNull(update.brand_id);
  }

  // status separat behandeln
  if (update.status !== undefined) {
    updateData.status = update.status;
  }

  // Wenn Formularfelder aktualisiert werden, config neu aufbauen
  const hasConfigFields = update.main_topic !== undefined ||
    update.intention !== undefined ||
    update.key_messages !== undefined ||
    update.offer !== undefined ||
    update.length !== undefined ||
    update.layout !== undefined ||
    update.cta !== undefined ||
    update.hero_image_url !== undefined ||
    update.content_image_url !== undefined ||
    update.offer_image_url !== undefined ||
    update.planned_send_date !== undefined ||
    update.notes !== undefined;

  if (hasConfigFields) {
    updateData.config = buildConfig(update);
  }

  const { data, error } = await supabase!
    .from('newsletters')
    .update(updateData)
    .eq('id', id)
    .select(NEWSLETTER_COLUMNS.join(','))
    .single();

  if (error) throw error;
  return mapNewsletterFromDb(data as unknown as Record<string, unknown>);
}

export async function deleteNewsletter(id: string): Promise<void> {
  if (!isSupabaseConfigured()) {
    mockNewsletters = mockNewsletters.filter(n => n.id !== id);
    return;
  }

  const { error } = await supabase!
    .from('newsletters')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function updateNewsletterStatus(
  id: string,
  status: Newsletter['status']
): Promise<Newsletter> {
  return updateNewsletter(id, { status });
}

/**
 * Zählt Newsletter, die einer Brand zugeordnet sind
 */
export async function countNewslettersByBrandId(brandId: string): Promise<number> {
  if (!isSupabaseConfigured()) {
    return mockNewsletters.filter(n => n.brand_id === brandId).length;
  }

  const { count, error } = await supabase!
    .from('newsletters')
    .select('*', { count: 'exact', head: true })
    .eq('brand_id', brandId);

  if (error) throw error;
  return count || 0;
}

/**
 * Speichert Generierungsergebnisse und setzt Status auf 'done'
 */
export interface GenerationResult {
  subject: string;
  html: string;
  text: string;
}

export async function saveGenerationResult(
  id: string,
  result: GenerationResult
): Promise<Newsletter> {
  const now = new Date().toISOString();

  if (!isSupabaseConfigured()) {
    const index = mockNewsletters.findIndex(n => n.id === id);
    if (index === -1) throw new Error('Newsletter not found');
    mockNewsletters[index] = {
      ...mockNewsletters[index],
      status: 'done',
      generated_subject: result.subject,
      generated_html: result.html,
      generated_text: result.text,
      generated_at: now,
      updated_at: new Date(),
    };
    return mockNewsletters[index];
  }

  const { data, error } = await supabase!
    .from('newsletters')
    .update({
      status: 'done',
      generated_subject: result.subject,
      generated_html: result.html,
      generated_text: result.text,
      generated_at: now,
      updated_at: now,
    })
    .eq('id', id)
    .select(NEWSLETTER_COLUMNS.join(','))
    .single();

  if (error) throw error;
  return mapNewsletterFromDb(data as unknown as Record<string, unknown>);
}
