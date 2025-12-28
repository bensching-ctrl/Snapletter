'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useBrands, useDeleteBrand } from '@/hooks/useBrands';
import { BrandCard } from '@/components/brand/BrandCard';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { countNewslettersByBrandId } from '@/lib/db/newsletters';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

/**
 * Skeleton für eine einzelne Brand-Card.
 * Fixed dimensions match actual BrandCard to prevent CLS.
 */
function BrandCardSkeleton() {
  return (
    <Card className="min-h-[180px]">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          {/* Logo placeholder */}
          <Skeleton className="w-10 h-10 rounded shrink-0" />
          {/* Title */}
          <Skeleton className="h-5 w-32" />
        </div>
      </CardHeader>
      <CardContent>
        {/* Description placeholder - 2 lines */}
        <div className="space-y-2 mb-4 min-h-[40px]">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-3/4" />
        </div>
        {/* Buttons */}
        <div className="flex gap-2">
          <Skeleton className="h-8 w-[100px]" />
          <Skeleton className="h-8 w-[88px]" />
        </div>
      </CardContent>
    </Card>
  );
}

interface DeleteDialogState {
  isOpen: boolean;
  brandId: string | null;
  brandName: string;
  newsletterCount: number;
  isLoading: boolean;
}

export function BrandsPageClient() {
  const { data: brands, isLoading, error } = useBrands();
  const deleteMutation = useDeleteBrand();
  const [deleteDialog, setDeleteDialog] = useState<DeleteDialogState>({
    isOpen: false,
    brandId: null,
    brandName: '',
    newsletterCount: 0,
    isLoading: false,
  });

  const handleDeleteClick = async (id: string) => {
    const brand = brands?.find(b => b.id === id);
    if (!brand) return;

    setDeleteDialog({
      isOpen: true,
      brandId: id,
      brandName: brand.name,
      newsletterCount: 0,
      isLoading: true,
    });

    try {
      const count = await countNewslettersByBrandId(id);
      setDeleteDialog(prev => ({
        ...prev,
        newsletterCount: count,
        isLoading: false,
      }));
    } catch {
      setDeleteDialog(prev => ({
        ...prev,
        isLoading: false,
      }));
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.brandId) return;

    try {
      await deleteMutation.mutateAsync(deleteDialog.brandId);
      toast.success('Firmenprofil gelöscht');
      setDeleteDialog(prev => ({ ...prev, isOpen: false, brandId: null }));
    } catch {
      toast.error('Fehler beim Löschen');
    }
  };

  const handleDialogClose = () => {
    setDeleteDialog(prev => ({ ...prev, isOpen: false, brandId: null }));
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div data-slot="page-header">
            <h1 className="text-3xl font-bold">Firmenprofile</h1>
            <p className="text-muted-foreground">
              Verwalten Sie Ihre Markenprofile für Newsletter
            </p>
          </div>
          <Button asChild>
            <Link href="/brands/new">Firmenprofil erstellen</Link>
          </Button>
        </div>
        {/* Skeleton Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <BrandCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-destructive">Fehler beim Laden der Firmenprofile</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div data-slot="page-header">
          <h1 className="text-3xl font-bold">Firmenprofile</h1>
          <p className="text-muted-foreground">
            Verwalten Sie Ihre Markenprofile für Newsletter
          </p>
        </div>
        <Button asChild>
          <Link href="/brands/new">Firmenprofil erstellen</Link>
        </Button>
      </div>

      {brands?.length === 0 ? (
        <div className="text-center py-16 border rounded-lg bg-muted/30 select-none">
          <p className="text-muted-foreground mb-2">
            Noch keine Firmenprofile vorhanden
          </p>
          <p className="text-sm text-muted-foreground/70 mb-6 max-w-md mx-auto">
            Firmenprofile speichern Markendaten wie Tonalität, Zielgruppe und visuelle Richtlinien. Diese Informationen fließen automatisch in jeden Newsletter ein.
          </p>
          <Button asChild>
            <Link href="/brands/new">Erstes Profil erstellen</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {brands?.map((brand) => (
            <BrandCard
              key={brand.id}
              brand={brand}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      )}

      <Dialog open={deleteDialog.isOpen} onOpenChange={(open) => !open && handleDialogClose()}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Firmenprofil löschen?</DialogTitle>
            <DialogDescription>
              {deleteDialog.isLoading ? (
                <span>Prüfe Referenzen...</span>
              ) : deleteDialog.newsletterCount > 0 ? (
                <span className="text-destructive">
                  Achtung: {deleteDialog.newsletterCount} Newsletter {deleteDialog.newsletterCount === 1 ? 'ist' : 'sind'} diesem Profil zugeordnet.
                  Nach dem Löschen haben diese Newsletter keine Firmenzuordnung mehr.
                </span>
              ) : (
                <span>
                  Möchten Sie das Firmenprofil &quot;{deleteDialog.brandName}&quot; wirklich löschen?
                  Diese Aktion kann nicht rückgängig gemacht werden.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleDialogClose}>
              Abbrechen
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={deleteDialog.isLoading || deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Wird gelöscht...' : 'Endgültig löschen'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
