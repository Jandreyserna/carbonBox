import {
  uploadStatusMeta,
  type InProgressStatus,
} from '@/features/document-processing/lib/upload-status';
import { Card, CardContent } from '@/shared/components/ui/card';
import { cn } from '@/shared/lib/utils';

const statusCopy: Record<InProgressStatus, { title: string; description: string }> = {
  PENDING: {
    title: 'En cola',
    description: 'Tu archivo está esperando a que el worker lo tome.',
  },
  PROCESSING: {
    title: 'Procesando archivo',
    description: 'Estamos validando y guardando las filas. Esta página se actualiza sola.',
  },
};

export function ProcessingStatus({ status }: { status: InProgressStatus }) {
  const { title, description } = statusCopy[status];
  const { icon: Icon, toneClassName } = uploadStatusMeta[status];

  return (
    <Card role="status" aria-live="polite">
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3">
          <div className={cn('flex size-9 shrink-0 items-center justify-center rounded-lg', toneClassName)}>
            <Icon className={cn('size-4', status === 'PROCESSING' && 'animate-spin')} />
          </div>
          <div className="space-y-1">
            <p className="font-medium">{title}</p>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        <div className="h-1 overflow-hidden rounded-full bg-muted">
          <div className="h-full w-1/3 animate-indeterminate rounded-full bg-brand" />
        </div>
      </CardContent>
    </Card>
  );
}
