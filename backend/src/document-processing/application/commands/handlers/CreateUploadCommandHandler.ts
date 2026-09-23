import { Upload } from "@domain/entities";
import { FileName } from "@domain/value-objects";
import { ICommandHandler } from "@shared/application";
import { CreateUploadCommand } from "../objects";
import { IUploadRepository, IFileStorage } from "@domain/repositories";
import { Either } from "@shared/domain";
import { IMessagePublisher } from "@shared/infrastructure/messaging";

export class CreateUploadCommandHandler implements ICommandHandler<CreateUploadCommand, Upload> {
    constructor(
        private readonly uploadRepository: IUploadRepository,
        private readonly fileStorage: IFileStorage,
        private readonly messagePublisher: IMessagePublisher<{ uploadId: string }>,
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
        await this.messagePublisher.publish({ uploadId: uploadOrError.value.id });
        return Either.right(uploadOrError.value);
    }
}