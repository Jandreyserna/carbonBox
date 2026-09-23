import { Upload } from "@domain/entities";
import { IUploadRepository } from "@domain/repositories";
import { IQueryHandler } from "@shared/application/IQueryHandler";
import { Either } from "@shared/domain";
import { GetUploadByIdQuery } from "../objects";

export class GetUploadByIdQueryHandler implements IQueryHandler<GetUploadByIdQuery, Upload> {
    constructor(private readonly uploadRepository: IUploadRepository) {}

    async execute(query: GetUploadByIdQuery): Promise<Either<Error, Upload>> {
        const upload = await this.uploadRepository.findById(query.id);

        if (!upload) {
            return Either.left(new Error(`Upload con id ${query.id} no encontrado`));
        }

        return Either.right(upload);
    }
}
