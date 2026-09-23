import { Upload } from "@domain/entities";

export interface ListUploadQuery {
    userId: string;
    page: number;
    limit: number;
}

export interface ListUploadQueryResult {
    data: Upload[];
    total: number;
    page: number;
    limit: number;
}