'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileWarning, Monitor, Smartphone } from 'lucide-react';

interface ResultPreviewProps {
  subject: string | null;
  text: string | null;
  html: string | null;
}

/** Strukturierte Text-Felder in gewünschter Reihenfolge */
interface StructuredText {
  headline?: string;
  intro?: string;
  teaser?: string;
  body?: string;
  bullets?: string[] | string;
  offer?: string;
  cta?: string;
  footer?: string;
  [key: string]: unknown; // Für zusätzliche Felder
}

/** Label-Mapping für die Felder */
const FIELD_LABELS: Record<string, string> = {
  headline: 'Headline',
  intro: 'Einleitung',
  teaser: 'Teaser',
  body: 'Haupttext',
  bullets: 'Aufzählung',
  offer: 'Angebot',
  cta: 'Call-to-Action',
  footer: 'Footer',
};

/** Reihenfolge der Felder */
const FIELD_ORDER = ['headline', 'intro', 'teaser', 'body', 'bullets', 'offer', 'cta', 'footer'];

/** Device-Presets für Preview */
type DeviceType = 'desktop' | 'mobile';
const DEVICE_WIDTHS: Record<DeviceType, number> = {
  desktop: 600,
  mobile: 375,
};

/**
 * Parst den Text-String robust als JSON oder gibt null zurück
 */
function parseStructuredText(text: string | null): StructuredText | null {
  if (!text) return null;

  try {
    const parsed = JSON.parse(text);
    if (typeof parsed === 'object' && parsed !== null) {
      return parsed as StructuredText;
    }
    return null;
  } catch {
    // Kein gültiges JSON - als Plain-Text behandeln
    return null;
  }
}

/**
 * Newsletter Preview Komponente
 *
 * Sicherheit:
 * - Verwendet iframe mit srcDoc statt dangerouslySetInnerHTML
 * - Sandbox="" (leer) = maximale Restriktion
 */
