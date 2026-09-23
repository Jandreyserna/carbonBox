import type { LucideIcon } from 'lucide-react';
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { formatNumber } from '@/shared/lib/format-number';
import { cn } from '@/shared/lib/utils';

interface StatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  toneClassName: string;
}

export function StatCard({ label, value, icon: Icon, toneClassName }: StatCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-3xl font-semibold tabular-nums">{formatNumber(value)}</CardTitle>
        <CardAction>
          <div className={cn('flex size-9 items-center justify-center rounded-lg', toneClassName)}>
            <Icon className="size-4" />
          </div>
        </CardAction>
      </CardHeader>
    </Card>
  );
}
