'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FileSpreadsheet, X } from 'lucide-react';
import { toast } from 'sonner';
import { useCreateUpload } from '@/features/document-processing/api/hooks';
import {
  getCsvValidationError,
  MAX_FILE_SIZE_MB,
} from '@/features/document-processing/lib/csv-file-validation';
import { getErrorMessage } from '@/shared/lib/api-client';
import { formatFileSize } from '@/shared/lib/format-number';
import { FileDropzone } from '@/shared/components/FileDropzone';
import { PageHeader } from '@/shared/components/PageHeader';
import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { Progress } from '@/shared/components/ui/progress';

interface SelectedFileProps {
  file: File;
  disabled: boolean;
  onRemove: () => void;
}

function SelectedFile({ file, disabled, onRemove }: SelectedFileProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl border bg-muted/30 p-3">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
        <FileSpreadsheet className="size-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{file.name}</p>
        <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={onRemove}
        disabled={disabled}
        aria-label="Quitar archivo"
      >
        <X />
      </Button>
    </div>
  );
}

function UploadProgress({ progress }: { progress: number }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Subiendo…</span>
        <span className="font-medium tabular-nums">{progress}%</span>
      </div>
      <Progress value={progress} aria-label="Progreso de subida" />
    </div>
  );
}

export function UploadForm() {
  const router = useRouter();
  const createUpload = useCreateUpload();

  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [validationError, setValidationError] = useState<string | null>(null);

  const isUploading = createUpload.isPending;

  function handleFileSelect(selected: File | null) {
    const error = selected ? getCsvValidationError(selected) : null;
    setValidationError(error);
    setFile(error ? null : selected);
    setProgress(0);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!file) return;

    setProgress(0);
    createUpload.mutate(
      { file, onProgress: setProgress },
      {
        onSuccess: ({ id }) => {
          toast.success('Archivo subido', { description: 'Estamos procesando tus datos.' });
          router.push(`/uploads/${id}`);
        },
        onError: (error) => {
          toast.error('No se pudo subir el archivo', { description: getErrorMessage(error) });
        },
      },
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Subir archivo"
        description="Carga un CSV con tus datos de actividad para procesarlo."
      />

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Archivo CSV</CardTitle>
            <CardDescription>
              Columnas esperadas: <code className="font-mono text-xs">category, amount, unit, date</code>
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {file ? (
              <SelectedFile file={file} disabled={isUploading} onRemove={() => handleFileSelect(null)} />
            ) : (
              <FileDropzone
                accept=".csv"
                hint={`Solo archivos .csv de hasta ${MAX_FILE_SIZE_MB} MB`}
                disabled={isUploading}
                onFileSelect={handleFileSelect}
              />
            )}

            {validationError && (
              <p role="alert" className="text-sm text-destructive">
                {validationError}
              </p>
            )}

            {isUploading && <UploadProgress progress={progress} />}
          </CardContent>

          <CardFooter className="justify-end gap-2">
            <Button variant="outline" asChild>
              <Link href="/uploads">Cancelar</Link>
            </Button>
            <Button type="submit" disabled={!file || isUploading}>
              {isUploading ? 'Subiendo…' : 'Subir archivo'}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
