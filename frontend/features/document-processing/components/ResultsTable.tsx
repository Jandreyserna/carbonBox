'use client';

import { useUploadResults } from '@/features/document-processing/api/hooks';
import { getErrorMessage } from '@/shared/lib/api-client';
import { formatDate } from '@/shared/lib/format-date';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';

export function ResultsTable({ uploadId }: { uploadId: string }) {
  const { data, isPending, isError, error } = useUploadResults(uploadId, true);

  if (isPending) return <LoadingSpinner />;
  if (isError) return <p className="text-red-600">{getErrorMessage(error)}</p>;
  if (data.data.length === 0) return <p>El archivo no tiene filas válidas.</p>;

  return (
    <table className="w-full text-left text-sm">
      <thead className="border-b font-medium">
        <tr>
          <th className="py-2">Categoría</th>
          <th>Cantidad</th>
          <th>Unidad</th>
          <th>Fecha</th>
        </tr>
      </thead>
      <tbody>
        {data.data.map((row, index) => (
          <tr key={index} className="border-b">
            <td className="py-2">{row.category}</td>
            <td>{row.amount}</td>
            <td>{row.unit}</td>
            <td>{formatDate(row.date)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}