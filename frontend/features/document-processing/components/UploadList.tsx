'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, FileSpreadsheet } from 'lucide-react';
import { useUploads } from '@/features/document-processing/api/hooks';
import type { Upload } from '@/features/document-processing/types/upload.types';
import { getErrorMessage } from '@/shared/lib/api-client';
import { formatDateTime } from '@/shared/lib/format-date';
import { formatNumber } from '@/shared/lib/format-number';
import { cn } from '@/shared/lib/utils';
import { ErrorAlert } from '@/shared/components/ErrorAlert';
import { PageHeader } from '@/shared/components/PageHeader';
import { TableSkeleton } from '@/shared/components/TableSkeleton';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardFooter } from '@/shared/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import { NewUploadButton } from './NewUploadButton';
import { NoUploadsEmpty } from './NoUploadsEmpty';
import { StatusBadge } from './StatusBadge';

function UploadsTable({ uploads }: { uploads: Upload[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Archivo</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Fecha de subida</TableHead>
          <TableHead className="text-right">Filas procesadas</TableHead>
          <TableHead>
            <span className="sr-only">Acciones</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {uploads.map((upload) => (
          <TableRow key={upload.id}>
            <TableCell>
              <div className="flex items-center gap-3 font-medium">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                  <FileSpreadsheet className="size-4" />
                </div>
                <span className="max-w-64 truncate">{upload.fileName}</span>
              </div>
            </TableCell>
            <TableCell>
              <StatusBadge status={upload.status} />
            </TableCell>
            <TableCell className="text-muted-foreground">{formatDateTime(upload.createdAt)}</TableCell>
            <TableCell className="text-right tabular-nums">{formatNumber(upload.processedRows)}</TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/uploads/${upload.id}`}>
                  Ver detalle
                  <ChevronRight data-icon="inline-end" />
                </Link>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function UploadListBody() {
  const [page, setPage] = useState(1);
  const { data, isPending, isError, error, isPlaceholderData } = useUploads(page);

  if (isPending) {
    return (
      <Card>
        <CardContent>
          <TableSkeleton />
        </CardContent>
      </Card>
    );
  }

  if (isError) return <ErrorAlert message={getErrorMessage(error)} />;

  if (data.total === 0) {
    return (
      <Card>
        <CardContent>
          <NoUploadsEmpty />
        </CardContent>
      </Card>
    );
  }

  const totalPages = Math.max(1, Math.ceil(data.total / data.limit));

  return (
    <Card>
      <CardContent className={cn('transition-opacity', isPlaceholderData && 'opacity-60')}>
        <UploadsTable uploads={data.data} />
      </CardContent>
      <CardFooter className="justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          Página {page} de {totalPages} · {formatNumber(data.total)} uploads
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            <ChevronLeft data-icon="inline-start" />
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= totalPages || isPlaceholderData}
          >
            Siguiente
            <ChevronRight data-icon="inline-end" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

export function UploadList() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Uploads"
        description="Historial de archivos CSV y su estado de procesamiento."
        actions={<NewUploadButton />}
      />
      <UploadListBody />
    </div>
  );
}
