import { Upload } from '@domain/entities';
import { GetUploadByIdQuery } from '@application/queries/objects';
import { IQueryHandler } from '@shared/application/IQueryHandler';
import { AppError, NotFoundError, Either } from '@shared/domain';
import { BaseController, IHttpRequest, IHttpResponse } from '@shared/infrastructure/http';

interface GetUploadByIdParams {
    id: string;
}

export class GetUploadByIdController extends BaseController {
    public constructor(
        private readonly getUploadByIdQueryHandler: IQueryHandler<GetUploadByIdQuery, Upload>,
    ) {
        super();
    }

    protected async handle(request: IHttpRequest): Promise<Either<AppError, IHttpResponse>> {
        const { id } = request.params as GetUploadByIdParams;

        const result = await this.getUploadByIdQueryHandler.execute({ id });

        if (result.isLeft()) {
            return Either.left(new NotFoundError(result.value.message));
        }

        const upload = result.value;

        return Either.right({
            statusCode: 200,
            body: {
                id: upload.id,
                fileName: upload.fileName,
                status: upload.status,
                userId: upload.userId,
                totalRows: upload.totalRows,
                processedRows: upload.processedRows,
                failedRows: upload.failedRows,
                errorMessage: upload.errorMessage,
                createdAt: upload.createdAt,
                updatedAt: upload.updatedAt,
            },
        });
    }
}