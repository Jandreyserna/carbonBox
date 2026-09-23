import { Badge } from '@/shared/components/ui/badge';
import { cn } from '@/shared/lib/utils';
import { uploadStatusMeta } from '@/features/document-processing/lib/upload-status';
import type { UploadStatus } from '@/features/document-processing/types/upload.types';

export function StatusBadge({ status }: { status: UploadStatus }) {
  const { label, icon: Icon, toneClassName } = uploadStatusMeta[status];

  return (
    <Badge className={cn(toneClassName, status === 'PROCESSING' && '[&>svg]:animate-spin')}>
      <Icon data-icon="inline-start" />
      {label}
    </Badge>
  );
}
