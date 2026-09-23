'use client';

import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createUpload, getUploadById, getUploadResults, getUploads, getUploadsSummary } from './uploadApi';

export const uploadKeys = {
  all: ['uploads'] as const,
  list: (page: number) => ['uploads', 'list', page] as const,
  detail: (id: string) => ['uploads', 'detail', id] as const,
  results: (id: string) => ['uploads', 'results', id] as const,
  summary: ['uploads', 'summary'] as const,
};

export function useUploads(page: number) {
  return useQuery({
    queryKey: uploadKeys.list(page),
    queryFn: () => getUploads(page),
    placeholderData: keepPreviousData, 
  });
}

export function useUpload(id: string) {
  return useQuery({
    queryKey: uploadKeys.detail(id),
    queryFn: () => getUploadById(id),

    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === 'PENDING' || status === 'PROCESSING' ? 3000 : false;
    },
  });
}

export function useUploadResults(id: string, enabled: boolean) {
  return useQuery({
    queryKey: uploadKeys.results(id),
    queryFn: () => getUploadResults(id),
    enabled,
  });
}

export function useUploadsSummary() {
  return useQuery({ queryKey: uploadKeys.summary, queryFn: getUploadsSummary });
}

export function useCreateUpload() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ file, onProgress }: { file: File; onProgress?: (p: number) => void }) =>
      createUpload(file, onProgress),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: uploadKeys.all }),
  });
}