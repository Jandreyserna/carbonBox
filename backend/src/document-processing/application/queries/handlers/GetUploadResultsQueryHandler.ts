import { IQueryHandler } from '@shared/application';
import { GetUploadResultsQuery, GetUploadResultsQueryResult } from '../objects';
import { IActivityDataRepository, IUploadRepository } from '@domain/repositories';
import { Either } from '@shared/domain';

export class GetUploadResultsQueryHandler implements IQueryHandler<GetUploadResultsQuery, GetUploadResultsQueryResult> {
    constructor(
        private readonly uploadRepository: IUploadRepository,
        private readonly activityDataRepository: IActivityDataRepository,
    ) {}

    async execute(query: GetUploadResultsQuery): Promise<Either<Error, GetUploadResultsQueryResult>> {
        const upload = await this.uploadRepository.findById(query.uploadId);

        if (!upload) {
            return Either.left(new Error(`Upload con id ${query.uploadId} no encontrado`));
        }

        const data = await this.activityDataRepository.findByUploadId(query.uploadId);

        return Either.right({ data });
    }
}
