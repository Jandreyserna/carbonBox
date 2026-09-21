import { FastifyRequest, FastifyReply } from "fastify";
import { IHttpRequest } from "./IHttpRequest";
import { IHttpResponse } from "./IHttpResponse";

export abstract class baseController {
    protected abstract handle(request: IHttpRequest): Promise<IHttpResponse>;

    async execute(req: FastifyRequest, res: FastifyReply): Promise<void> {
        const httpRequest = this.toHttpRequest(req);
        const httpResponse = await this.handle(httpRequest);
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