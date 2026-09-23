import { MultipartFile, MultipartValue } from '@fastify/multipart';
import { CreateUploadCommand } from '@application/commands/objects';
import { Upload } from '@domain/entities';
import { ICommandHandler } from '@shared/application/ICommandHandler';
import { Either, AppError, ValidationError } from '@shared/domain';
import { BaseController, IHttpRequest, IHttpResponse } from '@shared/infrastructure/http';

interface CreateUploadRequestBody {
    file: MultipartFile;
    userId: MultipartValue<string>;
}

export class CreateUploadController extends BaseController {
    public constructor(private readonly createUploadCommandHandler: ICommandHandler<CreateUploadCommand, Upload>) {
        super();
    }

    protected async handle(request: IHttpRequest): Promise<Either<AppError, IHttpResponse>> {
        const body = request.body as CreateUploadRequestBody;

        if (!body.file) {
            return Either.left(new ValidationError('El campo "file" es requerido'));
        }

        const command: CreateUploadCommand = {
            fileName: body.file.filename,
            fileBuffer: await body.file.toBuffer(),
            userId: body.userId?.value,
        };

        const result = await this.createUploadCommandHandler.execute(command);

        if (result.isLeft()) {
            return Either.left(new ValidationError(result.value.message));
        }

        return Either.right({
            statusCode: 201,
            body: { id: result.value.id },
        });
    }
}