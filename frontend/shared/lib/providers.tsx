'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Metadata } from 'next/types';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(
        () => new QueryClient({ defaultOptions: { queries: { refetchOnWindowFocus: false } } })
    );

    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

export const metadata: Metadata = { title: 'CarbonBox', description: 'Procesamiento de documentos' };
