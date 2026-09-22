import { FastifyRequest, FastifyReply } from "fastify";
import { Either } from "@shared/domain/Either";
import { AppError } from "@shared/domain/AppError";
import { IHttpRequest } from "./IHttpRequest";
import { IHttpResponse } from "./IHttpResponse";

export abstract class BaseController {
    protected abstract handle(request: IHttpRequest): Promise<Either<AppError, IHttpResponse>>;

    async execute(req: FastifyRequest, res: FastifyReply): Promise<void> {
        const httpRequest = this.toHttpRequest(req);
        const result = await this.handle(httpRequest);

        if (result.isLeft()) {
            const error = result.value;
            res.code(error.statusCode).send({ error: error.message });
            return;
        }

        const httpResponse = result.value;
        res.code(httpResponse.statusCode).send(httpResponse.body);
    }

    private toHttpRequest(req: FastifyRequest): IHttpRequest {
        return {
            body: req.body,
            query: req.query,
            params: req.params,
        };
    }
}