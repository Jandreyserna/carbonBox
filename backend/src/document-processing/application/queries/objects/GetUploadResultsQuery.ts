import { ActivityData } from "@domain/entities";

export interface GetUploadResultsQuery {
    uploadId: string;
}

export interface GetUploadResultsQueryResult {
    data: ActivityData[];
}
