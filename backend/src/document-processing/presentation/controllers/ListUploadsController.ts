import { ListUploadQuery, ListUploadQueryResult } from "@application/queries/objects";
import { IQueryHandler } from "@shared/application";
import { AppError, Either, ValidationError } from "@shared/domain";
import { BaseController, IHttpRequest, IHttpResponse } from "@shared/infrastructure/http";

interface ListUploadsRawQuery {
    page?: string;
    limit?: string;
    userId?: string;
}

const DEFAULT_USER_ID = 'user-123';
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

export class ListUploadsController extends BaseController {
    public constructor(
        private readonly listUploadQueryHandler: IQueryHandler<ListUploadQuery, ListUploadQueryResult>,
    ) {
        super();
    }

    protected async handle(request: IHttpRequest): Promise<Either<AppError, IHttpResponse>> {
        const raw = request.query as ListUploadsRawQuery;

        const page = raw.page === undefined ? DEFAULT_PAGE : Number(raw.page);
        const limit = raw.limit === undefined ? DEFAULT_LIMIT : Number(raw.limit);

        if (!Number.isInteger(page) || page < 1) {
            return Either.left(new ValidationError('"page" debe ser un entero mayor o igual a 1'));
        }
        if (!Number.isInteger(limit) || limit < 1 || limit > MAX_LIMIT) {
            return Either.left(new ValidationError(`"limit" debe ser un entero entre 1 y ${MAX_LIMIT}`));
        }

        const result = await this.listUploadQueryHandler.execute({
            userId: raw.userId ?? DEFAULT_USER_ID,
            page,
            limit,
        });

        if (result.isLeft()) {
            throw result.value;
        }

        const { data, total } = result.value;

        return Either.right({
            statusCode: 200,
            body: {
                data: data.map((upload) => ({
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
                })),
                total,
                page,
                limit,
            },
        });
    }
}
