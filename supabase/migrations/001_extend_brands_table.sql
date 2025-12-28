-- Migration: Erweitere brands Tabelle um alle benötigten Felder
-- Führe dieses Script in der Supabase SQL-Konsole aus

-- Neue Spalten hinzufügen (falls nicht vorhanden)
ALTER TABLE brands ADD COLUMN IF NOT EXISTS usps TEXT DEFAULT '';
ALTER TABLE brands ADD COLUMN IF NOT EXISTS brand_words TEXT DEFAULT '';
ALTER TABLE brands ADD COLUMN IF NOT EXISTS no_go_words TEXT DEFAULT '';
ALTER TABLE brands ADD COLUMN IF NOT EXISTS brand_colors TEXT DEFAULT '';
ALTER TABLE brands ADD COLUMN IF NOT EXISTS visual_style TEXT DEFAULT '';
ALTER TABLE brands ADD COLUMN IF NOT EXISTS logo_url TEXT DEFAULT NULL;

-- Sicherstellen, dass description existiert
ALTER TABLE brands ADD COLUMN IF NOT EXISTS description TEXT DEFAULT '';

-- Sicherstellen, dass target_audience existiert
ALTER TABLE brands ADD COLUMN IF NOT EXISTS target_audience TEXT DEFAULT '';

-- Sicherstellen, dass tone_of_voice existiert
ALTER TABLE brands ADD COLUMN IF NOT EXISTS tone_of_voice TEXT DEFAULT '';
