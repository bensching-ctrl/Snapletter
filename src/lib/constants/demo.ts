/**
 * Demo-Brand UUID (manuell in Supabase angelegt)
 * Diese Brand muss existieren, damit Demo-Newsletter funktionieren
 */
export const DEMO_BRAND_ID = 'e447fd23-b604-47a9-aa35-9de5ed4cf0a0';

/**
 * Demo-Brand Logo (Cloudinary)
 * Logo mit transparentem Hintergrund für die Demo-Brand
 * WICHTIG: Diese URL muss auch in Supabase brands.logo_url aktualisiert werden!
 */
export const DEMO_BRAND_LOGO = 'https://res.cloudinary.com/dcx7q1eil/image/upload/e_background_removal,q_auto,f_png/v1766866506/Demo_Logo_j7wbqf.png';

/**
 * Öffentliche Demo-Bilder (Cloudinary)
 * Hochwertige, zueinander passende Editorial-Bilder für die Frühjahrskollektion
 */
export const DEMO_IMAGES = {
  hero: 'https://res.cloudinary.com/dcx7q1eil/image/upload/v1766864964/Header_Bild_b4wvpt.png',
  content: 'https://res.cloudinary.com/dcx7q1eil/image/upload/v1766865004/Inhaltsbild_i0dm4q.png',
  offer: 'https://res.cloudinary.com/dcx7q1eil/image/upload/v1766864889/Angebotsbild_E_Commerce_xwhypa.png',
} as const;


