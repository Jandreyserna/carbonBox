'use client';

import Link from 'next/link';
import { useUploadsSummary } from '@/features/document-processing/api/hooks';
import { getErrorMessage } from '@/shared/lib/api-client';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';

export function Dashboard() {
  const { data, isPending, isError, error } = useUploadsSummary();

  if (isPending) return <LoadingSpinner />;
  if (isError) return <p className="text-red-600">{getErrorMessage(error)}</p>;

  const cards = [
    { label: 'Total de uploads', value: data.total, color: 'text-gray-900' },
    { label: 'Completados', value: data.completed, color: 'text-green-700' },
    { label: 'En proceso', value: data.processing + data.pending, color: 'text-blue-700' },
    { label: 'Fallidos', value: data.failed, color: 'text-red-700' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Resumen</h1>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded border p-4">
            <p className="text-sm">{card.label}</p>
            <p className={`text-3xl font-bold ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      <Link href="/uploads/new" className="inline-block rounded bg-blue-600 px-4 py-2 text-white">
        Crear nuevo upload
      </Link>
    </div>
  );
}
