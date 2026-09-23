import { CircleCheck, CircleX, Clock, LoaderCircle, type LucideIcon } from 'lucide-react';
import type { UploadStatus } from '@/features/document-processing/types/upload.types';

interface UploadStatusMeta {
  label: string;
  icon: LucideIcon;
  toneClassName: string;
  color: string;
}

export const uploadStatusMeta: Record<UploadStatus, UploadStatusMeta> = {
  PENDING: {
    label: 'Pendiente',
    icon: Clock,
    toneClassName: 'bg-status-pending/10 text-status-pending',
    color: 'var(--status-pending)',
  },
  PROCESSING: {
    label: 'Procesando',
    icon: LoaderCircle,
    toneClassName: 'bg-status-processing/10 text-status-processing',
    color: 'var(--status-processing)',
  },
  COMPLETED: {
    label: 'Completado',
    icon: CircleCheck,
    toneClassName: 'bg-status-completed/10 text-status-completed',
    color: 'var(--status-completed)',
  },
  FAILED: {
    label: 'Fallido',
    icon: CircleX,
    toneClassName: 'bg-status-failed/10 text-status-failed',
    color: 'var(--status-failed)',
  },
};

export type InProgressStatus = Extract<UploadStatus, 'PENDING' | 'PROCESSING'>;

export function isInProgress(status: UploadStatus): status is InProgressStatus {
  return status === 'PENDING' || status === 'PROCESSING';
}
