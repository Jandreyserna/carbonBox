import { FileSpreadsheet } from 'lucide-react';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/shared/components/ui/empty';
import { NewUploadButton } from './NewUploadButton';

export function NoUploadsEmpty() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FileSpreadsheet />
        </EmptyMedia>
        <EmptyTitle>Aún no hay uploads</EmptyTitle>
        <EmptyDescription>
          Sube tu primer archivo CSV para empezar a procesar tus datos de actividad.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <NewUploadButton />
      </EmptyContent>
    </Empty>
  );
}
