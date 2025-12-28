'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useBrands } from '@/hooks/useBrands';

interface BrandSelectorProps {
  value: string | null;
  onChange: (value: string | null) => void;
  placeholder?: string;
}

export function BrandSelector({ value, onChange, placeholder = 'Firmenprofil auswählen' }: BrandSelectorProps) {
  const { data: brands, isLoading } = useBrands();

  if (isLoading) {
    return (
      <Select disabled>
        <SelectTrigger>
          <SelectValue placeholder="Laden..." />
        </SelectTrigger>
      </Select>
    );
  }

  return (
    <Select
      value={value || undefined}
      onValueChange={(v) => onChange(v === '__none__' ? null : v)}
    >
      <SelectTrigger className="touch-manipulation">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent
        position="popper"
        sideOffset={4}
        className="z-[100]"
      >
        {brands?.length === 0 ? (
          <SelectItem value="__empty__" disabled>
            Noch keine Firmenprofile angelegt
          </SelectItem>
        ) : (
          <>
            <SelectItem value="__none__">Keine Auswahl</SelectItem>
            {brands?.map((brand) => (
              <SelectItem key={brand.id} value={brand.id}>
                {brand.name}
              </SelectItem>
            ))}
          </>
        )}
      </SelectContent>
    </Select>
  );
}
