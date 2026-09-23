import { UploadStatusCount } from "@domain/repositories";

export interface GetUploadsSummaryQuery {
    userId: string;
}

export type GetUploadsSummaryQueryResult = UploadStatusCount;