export function ResultPreview({ subject, text, html }: ResultPreviewProps) {
  const [activeView, setActiveView] = useState<'html' | 'text'>('html');
  const [device, setDevice] = useState<DeviceType>('desktop');
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeHeight, setIframeHeight] = useState(600);

  // Strukturierten Text parsen
  const structuredText = useMemo(() => parseStructuredText(text), [text]);

  // Auto-resize iframe basierend auf Inhalt
  useEffect(() => {
    if (!html || !iframeRef.current) return;

    const handleLoad = () => {
      try {
        const iframe = iframeRef.current;
        if (iframe?.contentDocument?.body) {
          const contentHeight = iframe.contentDocument.body.scrollHeight;
          // Keine Max-Height mehr - iframe wächst mit Content
          setIframeHeight(Math.max(contentHeight + 40, 400));
        }
      } catch {
        setIframeHeight(600);
      }
    };

    const iframe = iframeRef.current;
    iframe.addEventListener('load', handleLoad);
    return () => iframe.removeEventListener('load', handleLoad);
  }, [html]);

  // Keine Daten vorhanden
  if (!subject && !text && !html) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <FileWarning className="h-10 w-10" />
            <p>Keine Vorschau verfügbar</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <CardTitle>Generiertes Ergebnis</CardTitle>
          <div className="flex items-center gap-3">
            {/* Device Toggle - nur bei HTML sichtbar */}
            {activeView === 'html' && html && (
              <div className="flex rounded-lg border bg-muted p-1">
                <button
                  onClick={() => setDevice('desktop')}
                  className={`p-1.5 rounded-md transition-colors ${
                    device === 'desktop'
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  title="Desktop (600px)"
                >
                  <Monitor className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setDevice('mobile')}
                  className={`p-1.5 rounded-md transition-colors ${
                    device === 'mobile'
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  title="Mobile (375px)"
                >
                  <Smartphone className="h-4 w-4" />
                </button>
              </div>
            )}
            {/* Segmented Control für HTML/Text */}
            <div className="flex rounded-lg border bg-muted p-1">
              <button
                onClick={() => setActiveView('html')}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  activeView === 'html'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                HTML
              </button>
              <button
                onClick={() => setActiveView('text')}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  activeView === 'text'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Text
              </button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Betreff */}
        {subject && (
          <div className="p-4 bg-muted/50 rounded-lg">
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Betreff</h4>
            <p className="text-lg font-medium">{subject}</p>
          </div>
        )}

        {/* HTML View */}
        {activeView === 'html' && (
          <>
            {html ? (
              /* Neutral background wrapper for preview area */
              <div className="bg-[#f3f4f6] dark:bg-neutral-800/50 rounded-xl p-6 sm:p-8">
                <div className="flex justify-center">
                  {/* Device-specific container with smooth transition */}
                  <div
                    className={`
                      transition-all duration-300 ease-out
                      ${device === 'mobile'
                        ? 'rounded-[28px] shadow-[0_8px_30px_rgba(0,0,0,0.12)] ring-1 ring-black/5'
                        : 'rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.08)] ring-1 ring-black/5'
                      }
                      bg-white overflow-hidden
                    `}
                    style={{
                      width: `${DEVICE_WIDTHS[device]}px`,
                      maxWidth: '100%',
                    }}
                  >
                    {/* Mobile: Smartphone-like notch indicator */}
                    {device === 'mobile' && (
                      <div className="bg-white pt-3 pb-2 flex justify-center">
                        <div className="w-20 h-1 bg-neutral-200 rounded-full" />
                      </div>
                    )}
                    {/* Scrollable content area */}
                    <div
                      className="overflow-y-auto overflow-x-hidden"
                      style={{
                        maxHeight: device === 'mobile' ? '600px' : '800px',
                      }}
                    >
                      <iframe
                        ref={iframeRef}
                        srcDoc={html}
                        title="Newsletter Preview"
                        className="w-full border-0"
                        style={{ height: `${iframeHeight}px` }}
                        sandbox=""
                      />
                    </div>
                    {/* Mobile: Bottom home indicator */}
                    {device === 'mobile' && (
                      <div className="bg-white pt-2 pb-3 flex justify-center">
                        <div className="w-28 h-1 bg-neutral-300 rounded-full" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <FileWarning className="h-8 w-8 mb-2" />
                <p>Keine HTML-Preview verfügbar</p>
              </div>
            )}
          </>
        )}

        {/* Text View */}
        {activeView === 'text' && (
          <>
            {structuredText ? (
              // Strukturierte Ansicht
              <div className="space-y-4">
                {FIELD_ORDER.map((fieldKey) => {
                  const value = structuredText[fieldKey];
                  if (!value) return null;

                  const label = FIELD_LABELS[fieldKey] || fieldKey;

                  // Bullets als Liste rendern
                  if (fieldKey === 'bullets') {
                    const items = Array.isArray(value)
                      ? value
                      : typeof value === 'string'
                      ? value.split('\n').filter(Boolean)
                      : [];

                    if (items.length === 0) return null;

                    return (
                      <div key={fieldKey} className="p-4 bg-muted/30 rounded-lg">
                        <h4 className="text-sm font-medium text-muted-foreground mb-2">{label}</h4>
                        <ul className="list-disc list-inside space-y-1">
                          {items.map((item, i) => (
                            <li key={i} className="text-sm">{String(item)}</li>
                          ))}
                        </ul>
                      </div>
                    );
                  }

                  // Normales Feld
                  return (
                    <div key={fieldKey} className="p-4 bg-muted/30 rounded-lg">
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">{label}</h4>
                      <p className="text-sm whitespace-pre-wrap">{String(value)}</p>
                    </div>
                  );
                })}

                {/* Zusätzliche Felder die nicht in FIELD_ORDER sind */}
                {Object.entries(structuredText)
                  .filter(([key, value]) => !FIELD_ORDER.includes(key) && value)
                  .map(([key, value]) => (
                    <div key={key} className="p-4 bg-muted/30 rounded-lg">
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </h4>
                      <p className="text-sm whitespace-pre-wrap">
                        {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                      </p>
                    </div>
                  ))}
              </div>
            ) : text ? (
              // Plain-Text Fallback
              <div className="p-4 bg-muted/30 rounded-lg max-h-[600px] overflow-auto">
                <pre className="whitespace-pre-wrap font-mono text-sm">{text}</pre>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <FileWarning className="h-8 w-8 mb-2" />
                <p>Keine Text-Version verfügbar</p>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
