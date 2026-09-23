'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { useState } from 'react';
import { Toaster } from '@/shared/components/ui/sonner';
import { TooltipProvider } from '@/shared/components/ui/tooltip';

// The theme script only needs to run from the server HTML; marking it inert on the client
// avoids React's "script tag while rendering" warning (see Next.js "Preventing Flash" guide).
const themeScriptProps = { type: typeof window === 'undefined' ? 'text/javascript' : 'text/plain' };

export function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(
        () => new QueryClient({ defaultOptions: { queries: { refetchOnWindowFocus: false } } })
    );

    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
                scriptProps={themeScriptProps}
            >
                <TooltipProvider>
                    {children}
                    <Toaster position="top-right" />
                </TooltipProvider>
            </ThemeProvider>
        </QueryClientProvider>
    );
}
