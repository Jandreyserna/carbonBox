import { CreateUploadCommand } from '@application/commands/objects/CreateUploadCommand';
import { Upload } from '@domain/entities/Upload';
import { ICommandHandler } from '@shared/application/ICommandHandler';
import { BaseController } from '@shared/infrastructure/http/BaseController';
import { IHttpRequest } from '@shared/infrastructure/http/IHttpRequest';
import { IHttpResponse } from '@shared/infrastructure/http/IHttpResponse';

export class CreateUploadController extends BaseController {
    public constructor(private readonly createUploadCommandHandler: ICommandHandler<CreateUploadCommand, Upload>) {
        super();
    }

    protected async handle(request: IHttpRequest): Promise<IHttpResponse> {
        const body = request.body as CreateUploadCommand;
        const result = await this.createUploadCommandHandler.execute(body);

        if (result.isLeft()) {
            return {
                statusCode: 400,
                body: { error: result.value.message },
            };
        }

        return {
            statusCode: 201,
            body: { id: result.value.id },
        };
    }
}