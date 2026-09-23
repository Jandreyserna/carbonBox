import { IQueryHandler } from "@shared/application";
import { GetUploadsSummaryQuery, GetUploadsSummaryQueryResult } from "../objects";
import { IUploadRepository } from "@domain/repositories";
import { Either } from "@shared/domain";

export class GetUploadsSummaryQueryHandler implements IQueryHandler<GetUploadsSummaryQuery, GetUploadsSummaryQueryResult> {
    constructor(private readonly uploadRepository: IUploadRepository) {}

    async execute(query: GetUploadsSummaryQuery): Promise<Either<Error, GetUploadsSummaryQueryResult>> {
        const counts = await this.uploadRepository.countByStatus(query.userId);

        return Either.right(counts);
    }
}
