export type UploadStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export interface Upload {
    id: string;
    fileName: string;
    status: UploadStatus;
    userId: string;
    totalRows?: number;
    processedRows?: number;
    failedRows?: number;
    errorMessage?: string;
    createdAt: string;
    updatedAt: string;
}

export interface PaginatedUploads {
    data: Upload[];
    total: number;
    page: number;
    limit: number;
}

export interface ActivityDataRow {
    category: string;
    amount: number;
    unit: string;
    date: string;
}

export interface UploadResults {
    data: ActivityDataRow[];
}

export interface UploadSummary {
    total: number;
    pending: number;
    processing: number;
    completed: number;
    failed: number;
}

export interface CreateUploadResponse {
    id: string;
}

