import Link from 'next/link';
import { Upload } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

export function NewUploadButton() {
  return (
    <Button asChild>
      <Link href="/uploads/new">
        <Upload data-icon="inline-start" />
        Nuevo upload
      </Link>
    </Button>
  );
}
