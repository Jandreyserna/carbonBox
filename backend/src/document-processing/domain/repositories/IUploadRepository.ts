import { Upload } from '../entities';

export interface ListUploadsFilter { userId: string; page: number; limit: number; }
export interface ListUploadsResult { data: Upload[]; total: number; }
export interface UploadStatusCount {
  total: number;
  pending: number;
  processing: number;
  completed: number;
  failed: number;
}

export interface IUploadRepository {
  save(upload: Upload): Promise<void>;
  findById(id: string): Promise<Upload | null>;
  list(filter: ListUploadsFilter): Promise<ListUploadsResult>;
  countByStatus(userId: string): Promise<UploadStatusCount>;
}