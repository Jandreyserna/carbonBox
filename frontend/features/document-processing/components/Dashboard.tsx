'use client';

import { Files } from 'lucide-react';
import { useUploadsSummary } from '@/features/document-processing/api/hooks';
import { uploadStatusMeta } from '@/features/document-processing/lib/upload-status';
import type { UploadSummary } from '@/features/document-processing/types/upload.types';
import { getErrorMessage } from '@/shared/lib/api-client';
import { ErrorAlert } from '@/shared/components/ErrorAlert';
import { PageHeader } from '@/shared/components/PageHeader';
import { StatCard } from '@/shared/components/StatCard';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { NewUploadButton } from './NewUploadButton';
import { UploadsStatusChart } from './UploadsStatusChart';

function buildStats(summary: UploadSummary) {
  const { COMPLETED, PROCESSING, FAILED } = uploadStatusMeta;

  return [
    { label: 'Total de uploads', value: summary.total, icon: Files, toneClassName: 'bg-brand/10 text-brand' },
    { label: 'Completados', value: summary.completed, icon: COMPLETED.icon, toneClassName: COMPLETED.toneClassName },
    { label: 'En proceso', value: summary.processing + summary.pending, icon: PROCESSING.icon, toneClassName: PROCESSING.toneClassName },
    { label: 'Fallidos', value: summary.failed, icon: FAILED.icon, toneClassName: FAILED.toneClassName },
  ];
}

function DashboardSkeleton() {
  return (
    <div role="status" aria-label="Cargando" className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} className="h-26 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-80 rounded-xl" />
    </div>
  );
}

function DashboardBody() {
  const { data, isPending, isError, error } = useUploadsSummary();

  if (isPending) return <DashboardSkeleton />;
  if (isError) return <ErrorAlert message={getErrorMessage(error)} />;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {buildStats(data).map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>
      <UploadsStatusChart summary={data} />
    </div>
  );
}

export function Dashboard() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Resumen"
        description="Estado general del procesamiento de tus archivos."
        actions={<NewUploadButton />}
      />
      <DashboardBody />
    </div>
  );
}
