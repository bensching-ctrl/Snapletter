'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-[50vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-destructive/10 flex items-center justify-center">
          <AlertTriangle className="w-7 h-7 text-destructive" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            Ein Fehler ist aufgetreten
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Die Seite konnte nicht geladen werden. Bitte versuchen Sie es erneut.
          </p>
        </div>

        {error.digest && (
          <p className="text-xs text-muted-foreground/60 font-mono">
            Fehler-ID: {error.digest}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Button onClick={reset} className="min-h-[44px]">
            <RefreshCw className="w-4 h-4 mr-2" />
            Erneut versuchen
          </Button>
          <Button
            variant="outline"
            onClick={() => window.location.href = '/'}
            className="min-h-[44px]"
          >
            Zur Startseite
          </Button>
        </div>
      </div>
    </div>
  );
}
