'use client';

import { Label, Pie, PieChart, type LabelProps } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/shared/components/ui/chart';
import { formatNumber } from '@/shared/lib/format-number';
import { uploadStatusMeta } from '@/features/document-processing/lib/upload-status';
import type { UploadStatus, UploadSummary } from '@/features/document-processing/types/upload.types';
import { NoUploadsEmpty } from './NoUploadsEmpty';

const STATUS_ORDER: UploadStatus[] = ['COMPLETED', 'PROCESSING', 'PENDING', 'FAILED'];

const chartConfig: ChartConfig = Object.fromEntries(
  STATUS_ORDER.map((status) => [
    status,
    { label: uploadStatusMeta[status].label, color: uploadStatusMeta[status].color },
  ]),
);

function toChartData(summary: UploadSummary) {
  const countByStatus: Record<UploadStatus, number> = {
    PENDING: summary.pending,
    PROCESSING: summary.processing,
    COMPLETED: summary.completed,
    FAILED: summary.failed,
  };

  return STATUS_ORDER.map((status) => ({
    status,
    count: countByStatus[status],
    fill: `var(--color-${status})`,
  }));
}

function toPercent(count: number, total: number): number {
  return total === 0 ? 0 : Math.round((count / total) * 100);
}

function CenterLabel({ viewBox, total }: Pick<LabelProps, 'viewBox'> & { total: number }) {
  if (!viewBox || !('cx' in viewBox)) return null;
  const { cx, cy } = viewBox;

  return (
    <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle">
      <tspan x={cx} y={cy} className="fill-foreground text-3xl font-semibold">
        {formatNumber(total)}
      </tspan>
      <tspan x={cx} y={cy + 24} className="fill-muted-foreground text-xs">
        uploads
      </tspan>
    </text>
  );
}

function StatusBreakdown({ summary }: { summary: UploadSummary }) {
  const chartData = toChartData(summary);

  return (
    <div className="grid items-center gap-6 md:grid-cols-2">
      <ChartContainer config={chartConfig} className="mx-auto aspect-square w-full max-w-60">
        <PieChart>
          <ChartTooltip cursor={false} content={<ChartTooltipContent nameKey="status" hideLabel />} />
          <Pie data={chartData} dataKey="count" nameKey="status" innerRadius="62%" strokeWidth={4}>
            <Label content={({ viewBox }) => <CenterLabel viewBox={viewBox} total={summary.total} />} />
          </Pie>
        </PieChart>
      </ChartContainer>

      <ul className="space-y-3">
        {chartData.map(({ status, count }) => (
          <li key={status} className="flex items-center gap-3 text-sm">
            <span
              className="size-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: uploadStatusMeta[status].color }}
            />
            <span className="flex-1 text-muted-foreground">{uploadStatusMeta[status].label}</span>
            <span className="font-medium tabular-nums">{formatNumber(count)}</span>
            <span className="w-10 text-right text-muted-foreground tabular-nums">
              {toPercent(count, summary.total)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function UploadsStatusChart({ summary }: { summary: UploadSummary }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribución por estado</CardTitle>
        <CardDescription>Todos los archivos que has subido</CardDescription>
      </CardHeader>
      <CardContent>
        {summary.total === 0 ? <NoUploadsEmpty /> : <StatusBreakdown summary={summary} />}
      </CardContent>
    </Card>
  );
}
