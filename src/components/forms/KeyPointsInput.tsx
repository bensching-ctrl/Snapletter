'use client';

import { useState, useRef, KeyboardEvent } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KeyPointsInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  emptyStateText?: string;
  maxPoints?: number;
}

export function KeyPointsInput({
  value = [],
  onChange,
  emptyStateText = 'Notiere hier die wichtigsten Gedanken oder Fragen, die im Newsletter beantwortet werden sollen. Jeder Eintrag wird einzeln von der KI berücksichtigt.',
  maxPoints = 10,
}: KeyPointsInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const trimmed = inputValue.trim();
      if (trimmed && value.length < maxPoints) {
        onChange([...value, trimmed]);
        setInputValue('');
      }
    }

    if (e.key === 'Backspace' && inputValue === '' && value.length > 0) {
      e.preventDefault();
      const newValue = [...value];
      newValue.pop();
      onChange(newValue);
    }

    if (e.key === 'Escape') {
      inputRef.current?.blur();
    }
  };

  const handleRemove = (index: number) => {
    const newValue = value.filter((_, i) => i !== index);
    onChange(newValue);
    inputRef.current?.focus();
  };

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  const isEmpty = value.length === 0;
  const showEmptyState = isEmpty && !isFocused && !inputValue;

  return (
    <div
      onClick={handleContainerClick}
      className={cn(
        'min-h-[140px] rounded-lg border border-input bg-background p-4 cursor-text',
        'focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]',
        'transition-[border-color,box-shadow]'
      )}
    >
      {/* Empty State */}
      {showEmptyState && (
        <p className="text-sm text-muted-foreground/60 leading-relaxed pr-4">
          {emptyStateText}
        </p>
      )}

      {/* Existing Items */}
      {value.length > 0 && (
        <div className="flex flex-col gap-2 mb-3">
          {value.map((point, index) => (
            <div
              key={index}
              className={cn(
                'group flex items-start gap-3 px-3 py-2.5 rounded-md',
                'bg-muted/30 text-sm leading-relaxed',
                'transition-colors hover:bg-muted/50'
              )}
            >
              <span className="flex-1 break-words text-foreground/90">{point}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(index);
                }}
                className={cn(
                  'flex-shrink-0 p-1 rounded-sm -mr-1 -mt-0.5',
                  'text-muted-foreground/30 hover:text-foreground hover:bg-muted',
                  'sm:opacity-0 sm:group-hover:opacity-100',
                  'transition-all focus:opacity-100 focus:outline-none focus:ring-1 focus:ring-ring'
                )}
                aria-label={`Eintrag entfernen`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input Field */}
      {value.length < maxPoints && (
        <div
          className={cn(
            'flex items-center gap-2',
            !isEmpty && 'mt-1'
          )}
        >
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={isEmpty ? 'Ersten Gedanken eingeben...' : 'Weiteren Gedanken hinzufügen...'}
            className={cn(
              'flex-1 bg-transparent text-sm outline-none py-1',
              'placeholder:text-muted-foreground/40',
              showEmptyState && 'absolute opacity-0 pointer-events-none'
            )}
          />
          {inputValue.trim() && (
            <kbd className="text-[10px] text-muted-foreground/50 bg-muted/40 px-1.5 py-0.5 rounded flex-shrink-0 font-sans">
              Enter
            </kbd>
          )}
        </div>
      )}

      {/* Max Reached */}
      {value.length >= maxPoints && (
        <p className="text-xs text-muted-foreground/50 mt-2">
          Maximum erreicht
        </p>
      )}
    </div>
  );
}
