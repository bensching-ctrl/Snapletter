import { supabase, isSupabaseConfigured } from './index';
import type { Brand, BrandCreate, BrandUpdate } from '@/types';

/**
 * Alle Spalten der brands Tabelle für SELECT-Queries
 */
const BRAND_COLUMNS = `
  id,
  name,
  description,
  target_audience,
  usps,
  tone_of_voice,
  brand_words,
  no_go_words,
  brand_colors,
  visual_style,
  logo_url,
  created_at,
  updated_at
`;

// In-Memory Mock Store für Entwicklung ohne Supabase
let mockBrands: Brand[] = [];

function generateId(): string {
  return crypto.randomUUID();
}

/**
 * Lädt alle Brands aus der Datenbank
 */
export async function getBrands(): Promise<Brand[]> {
  if (!isSupabaseConfigured()) {
    return mockBrands;
  }

  const { data, error } = await supabase!
    .from('brands')
    .select(BRAND_COLUMNS)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

/**
 * Lädt einen einzelnen Brand anhand der ID
 */
export async function getBrandById(id: string): Promise<Brand | null> {
  if (!isSupabaseConfigured()) {
    return mockBrands.find(b => b.id === id) || null;
  }

  const { data, error } = await supabase!
    .from('brands')
    .select(BRAND_COLUMNS)
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    throw error;
  }
  return data;
}

/**
 * Erstellt einen neuen Brand
 */
export async function createBrand(brand: BrandCreate): Promise<Brand> {
  if (!isSupabaseConfigured()) {
    const newBrand: Brand = {
      ...brand,
      id: generateId(),
      created_at: new Date(),
      updated_at: new Date(),
    };
    mockBrands.unshift(newBrand);
    return newBrand;
  }

  // Explizit nur die erlaubten Felder senden
  const insertData = {
    name: brand.name,
    description: brand.description || '',
    target_audience: brand.target_audience || '',
    usps: brand.usps || '',
    tone_of_voice: brand.tone_of_voice || '',
    brand_words: brand.brand_words || '',
    no_go_words: brand.no_go_words || '',
    brand_colors: brand.brand_colors || '',
    visual_style: brand.visual_style || '',
    logo_url: brand.logo_url || null,
  };

  const { data, error } = await supabase!
    .from('brands')
    .insert(insertData)
    .select(BRAND_COLUMNS)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Aktualisiert einen bestehenden Brand
 */
export async function updateBrand(id: string, update: BrandUpdate): Promise<Brand> {
  if (!isSupabaseConfigured()) {
    const index = mockBrands.findIndex(b => b.id === id);
    if (index === -1) throw new Error('Brand not found');
    mockBrands[index] = {
      ...mockBrands[index],
      ...update,
      updated_at: new Date(),
    };
    return mockBrands[index];
  }

  // Nur übergebene Felder updaten + updated_at
  const updateData: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  // Alle möglichen Felder prüfen und nur die übergebenen hinzufügen
  if (update.name !== undefined) updateData.name = update.name;
  if (update.description !== undefined) updateData.description = update.description;
  if (update.target_audience !== undefined) updateData.target_audience = update.target_audience;
  if (update.usps !== undefined) updateData.usps = update.usps;
  if (update.tone_of_voice !== undefined) updateData.tone_of_voice = update.tone_of_voice;
  if (update.brand_words !== undefined) updateData.brand_words = update.brand_words;
  if (update.no_go_words !== undefined) updateData.no_go_words = update.no_go_words;
  if (update.brand_colors !== undefined) updateData.brand_colors = update.brand_colors;
  if (update.visual_style !== undefined) updateData.visual_style = update.visual_style;
  if (update.logo_url !== undefined) updateData.logo_url = update.logo_url;

  const { data, error } = await supabase!
    .from('brands')
    .update(updateData)
    .eq('id', id)
    .select(BRAND_COLUMNS)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Löscht einen Brand
 */
export async function deleteBrand(id: string): Promise<void> {
  if (!isSupabaseConfigured()) {
    mockBrands = mockBrands.filter(b => b.id !== id);
    return;
  }

  const { error } = await supabase!
    .from('brands')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
