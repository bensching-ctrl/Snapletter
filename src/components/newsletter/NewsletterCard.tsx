'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { X, Building2, Target, Calendar, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Newsletter } from '@/types';

interface NewsletterCardProps {
  newsletter: Newsletter;
  brandName?: string;
  onDelete?: (id: string) => void;
}

export function NewsletterCard({ newsletter, brandName, onDelete }: NewsletterCardProps) {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleCardClick = () => {
    router.push(`/newsletters/${newsletter.id}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      router.push(`/newsletters/${newsletter.id}`);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    onDelete?.(newsletter.id);
    setShowDeleteDialog(false);
  };

  return (
    <>
      <Card
        interactive
        onClick={handleCardClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="link"
        aria-label={`Newsletter "${newsletter.main_topic}" anzeigen`}
        className="relative group min-h-[156px]"
      >
        <CardHeader className="pb-3">
          {/* Header Row: Titel + Delete */}
          <div className="flex items-start gap-3">
            {/* Titel-Bereich - nimmt verfügbaren Platz */}
            <div className="flex-1 min-w-0 space-y-1">
        <h3 className="font-semibold text-lg leading-tight truncate select-none">
          {newsletter.main_topic}
        </h3>
              {/* Fixed height for brand row to prevent CLS */}
              <div className="min-h-[20px]">
          {brandName && (
            <p className="text-sm text-muted-foreground flex items-center gap-1.5 select-none">
              <Building2 className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{brandName}</span>
            </p>
          )}
              </div>
            </div>

            {/* Delete Button - ganz rechts, nur bei hover */}
            {onDelete && (
              <button
                onClick={handleDeleteClick}
                className="shrink-0 p-1.5 -mr-1 rounded-full opacity-0 group-hover:opacity-100 hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all"
                aria-label="Newsletter löschen"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </CardHeader>

      <CardContent className="pt-0">
        {/* Meta-Infos - fixed minimum height to prevent CLS */}
        <div className="space-y-1.5 text-sm text-muted-foreground min-h-[44px] select-none">
            {newsletter.intention && (
              <p className="flex items-center gap-1.5">
                <Target className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{newsletter.intention}</span>
              </p>
            )}
            {newsletter.planned_send_date && (
              <p className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 shrink-0" />
                <span>
                  {format(new Date(newsletter.planned_send_date), 'dd.MM.yyyy', { locale: de })}
                </span>
              </p>
            )}
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground/70">
              <Clock className="h-3 w-3 shrink-0" />
              <span>
                {format(new Date(newsletter.updated_at), 'dd.MM.yyyy, HH:mm', { locale: de })}
              </span>
            </p>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Newsletter löschen?</DialogTitle>
            <DialogDescription>
              Möchten Sie den Newsletter &quot;{newsletter.main_topic}&quot; wirklich löschen?
              Diese Aktion kann nicht rückgängig gemacht werden.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Abbrechen
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Endgültig löschen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
