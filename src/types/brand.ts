/**
 * Brand (Firmenprofil) - Vollständiges Datenbankschema
 * Entspricht der Supabase brands Tabelle
 */
export interface Brand {
  id: string;
  name: string;
  description: string;
  target_audience: string;
  usps: string;
  tone_of_voice: string;
  brand_words: string;
  no_go_words: string;
  brand_colors: string;
  visual_style: string;
  logo_url: string | null;
  created_at: Date;
  updated_at: Date;
}

/**
 * Felder für das Erstellen eines neuen Brands
 */
export type BrandCreate = Omit<Brand, 'id' | 'created_at' | 'updated_at'>;

/**
 * Felder für das Aktualisieren eines Brands (alle optional)
 */
export type BrandUpdate = Partial<BrandCreate>;
