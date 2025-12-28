import { NextRequest, NextResponse } from 'next/server';

const isProduction = process.env.NODE_ENV === 'production';

// Development: Fallback auf Test-Webhook erlaubt
// Production: ENV-Variable ist Pflicht
const DEV_FALLBACK_URL = 'https://bensching.app.n8n.cloud/webhook-test/e92e8dfe-c19b-4848-860e-dddcc1d4410e';
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || (isProduction ? null : DEV_FALLBACK_URL);

export async function POST(request: NextRequest) {
  try {
    // Production ohne konfigurierte Webhook-URL blockieren
    if (!N8N_WEBHOOK_URL) {
      console.error('N8N_WEBHOOK_URL is not configured in production');
      return NextResponse.json(
        { error: 'Newsletter-Generierung ist nicht konfiguriert. Bitte N8N_WEBHOOK_URL setzen.' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { newsletter_id, brand_id } = body;

    if (!newsletter_id) {
      return NextResponse.json(
        { error: 'newsletter_id ist erforderlich' },
        { status: 400 }
      );
    }

    // Proxy request to n8n webhook
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        newsletter_id,
        ...(brand_id && { brand_id }),
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('N8N Webhook Error:', response.status, errorText);
      return NextResponse.json(
        { error: `Webhook-Fehler: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json().catch(() => ({}));
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unbekannter Fehler' },
      { status: 500 }
    );
  }
}








