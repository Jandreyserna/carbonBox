import { apiClient } from '@/shared/lib/api-client';
import type {
  CreateUploadResponse, PaginatedUploads, Upload, UploadResults, UploadSummary,
} from '../types/upload.types';

export const USER_ID = 'user-123';

export async function createUpload(file: File, onProgress?: (percent: number) => void) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('userId', USER_ID);

  const { data } = await apiClient.post<CreateUploadResponse>('/uploads', formData, {
    onUploadProgress: (event) => {
      if (event.total) onProgress?.(Math.round((event.loaded / event.total) * 100));
    },
  });
  return data;
}

export async function getUploads(page: number, limit = 10) {
  const { data } = await apiClient.get<PaginatedUploads>('/uploads', {
    params: { page, limit, userId: USER_ID },
  });
  return data;
}

export async function getUploadById(id: string) {
  const { data } = await apiClient.get<Upload>(`/uploads/${id}`);
  return data;
}

export async function getUploadResults(id: string) {
  const { data } = await apiClient.get<UploadResults>(`/uploads/${id}/results`);
  return data;
}

export async function getUploadsSummary() {
  const { data } = await apiClient.get<UploadSummary>('/uploads/summary', {
    params: { userId: USER_ID },
  });
  return data;
}