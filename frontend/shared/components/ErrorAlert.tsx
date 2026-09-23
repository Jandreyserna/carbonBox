import { CircleAlert } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/shared/components/ui/alert';

interface ErrorAlertProps {
  message: string;
  title?: string;
}

export function ErrorAlert({ message, title = 'Algo salió mal' }: ErrorAlertProps) {
  return (
    <Alert variant="destructive">
      <CircleAlert />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
