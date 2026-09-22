import { Upload } from "@domain/entities/Upload";
import { ICommandHandler } from "@shared/application/ICommandHandler";
import { CreateUploadCommand } from "../objects/CreateUploadCommand";
import { IUploadRepository } from "@domain/repositories/IUploadRepository";
import { Either } from "@shared/domain/Either";

export class CreateUploadCommandHandler implements ICommandHandler<CreateUploadCommand, Upload> {
    constructor(private readonly uploadRepository: IUploadRepository) {}

    async execute(command: CreateUploadCommand): Promise<Either<Error, Upload>> {
        const uploadOrError = Upload.create({
            fileName: command.fileName,
            fileUrl: command.fileUrl,
            userId: command.userId,
        });

        if (uploadOrError.isLeft()) {
            return Either.left(uploadOrError.value);
        }

        await this.uploadRepository.save(uploadOrError.value);
        return Either.right(uploadOrError.value);
    }
}