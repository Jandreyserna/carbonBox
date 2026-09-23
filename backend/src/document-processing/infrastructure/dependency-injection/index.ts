import { AwilixContainer, asClass } from "awilix";
import { PrismaUploadRepository , PrismaActivityDataRepository} from "../persistence/repositories";
import { S3FileStorage } from "../storage/S3FileStorage";
import { CreateUploadCommandHandler, ProcessFileCommandHandler } from "@application/commands/handlers";
import { CreateUploadController } from "@presentation/controllers";
import { CsvParserService, FileProcessingService } from "@application/services";
import { SqsMessagePublisher, SqsMessageConsumer } from "@infrastructure/messaging";

export function registerDocumentProcessingModule(container: AwilixContainer) {
    container.register({
        messagePublisher: asClass(SqsMessagePublisher).singleton(),
        messageConsumer: asClass(SqsMessageConsumer).singleton(),
        fileProcessingService: asClass(FileProcessingService).singleton(),
        //repositories
        uploadRepository: asClass(PrismaUploadRepository).singleton(),
        activityDataRepository: asClass(PrismaActivityDataRepository).singleton(),
        fileStorage: asClass(S3FileStorage).singleton(),
        csvParserService: asClass(CsvParserService).singleton(),
        
        processFileCommandHandler: asClass(ProcessFileCommandHandler).singleton(),
        createUploadCommandHandler: asClass(CreateUploadCommandHandler).singleton(),

        createUploadController: asClass(CreateUploadController).singleton(),
    });
}