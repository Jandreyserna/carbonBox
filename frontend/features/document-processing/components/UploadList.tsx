'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useUploads } from '@/features/document-processing/api/hooks';
import { getErrorMessage } from '@/shared/lib/api-client';
import { formatDateTime } from '@/shared/lib/format-date';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { StatusBadge } from '@/shared/components/StatusBadge';

export function UploadList() {
  const [page, setPage] = useState(1);
  const { data, isPending, isError, error, isPlaceholderData } = useUploads(page);

  if (isPending) return <LoadingSpinner />;
  if (isError) return <p className="text-red-600">{getErrorMessage(error)}</p>;

  if (data.total === 0) {
    return (
      <p>
        No hay uploads todavía.{' '}
        <Link href="/uploads/new" className="text-blue-600 underline">Sube el primero</Link>
      </p>
    );
  }

  const totalPages = Math.max(1, Math.ceil(data.total / data.limit));

  return (
    <div className="space-y-4">
      <table className="w-full text-left text-sm">
        <thead className="border-b font-medium">
          <tr>
            <th className="py-2">Archivo</th>
            <th>Estado</th>
            <th>Fecha de subida</th>
            <th>Filas procesadas</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.data.map((upload) => (
            <tr key={upload.id} className="border-b">
              <td className="py-2">{upload.fileName}</td>
              <td><StatusBadge status={upload.status} /></td>
              <td>{formatDateTime(upload.createdAt)}</td>
              <td>{upload.processedRows ?? '-'}</td>
              <td>
                <Link href={`/uploads/${upload.id}`} className="text-blue-600 underline">
                  Ver detalle
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex items-center gap-4">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="rounded border px-3 py-1 disabled:opacity-50"
        >
          Anterior
        </button>
        <span>Página {page} de {totalPages}</span>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={page >= totalPages || isPlaceholderData}
          className="rounded border px-3 py-1 disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}