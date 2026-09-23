'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateUpload } from '@/features/document-processing/api/hooks';
import { getErrorMessage } from '@/shared/lib/api-client';

const MAX_SIZE_MB = 20;

export function UploadForm() {
  const router = useRouter();
  const createUpload = useCreateUpload();

  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [validationError, setValidationError] = useState<string | null>(null);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0] ?? null;
    setProgress(0);

    if (!selected) {
      setFile(null);
      setValidationError(null);
      return;
    }

    if (!selected.name.toLowerCase().endsWith('.csv')) {
      setFile(null);
      setValidationError('Solo se permiten archivos .csv');
      event.target.value = '';
      return;
    }

    if (selected.size > MAX_SIZE_MB * 1024 * 1024) {
      setFile(null);
      setValidationError(`El archivo no puede superar ${MAX_SIZE_MB} MB`);
      event.target.value = '';
      return;
    }

    setValidationError(null);
    setFile(selected);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!file) return;

    setProgress(0);
    createUpload.mutate(
      { file, onProgress: setProgress },
      { onSuccess: (data) => router.push(`/uploads/${data.id}`) },
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-4">
      <h1 className="text-xl font-semibold">Subir archivo CSV</h1>

      <div>
        <label htmlFor="file" className="mb-1 block text-sm font-medium">
          Archivo
        </label>
        <input
          id="file"
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          disabled={createUpload.isPending}
        />
      </div>

      {validationError && <p className="text-sm text-red-600">{validationError}</p>}

      {createUpload.isPending && (
        <div className="space-y-1">
          <div className="h-2 w-full rounded bg-gray-200">
            <div
              className="h-2 rounded bg-blue-600 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm">Subiendo… {progress}%</p>
        </div>
      )}

      {createUpload.isError && (
        <p className="text-sm text-red-600">{getErrorMessage(createUpload.error)}</p>
      )}

      <button
        type="submit"
        disabled={!file || createUpload.isPending}
        className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
      >
        {createUpload.isPending ? 'Subiendo…' : 'Subir'}
      </button>
    </form>
  );
}