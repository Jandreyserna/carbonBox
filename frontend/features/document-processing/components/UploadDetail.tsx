'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useUpload } from '@/features/document-processing/api/hooks';
import { getErrorMessage } from '@/shared/lib/api-client';
import { formatDateTime } from '@/shared/lib/format-date';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { StatusBadge } from '@/shared/components/StatusBadge';
import { ProcessingStatus } from './ProcessingStatus';
import { ResultsTable } from './ResultsTable';

export function UploadDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: upload, isPending, isError, error } = useUpload(id);

  if (isPending) return <LoadingSpinner />;

  if (isError) {
    return (
      <div className="space-y-4">
        <p className="text-red-600">{getErrorMessage(error)}</p>
        <Link href="/uploads" className="text-blue-600 underline">Volver a la lista</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold">{upload.fileName}</h1>
        <p className="text-sm">Subido el {formatDateTime(upload.createdAt)}</p>
        <StatusBadge status={upload.status} />
      </div>

      {(upload.status === 'PENDING' || upload.status === 'PROCESSING') && (
        <ProcessingStatus status={upload.status} />
      )}

      {upload.status === 'FAILED' && (
        <p role="alert" className="rounded bg-red-50 p-3 text-red-700">
          El procesamiento falló: {upload.errorMessage ?? 'error desconocido'}
        </p>
      )}

      {upload.status === 'COMPLETED' && (
        <>
          <p className="text-sm">
            Filas totales: {upload.totalRows ?? 0} · Procesadas: {upload.processedRows ?? 0} · Fallidas: {upload.failedRows ?? 0}
          </p>
          <ResultsTable uploadId={upload.id} />
        </>
      )}

      <Link href="/uploads" className="inline-block text-blue-600 underline">
        Volver a la lista
      </Link>
    </div>
  );
}
