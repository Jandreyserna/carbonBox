'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Rows3 } from 'lucide-react';
import { useUpload } from '@/features/document-processing/api/hooks';
import { isInProgress, uploadStatusMeta } from '@/features/document-processing/lib/upload-status';
import type { Upload } from '@/features/document-processing/types/upload.types';
import { getErrorMessage } from '@/shared/lib/api-client';
import { formatDateTime } from '@/shared/lib/format-date';
import { ErrorAlert } from '@/shared/components/ErrorAlert';
import { PageHeader } from '@/shared/components/PageHeader';
import { StatCard } from '@/shared/components/StatCard';
import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { ProcessingStatus } from './ProcessingStatus';
import { ResultsTable } from './ResultsTable';
import { StatusBadge } from './StatusBadge';

function BackToListButton() {
  return (
    <Button variant="outline" asChild>
      <Link href="/uploads">
        <ArrowLeft data-icon="inline-start" />
        Volver a la lista
      </Link>
    </Button>
  );
}

function UploadDetailSkeleton() {
  return (
    <div role="status" aria-label="Cargando" className="space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-8 w-72 max-w-full" />
        <Skeleton className="h-5 w-56 max-w-full" />
      </div>
      <Skeleton className="h-72 rounded-xl" />
    </div>
  );
}

function RowStats({ upload }: { upload: Upload }) {
  const { COMPLETED, FAILED } = uploadStatusMeta;
  const stats = [
    { label: 'Filas totales', value: upload.totalRows ?? 0, icon: Rows3, toneClassName: 'bg-brand/10 text-brand' },
    { label: 'Procesadas', value: upload.processedRows ?? 0, icon: COMPLETED.icon, toneClassName: COMPLETED.toneClassName },
    { label: 'Fallidas', value: upload.failedRows ?? 0, icon: FAILED.icon, toneClassName: FAILED.toneClassName },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}

export function UploadDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: upload, isPending, isError, error } = useUpload(id);

  if (isPending) return <UploadDetailSkeleton />;

  if (isError) {
    return (
      <div className="space-y-4">
        <ErrorAlert title="No pudimos cargar el upload" message={getErrorMessage(error)} />
        <BackToListButton />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title={upload.fileName}
        description={
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={upload.status} />
            <span>Subido el {formatDateTime(upload.createdAt)}</span>
          </div>
        }
        actions={<BackToListButton />}
      />

      {isInProgress(upload.status) && <ProcessingStatus status={upload.status} />}

      {upload.status === 'FAILED' && (
        <ErrorAlert
          title="El procesamiento falló"
          message={upload.errorMessage ?? 'Error desconocido'}
        />
      )}

      {upload.status === 'COMPLETED' && (
        <>
          <RowStats upload={upload} />
          <ResultsTable uploadId={upload.id} />
        </>
      )}
    </div>
  );
}
