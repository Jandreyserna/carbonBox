import { ICommandHandler } from "@shared/application/ICommandHandler";
import { ProcessFileCommand } from "../objects";
import { Either } from "@shared/domain";
import { FileProcessingService } from "@application/services";


export class ProcessFileCommandHandler implements ICommandHandler<ProcessFileCommand, void> {
    constructor(
        private readonly fileProcessingService: FileProcessingService,
        /* private readonly activityDataRepository: IActivityDataRepository,
        private readonly fileStorage: IFileStorage,
        private readonly csvParserService: CsvParserService, */
    ) {}

    async execute(command: ProcessFileCommand): Promise<Either<Error, void>> {
        return this.fileProcessingService.process(command.uploadId);
        /* const upload = await this.uploadRepository.findById(command.uploadId);
        if (!upload) {
            return Either.left(new Error(`Upload con ID ${command.uploadId} no encontrado`));
        }

        upload.markAsProcessing();
        await this.uploadRepository.save(upload);

        const buffer = await this.fileStorage.download(upload.fileUrl);
        const parseResult = await this.csvParserService.parse(buffer, upload.id);

        if (parseResult.isLeft()) {
            upload.markAsFailed(parseResult.value.message);
            await this.uploadRepository.save(upload);
            return Either.left(parseResult.value);
        }

        const { validRows, failedCount } = parseResult.value;
        await this.activityDataRepository.saveMany(validRows);

        upload.markAsCompleted(validRows.length + failedCount, validRows.length, failedCount);
        await this.uploadRepository.save(upload);

        return Either.right(undefined); */
    }
}