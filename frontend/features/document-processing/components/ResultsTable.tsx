'use client';

import { TableProperties } from 'lucide-react';
import { useUploadResults } from '@/features/document-processing/api/hooks';
import { getErrorMessage } from '@/shared/lib/api-client';
import { formatDate } from '@/shared/lib/format-date';
import { formatNumber } from '@/shared/lib/format-number';
import { ErrorAlert } from '@/shared/components/ErrorAlert';
import { TableSkeleton } from '@/shared/components/TableSkeleton';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/shared/components/ui/empty';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';

function NoResultsEmpty() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <TableProperties />
        </EmptyMedia>
        <EmptyTitle>Sin filas válidas</EmptyTitle>
        <EmptyDescription>El archivo se procesó, pero ninguna fila pasó la validación.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}

function ResultsTableBody({ uploadId }: { uploadId: string }) {
  const { data, isPending, isError, error } = useUploadResults(uploadId, true);

  if (isPending) return <TableSkeleton />;
  if (isError) return <ErrorAlert message={getErrorMessage(error)} />;
  if (data.data.length === 0) return <NoResultsEmpty />;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Categoría</TableHead>
          <TableHead className="text-right">Cantidad</TableHead>
          <TableHead>Unidad</TableHead>
          <TableHead>Fecha</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.data.map((row, index) => (
          <TableRow key={index}>
            <TableCell className="font-medium">{row.category}</TableCell>
            <TableCell className="text-right tabular-nums">{formatNumber(row.amount)}</TableCell>
            <TableCell className="text-muted-foreground">{row.unit}</TableCell>
            <TableCell className="text-muted-foreground">{formatDate(row.date)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export function ResultsTable({ uploadId }: { uploadId: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Resultados</CardTitle>
        <CardDescription>Filas válidas extraídas del archivo</CardDescription>
      </CardHeader>
      <CardContent>
        <ResultsTableBody uploadId={uploadId} />
      </CardContent>
    </Card>
  );
}
