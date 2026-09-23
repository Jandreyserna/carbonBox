import { IActivityDataRepository, IFileStorage, IUploadRepository } from "@domain/repositories";
import { CsvParserService } from "./CsvParserService";
import { Either } from "@shared/domain";

export class FileProcessingService {
    constructor(
        private readonly uploadRepository: IUploadRepository,
        private readonly activityDataRepository: IActivityDataRepository,
        private readonly fileStorage: IFileStorage,
        private readonly csvParserService: CsvParserService,
    ) {}

    async process(uploadId: string): Promise<Either<Error, void>> {
        const upload = await this.uploadRepository.findById(uploadId);
        if (!upload) {
            return Either.left(new Error(`Upload con ID ${uploadId} no encontrado`));
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

        const { validRows, invalidRowsCount, totalRows } = parseResult.value;
        await this.activityDataRepository.saveMany(validRows);

        upload.markAsCompleted(totalRows, validRows.length, invalidRowsCount);
        await this.uploadRepository.save(upload);

        return Either.right(undefined);
    }

}