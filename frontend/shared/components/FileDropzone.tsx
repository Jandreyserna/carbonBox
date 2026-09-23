'use client';

import { useId, useState } from 'react';
import { CloudUpload } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface FileDropzoneProps {
  accept: string;
  hint?: string;
  disabled?: boolean;
  onFileSelect: (file: File | null) => void;
}

export function FileDropzone({ accept, hint, disabled = false, onFileSelect }: FileDropzoneProps) {
  const inputId = useId();
  const [isDragging, setIsDragging] = useState(false);

  function handleDragOver(event: React.DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    if (!disabled) setIsDragging(true);
  }

  function handleDragLeave(event: React.DragEvent<HTMLLabelElement>) {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setIsDragging(false);
  }

  function handleDrop(event: React.DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setIsDragging(false);
    if (!disabled) onFileSelect(event.dataTransfer.files[0] ?? null);
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    onFileSelect(event.target.files?.[0] ?? null);
    event.target.value = '';
  }

  return (
    <label
      htmlFor={inputId}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      aria-disabled={disabled}
      className={cn(
        'flex cursor-pointer flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed px-6 py-12 text-center transition-colors',
        'hover:border-brand/50 hover:bg-muted/50 has-focus-visible:ring-3 has-focus-visible:ring-ring/50',
        isDragging && 'border-brand bg-brand/5',
        disabled && 'pointer-events-none opacity-50',
      )}
    >
      <div className="flex size-12 items-center justify-center rounded-full bg-brand/10 text-brand">
        <CloudUpload className="size-6" />
      </div>
      <div className="space-y-1">
        <p className="font-medium">
          Arrastra tu archivo aquí o <span className="text-brand underline-offset-4 hover:underline">explora</span>
        </p>
        {hint && <p className="text-sm text-muted-foreground">{hint}</p>}
      </div>
      <input
        id={inputId}
        type="file"
        accept={accept}
        disabled={disabled}
        onChange={handleChange}
        className="sr-only"
      />
    </label>
  );
}
