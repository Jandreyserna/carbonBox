import { GetUploadsSummaryQuery, GetUploadsSummaryQueryResult } from "@application/queries/objects";
import { IQueryHandler } from "@shared/application";
import { AppError, Either } from "@shared/domain";
import { BaseController, IHttpRequest, IHttpResponse } from "@shared/infrastructure/http";

interface GetUploadsSummaryRawQuery {
    userId?: string;
}

const DEFAULT_USER_ID = 'user-123';

export class GetUploadsSummaryController extends BaseController {
    public constructor(
        private readonly getUploadsSummaryQueryHandler: IQueryHandler<GetUploadsSummaryQuery, GetUploadsSummaryQueryResult>,
    ) {
        super();
    }

    protected async handle(request: IHttpRequest): Promise<Either<AppError, IHttpResponse>> {
        const raw = request.query as GetUploadsSummaryRawQuery;

        const result = await this.getUploadsSummaryQueryHandler.execute({
            userId: raw.userId ?? DEFAULT_USER_ID,
        });

        if (result.isLeft()) {
            throw result.value;
        }

        return Either.right({
            statusCode: 200,
            body: result.value,
        });
    }
}
