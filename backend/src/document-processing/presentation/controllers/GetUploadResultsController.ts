import { GetUploadResultsQuery, GetUploadResultsQueryResult } from "@application/queries/objects";
import { IQueryHandler } from "@shared/application";
import { AppError, Either, NotFoundError } from "@shared/domain";
import { BaseController, IHttpRequest, IHttpResponse } from "@shared/infrastructure/http";

interface GetUploadResultsParams {
    id: string;
}

export class GetUploadResultsController extends BaseController {
    public constructor(
        private readonly getUploadResultsQueryHandler: IQueryHandler<GetUploadResultsQuery, GetUploadResultsQueryResult>,
    ) {
        super();
    }

    protected async handle(request: IHttpRequest): Promise<Either<AppError, IHttpResponse>> {
        const { id } = request.params as GetUploadResultsParams;

        const result = await this.getUploadResultsQueryHandler.execute({ uploadId: id });

        if (result.isLeft()) {
            return Either.left(new NotFoundError(result.value.message));
        }

        return Either.right({
            statusCode: 200,
            body: {
                data: result.value.data.map((activityData) => ({
                    category: activityData.category,
                    amount: activityData.amount,
                    unit: activityData.unit,
                    date: activityData.date,
                })),
            },
        });
    }
}
