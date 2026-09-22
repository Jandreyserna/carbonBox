import { Upload } from "@domain/entities/Upload";
import { FileName } from "@domain/value-objects/FileNameProps";
import { ICommandHandler } from "@shared/application/ICommandHandler";
import { CreateUploadCommand } from "../objects/CreateUploadCommand";
import { IUploadRepository } from "@domain/repositories/IUploadRepository";
import { IFileStorage } from "@domain/repositories/IFileStorage";
import { Either } from "@shared/domain/Either";

export class CreateUploadCommandHandler implements ICommandHandler<CreateUploadCommand, Upload> {
    constructor(
        private readonly uploadRepository: IUploadRepository,
        private readonly fileStorage: IFileStorage,
    ) {}

    async execute(command: CreateUploadCommand): Promise<Either<Error, Upload>> {
        const fileNameOrError = FileName.create(command.fileName);
        if (fileNameOrError.isLeft()) {
            return Either.left(fileNameOrError.value);
        }

        const { url } = await this.fileStorage.upload(command.fileName, command.fileBuffer);

        const uploadOrError = Upload.create({
            fileName: command.fileName,
            fileUrl: url,
            userId: command.userId,
        });

        if (uploadOrError.isLeft()) {
            return Either.left(uploadOrError.value);
        }

        await this.uploadRepository.save(uploadOrError.value);
        return Either.right(uploadOrError.value);
    }
}