import { IQueryHandler } from "@shared/application";
import { ListUploadQuery, ListUploadQueryResult } from "../objects";
import { IUploadRepository } from "@domain/repositories";
import { Either } from "@shared/domain";

export class ListUploadQueryHandler implements IQueryHandler<ListUploadQuery, ListUploadQueryResult> {
    constructor(private readonly uploadRepository: IUploadRepository) {}

    async execute(query: ListUploadQuery): Promise<Either<Error, ListUploadQueryResult>> {
        const {data, total} = await this.uploadRepository.list({
            userId: query.userId,
            page: query.page,
            limit: query.limit,
        });

        return Either.right({
            data: data,
            total: total,
            page: query.page,
            limit: query.limit,
        });
    }
}