'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Brand } from '@/types';

interface BrandCardProps {
  brand: Brand;
  onDelete?: (id: string) => void;
}

export function BrandCard({ brand, onDelete }: BrandCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow min-h-[180px]">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex items-center gap-3">
          {/* Logo placeholder ensures consistent layout even without logo */}
          <div className="w-10 h-10 shrink-0">
            {brand.logo_url && (
              <img
                src={brand.logo_url}
                alt={`${brand.name} Logo`}
                width={40}
                height={40}
                className="w-10 h-10 object-contain rounded select-none"
              />
            )}
          </div>
          <CardTitle className="text-lg">{brand.name}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {/* Fixed height description area to prevent CLS */}
        <div className="min-h-[40px] mb-4">
          {brand.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 select-none">
              {brand.description}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href={`/brands/${brand.id}`}>Details öffnen</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href={`/brands/${brand.id}/edit`}>Bearbeiten</Link>
          </Button>
          {onDelete && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(brand.id)}
            >
              Endgültig löschen
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
