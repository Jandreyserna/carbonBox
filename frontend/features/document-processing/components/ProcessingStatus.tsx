import type { UploadStatus } from '@/features/document-processing/types/upload.types';

export function ProcessingStatus({ status }: { status: UploadStatus }) {
  return (
    <div className="space-y-2">
      <div className="h-2 w-full animate-pulse rounded bg-blue-400" />
      <p className="text-sm">
        {status === 'PENDING' ? 'En cola, esperando al worker…' : 'Procesando…'}
      </p>
    </div>
  );
}