import { NextRequest, NextResponse } from 'next/server';
import { saveGenerationResult, updateNewsletterStatus, getNewsletterById } from '@/lib/db/newsletters';

interface CallbackBody {
  newsletter_id: string;
  subject?: string;
  html?: string;
  text?: string;
  status?: 'done' | 'error';
}

export async function POST(request: NextRequest) {
  try {
    const body: CallbackBody = await request.json();
    const { newsletter_id, subject, html, text, status = 'done' } = body;

    // Validierung: newsletter_id ist Pflicht
    if (!newsletter_id || typeof newsletter_id !== 'string') {
      return NextResponse.json(
        { error: 'newsletter_id ist erforderlich' },
        { status: 400 }
      );
    }

    // Validierung: status muss "done" oder "error" sein
    if (status !== 'done' && status !== 'error') {
      return NextResponse.json(
        { error: 'status muss "done" oder "error" sein' },
        { status: 400 }
      );
    }

    // Prüfen ob Newsletter existiert
    const newsletter = await getNewsletterById(newsletter_id);
    if (!newsletter) {
      return NextResponse.json(
        { error: 'Newsletter nicht gefunden' },
        { status: 404 }
      );
    }

    // Bei status === "error": nur Status setzen, kein Ergebnis speichern
    if (status === 'error') {
      await updateNewsletterStatus(newsletter_id, 'error');
      return NextResponse.json(
        { success: true, message: 'Status auf error gesetzt' },
        { status: 200 }
      );
    }

    // Bei status === "done": mindestens ein Ergebnis-Feld muss vorhanden sein
    if (!subject && !html && !text) {
      return NextResponse.json(
        { error: 'Bei status "done" muss mindestens subject, html oder text vorhanden sein' },
        { status: 400 }
      );
    }

    // Ergebnisse speichern
    const updatedNewsletter = await saveGenerationResult(newsletter_id, {
      subject: subject || '',
      html: html || '',
      text: text || '',
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Generierungsergebnis gespeichert',
        newsletter_id: updatedNewsletter.id,
        status: updatedNewsletter.status,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Callback Route Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Interner Serverfehler' },
      { status: 500 }
    );
  }
}
