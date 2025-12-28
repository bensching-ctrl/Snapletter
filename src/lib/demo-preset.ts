import type { NewsletterFormData } from '@/lib/validations/newsletter';
import { DEMO_BRAND_ID, DEMO_IMAGES } from '@/lib/constants/demo';

/**
 * Demo-Preset für schnellen Einstieg
 * Vollständig vorausgefüllter, hochwertiger Demo-Newsletter mit Brand + Bildern
 */
export const demoPreset: NewsletterFormData = {
  brand_id: DEMO_BRAND_ID,
  main_topic: 'Frühjahrskollektion 2025 – neue Styles & nachhaltige Materialien',
  intention: 'produktvorstellung',
  key_messages: `Exklusive Frühjahrskollektion jetzt verfügbar
Nachhaltige Materialien aus Bio-Baumwolle
20 % Rabatt für Newsletter-Abonnenten (Code SPRING25)
Kostenloser Versand ab 50 €`,
  offer: '20 % Rabatt für Newsletter-Abonnenten mit Code SPRING25',
  cta: 'angebot_ansehen',
  length: 'mittel',
  layout: 'moderne_sektionen',
  hero_image_url: DEMO_IMAGES.hero,
  content_image_url: DEMO_IMAGES.content,
  offer_image_url: DEMO_IMAGES.offer,
  planned_send_date: null,
  notes: 'Generiert mit Demo-Daten',
  status: 'idle',
};

/**
 * Weitere Presets für verschiedene Anwendungsfälle
 */
export const presets = {
  sales: demoPreset,

  event: {
    brand_id: DEMO_BRAND_ID,
    main_topic: 'Webinar: Die Zukunft des E-Commerce',
    intention: 'event',
    key_messages: `Live-Webinar am 15. März um 18:00 Uhr
Experten-Insights zu aktuellen Trends
Interaktive Q&A-Session
Kostenlose Teilnahme`,
    offer: 'Jetzt kostenlos anmelden',
    cta: 'termin_buchen',
    length: 'kurz',
    layout: 'klassisch',
    hero_image_url: '',
    content_image_url: '',
    offer_image_url: '',
    planned_send_date: null,
    notes: '',
    status: 'idle',
  } satisfies NewsletterFormData,

  storytelling: {
    brand_id: DEMO_BRAND_ID,
    main_topic: 'Hinter den Kulissen: So entsteht unser Produkt',
    intention: 'storytelling',
    key_messages: `Von der Idee zum fertigen Produkt
Unser Team stellt sich vor
Qualität die man spürt
Transparenz und Nachhaltigkeit`,
    offer: '',
    cta: 'mehr_erfahren',
    length: 'lang',
    layout: 'storytelling',
    hero_image_url: '',
    content_image_url: '',
    offer_image_url: '',
    planned_send_date: null,
    notes: '',
    status: 'idle',
  } satisfies NewsletterFormData,

  info: {
    brand_id: DEMO_BRAND_ID,
    main_topic: 'Monatlicher Update: Was gibt es Neues?',
    intention: 'informieren',
    key_messages: `Neue Features im März
Verbesserte Benutzeroberfläche
Schnellere Ladezeiten
Neue Integrationen verfügbar`,
    offer: '',
    cta: 'mehr_erfahren',
    length: 'mittel',
    layout: 'klassisch',
    hero_image_url: '',
    content_image_url: '',
    offer_image_url: '',
    planned_send_date: null,
    notes: '',
    status: 'idle',
  } satisfies NewsletterFormData,
};
